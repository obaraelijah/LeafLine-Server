// Basic Lib Imports
const express = require("express");
const router = express.Router();

const adminController = require("./admin.controller");

const { authMiddleware } = require("../../middleware/authMiddleware");

// Routing Implement
router.get("/", authMiddleware, adminController.dashboard);
router.get("/last-sales", authMiddleware, adminController.monthlySales);

module.exports = router;

