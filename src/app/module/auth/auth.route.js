// Basic Lib Imports
const express = require('express');
const router = express.Router();

const {
  createAccountLimiter,
  forgetPasswordLimiter,
  verifyLimiter,
} = require('../../../services/rateLimitService');

const {
  registerUser,
  loginUser,
  logoutUser,
  forgetPassword,
  resetPassword,
  emailVerify,
} = require('./auth.controller');

// Routing Implement
router.post('/register', createAccountLimiter, registerUser);
router.post('/verify', verifyLimiter, emailVerify);
router.post('/login', loginUser);
router.post('/reset-password', resetPassword);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgetPasswordLimiter, forgetPassword);

module.exports = router;
