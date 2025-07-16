const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stripePaymentIntentId: {
    type: String,
    required: true,
    unique: true
  },
  stripeCustomerId: String,
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'succeeded', 'failed', 'canceled', 'refunded'],
    required: true
  },
  planType: {
    type: String,
    enum: ['basic', 'premium'],
    required: true
  },
  billingPeriod: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: true
  },
  subscriptionStartDate: Date,
  subscriptionEndDate: Date,
  metadata: {
    features: [String],
    maxCopilots: Number
  },
  refundInfo: {
    refundId: String,
    refundAmount: Number,
    refundDate: Date,
    reason: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
