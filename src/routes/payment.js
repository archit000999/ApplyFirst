const express = require('express');
const { auth } = require('../middleware/auth');
const {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  cancelSubscription
} = require('../controllers/paymentController');

const router = express.Router();

// All routes require authentication
router.use(auth);

router.post('/create-payment-intent', createPaymentIntent);
router.post('/confirm-payment', confirmPayment);
router.get('/history', getPaymentHistory);
router.post('/cancel-subscription', cancelSubscription);

module.exports = router;
