const express = require('express');
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { userValidationRules, validateRequest } = require('../utils/validation');

const router = express.Router();

// Public routes
router.post('/register', userValidationRules(), validateRequest, register);
router.post('/login', userValidationRules(), validateRequest, login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

module.exports = router;
