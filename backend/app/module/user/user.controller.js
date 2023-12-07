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

/**
 * @desc    Get all users → Only Allowed For Admin
 * @route   /api/v1/users/
 * @method  GET
 * @access  Private
 */

const userList = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Users retrived successfully",
      data: [users],
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error.message,
      message: "Internal Server Error",
    });
  }
});

/**
 * @desc    Get a Single User → Only Allowed For Admin
 * @route   /api/v1/users/:id
 * @param {String} id
 * @method  GET
 * @access  Private
 */
const findUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).lean();

    if (!user) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: "Internal Server Error",
      message: "An error occurred while fetching the book.",
    });
  }
});
module.exports = {
  getMe,
  userList,
  findUserById,
};
