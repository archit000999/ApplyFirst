const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

const userValidationRules = () => {
  return [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ];
};

const copilotValidationRules = () => {
  return [
    // Make name optional since it can be auto-generated
    body('name').optional().trim(),
  ];
};

const applicationValidationRules = () => {
  return [
    body('fullName').notEmpty().trim().withMessage('Full name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('isInUS').isIn(['yes', 'no']).withMessage('Please specify if you are in the US'),
    body('careerTrack').isIn([
      'software-engineering',
      'product-management', 
      'data-science',
      'salesforce-consultant',
      'sales-marketing-support',
      'other'
    ]).withMessage('Please select a valid career track'),
    body('isCurrentlyEmployed').isIn(['yes', 'no']).withMessage('Please specify employment status'),
  ];
};

module.exports = {
  validateRequest,
  userValidationRules,
  copilotValidationRules,
  applicationValidationRules
};
