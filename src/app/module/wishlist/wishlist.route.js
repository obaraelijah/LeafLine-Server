// Basic Lib Imports
const express = require('express');
const router = express.Router();

const wishlistController = require('./wishlist.controller');

const { authMiddleware } = require('../../middleware/authMiddleware');

// Routing Implement
router.get('/', authMiddleware, wishlistController.getWishlistBooks);
router.post('/add', authMiddleware, wishlistController.addToWishlist);
router.delete('/remove', authMiddleware, wishlistController.removeFromWishlist);

module.exports = router;
