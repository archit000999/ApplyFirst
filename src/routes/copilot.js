const express = require('express');
const { auth } = require('../middleware/auth');
const {
  createConfig,
  updateConfig,
  getConfigs,
  getConfig,
  deleteConfig,
  updateStep
} = require('../controllers/copilotController');
const { copilotValidationRules, validateRequest } = require('../utils/validation');

const router = express.Router();

// All routes require authentication
router.use(auth);

router.get('/', getConfigs);
router.post('/', copilotValidationRules(), validateRequest, createConfig);
router.get('/:id', getConfig);
router.put('/:id', updateConfig);
router.delete('/:id', deleteConfig);

// Special route for updating specific steps
router.put('/:id/step', updateStep);

module.exports = router;
