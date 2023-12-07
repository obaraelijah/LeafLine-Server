const User = require("../user/user.model");
const Book = require("../book/book.model");
const asyncHandler = require("express-async-handler");

/**
 * @desc   Get all wishlisted books for a user
 * @route  /api/v1/wishlist/books
 * @method GET
 * @access Private
 * @requires User authentication
 */
const getWishlistBooks = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  try {
    // Find the user by ID and populate the 'wishlist' field
    const user = await User.findById(userId).populate("wishlist");

    if (!user) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "User not found",
      });
    }

    // Extract the wishlisted books from the user object
    const wishlistedBooks = user.wishlist;

    res.json({
      success: true,
      statusCode: 200,
      message: "Wishlisted books retrieved successfully",
      wishlistedBooks,
    });
  } catch (error) {
    next(error)
  }
});

/**
 * @desc   Add a product to user's wishlist
 * @route  /api/v1/wishlist/add
 * @property {object} bookId
 * @method POST
 * @access Private
 * @requires User authentication
 */

const addToWishlist = asyncHandler(async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.id;

  const book = await Book.findById(bookId);

  if (!book) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: "Book not found",
    });
  }

  // Check if the book is already in the user's wishlist
  const user = await User.findById(userId);

  if (user.wishlist.includes(bookId)) {
    return res.status(400).json({ error: "Book already exists in wishlist" });
  }

  // Update the user's wishlist
  await User.findByIdAndUpdate(userId, { $push: { wishlist: bookId } });

  // // Populate the user object with wishlist details
  // const updatedUser = await User.findById(userId).populate("wishlist");
  res.json({
    success: true,
    statusCode: 200,
    message: "Book added successfully!",
  });
});

/**
 * @desc   Remove a product from user's wishlist
 * @route  /api/v1/wishlist/remove
 * @property {object} bookId
 * @method DELETE
 * @access Private
 * @requires User authentication
 */

const removeFromWishlist = asyncHandler(async (req, res, next) => {
  const { bookId } = req.body;
  const userId = req.user.id;

  try {
    // Find the user document by ID
    const user = await User.findById(userId);

    // Check if the user document exists
    if (!user) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "User not authenticated",
      });
    }

    // Check if the bookId is in the user's wishlist
    const wishlistIndex = user.wishlist.indexOf(bookId);
    if (wishlistIndex === -1) {
      return res
        .status(400)
        .json({ message: "Book does not exist in wishlist" });
    }

    // Remove the bookId from the wishlist array
    user.wishlist.splice(wishlistIndex, 1);

    // Save the updated user document
    await user.save();

    // Return a 204 No Content status code
    res.status(204).send();
  } catch (error) {
    next(error)
  }
});

module.exports = {
  getWishlistBooks,
  addToWishlist,
  removeFromWishlist,
};
