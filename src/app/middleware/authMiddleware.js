const jwt = require("jsonwebtoken");
const User = require("../module/user/user.model");

/**
 * @desc   Middleware that verifies user authorization
 */

const authMiddleware = async (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res.status(400).json({
      status: "fail",
      error: "Authentication failed",
    });
  }

  try {
    // Get user from the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

module.exports = { authMiddleware };
