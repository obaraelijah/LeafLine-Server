// Basic Lib Imports
const express = require("express");
const router = express.Router();

const {
  getMe,
  userList,
  findUserById,
} = require("./user.controller");

const { authMiddleware } = require("../../middleware/authMiddleware");

// Routing Implement
router.get("/", userList);
router.get("/user/:id", findUserById);
router.get("/me", authMiddleware, getMe);


module.exports = router;
