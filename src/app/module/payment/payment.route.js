// Basic Lib Imports
const express = require('express');
const router = express.Router();

const { createOrder } = require('./payment.controller');

const { authMiddleware } = require('../../middleware/authMiddleware');

// Routing Implement
router.post('/charge/create-order', authMiddleware, createOrder);

module.exports = router;
