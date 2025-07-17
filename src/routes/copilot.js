const express = require('express');
const { auth } = require('../middleware/auth');
const {
  patchConfig,
  getConfigs,
  getConfig,
  deleteConfig
} = require('../controllers/copilotController');
const { copilotValidationRules, validateRequest } = require('../utils/validation');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET - Retrieve all configurations
router.get('/', getConfigs);

// PATCH - Create or update configuration (unified endpoint)
router.patch('/', copilotValidationRules(), validateRequest, patchConfig);

// GET - Retrieve specific configuration by ID
router.get('/:id', getConfig);

// PATCH - Update specific configuration by ID
router.patch('/:id', patchConfig);

// DELETE - Remove configuration (admin use)
router.delete('/:id', deleteConfig);

module.exports = router;
