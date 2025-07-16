const Payment = require('../models/Payment');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  try {
    const { planType, billingPeriod } = req.body;
    
    // Define pricing
    const pricing = {
      basic: {
        monthly: 99,
        yearly: 990
      },
      premium: {
        monthly: 199,
        yearly: 1990
      }
    };

    const amount = pricing[planType][billingPeriod];
    
    if (!amount) {
      return res.status(400).json({ error: 'Invalid plan or billing period' });
    }

    // Create or get Stripe customer
    let customer;
    if (req.user.subscription.customerId) {
      customer = await stripe.customers.retrieve(req.user.subscription.customerId);
    } else {
      customer = await stripe.customers.create({
        email: req.user.email,
        name: `${req.user.profile.firstName} ${req.user.profile.lastName}`
      });
      
      // Update user with customer ID
      await User.findByIdAndUpdate(req.user._id, {
        'subscription.customerId': customer.id
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      customer: customer.id,
      metadata: {
        userId: req.user._id.toString(),
        planType,
        billingPeriod
      }
    });

    // Save payment record
    const payment = new Payment({
      userId: req.user._id,
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId: customer.id,
      amount,
      status: 'pending',
      planType,
      billingPeriod
    });

    await payment.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ error: error.message });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Update payment status
    const payment = await Payment.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntentId },
      { 
        status: paymentIntent.status,
        subscriptionStartDate: new Date(),
        subscriptionEndDate: new Date(Date.now() + (paymentIntent.metadata.billingPeriod === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000)
      },
      { new: true }
    );

    if (paymentIntent.status === 'succeeded') {
      // Update user subscription
      const maxCopilots = payment.planType === 'premium' ? 10 : 3;
      
      await User.findByIdAndUpdate(req.user._id, {
        'subscription.isSubscribed': true,
        'subscription.planType': payment.planType,
        'subscription.maxCopilots': maxCopilots,
        'subscription.subscriptionId': payment._id,
        'subscription.currentPeriodEnd': payment.subscriptionEndDate
      });
    }

    res.json({
      message: 'Payment confirmed',
      payment,
      status: paymentIntent.status
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json({
      message: 'Payment history retrieved',
      payments
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: error.message });
  }
};

const cancelSubscription = async (req, res) => {
  try {
    // Update user subscription status
    await User.findByIdAndUpdate(req.user._id, {
      'subscription.isSubscribed': false,
      'subscription.planType': 'free',
      'subscription.maxCopilots': 1
    });

    res.json({
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  cancelSubscription
};
