// Basic Lib Import
const User = require("./user.model");
const asyncHandler = require("express-async-handler");
const verifyAuthorization = require("../../../utility/verifyAuthorization");

/**
 * @desc    Get user data
 * @route   /api/v1/users/me
 * @method  GET
 * @access  Private
 */

const getMe = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "fail",
      message: "Authorization header is missing or invalid",
    });
  }

  // Extract the token from the header, removing the "Bearer " prefix
  const token = authorizationHeader.slice(7);

  try {
    // Verify the token and extract the user ID
    const { id } = verifyAuthorization(token);

    const user = await User.findById(id)
      .select("-password -updatedAt -__v -token")
      .populate("wishlist")
      .lean();

    if (user) {
      res.status(200).json({
        success: true,
        statusCode: 200,
        user,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
  } catch (error) {
    next(error)
  }
});