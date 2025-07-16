const express = require('express');
const { auth, optionalAuth } = require('../middleware/auth');
const {
  createApplication,
  getApplications,
  getApplication,
  updateApplicationStatus,
  deleteApplication,
  getAllApplications
} = require('../controllers/applicationController');
const { applicationValidationRules, validateRequest } = require('../utils/validation');

const router = express.Router();

// Public route (can be used without authentication)
router.post('/', optionalAuth, applicationValidationRules(), validateRequest, createApplication);

// Protected routes (require authentication)
router.get('/', auth, getApplications);
router.get('/all', auth, getAllApplications); // Admin route
router.get('/:id', auth, getApplication);
router.put('/:id/status', auth, updateApplicationStatus);
router.delete('/:id', auth, deleteApplication);

module.exports = router;
