const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    linkedIn: String,
    portfolio: String
  },
  subscription: {
    isSubscribed: {
      type: Boolean,
      default: false
    },
    planType: {
      type: String,
      enum: ['free', 'basic', 'premium'],
      default: 'free'
    },
    maxCopilots: {
      type: Number,
      default: 1
    },
    subscriptionId: String,
    currentPeriodEnd: Date,
    customerId: String // Stripe customer ID
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
