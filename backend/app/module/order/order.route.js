// Basic Lib Imports
const express = require('express');
const router = express.Router();

const orderController = require('./order.controller');

const { authMiddleware } = require('../../middleware/authMiddleware');

// Routing Implement
router.get('/', authMiddleware, orderController.orderLists);
router.patch('/:orderId/update-status', authMiddleware, orderController.updateOrderStatus);

module.exports = router;
