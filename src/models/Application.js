const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  copilotConfigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CopilotConfig'
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: String,
  linkedinUrl: String,
  isInUS: {
    type: String,
    enum: ['yes', 'no'],
    required: true
  },
  careerTrack: {
    type: String,
    enum: [
      'software-engineering',
      'product-management', 
      'data-science',
      'salesforce-consultant',
      'sales-marketing-support',
      'other'
    ],
    required: true
  },
  isCurrentlyEmployed: {
    type: String,
    enum: ['yes', 'no'],
    required: true
  },
  status: {
    type: String,
    enum: ['submitted', 'reviewed', 'approved', 'rejected'],
    default: 'submitted'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);
