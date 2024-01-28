// Basic Lib Imports
const express = require("express");
const router = express.Router();

const cartController = require("./cart.controller");

const { authMiddleware } = require("../../middleware/authMiddleware");

// Routing Implement
router.get("/", authMiddleware, cartController.getCartItems);
router.post("/add", authMiddleware, cartController.addToCart);
router.put("/updatequantity", authMiddleware, cartController.updateCartItemQuantity);
router.delete("/remove/:productId", authMiddleware, cartController.removeItemFromCart);
router.delete("/remove-all", authMiddleware, cartController.removeAllItemsFromCart);

module.exports = router;
