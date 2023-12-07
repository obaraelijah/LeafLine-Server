// Import the necessary models and dependencies
const asyncHandler = require("express-async-handler");
const Review = require('./review.model');

/**
 * @desc     Leave a review and rating for a book
 * @route    /api/v1/reviews/leave-review
 * @method   POST
 * @access   Private
 * @requires  {number} rating - The rating given to the product (between 1 and 5)
 * @requires  {string} comment - The comment or review text
 * @returns  {Object} The newly created review
 * @requires User Account
 */


exports.leaveReviewAndRating = asyncHandler(async (req, res, next) => {
  try {
    const { user_id, book_id, rating, content } = req.body;
    const review = await Review.create({ user_id, book_id, rating, content });
    res.status(201).json({ message: 'Review posted successfully', review });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



exports.viewAverageRatingsAndReviews = async (req, res) => {
  try {
    const { bookId } = req.params;
    const reviews = await Review.find({ book_id: bookId });
    const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRatings / reviews.length : 0;
    res.json({ averageRating, reviews });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.likeOrUpvoteReview = async (req, res) => {
  try {
    const { reviewId } = req.body;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    review.likes = review.likes + 1 || 1;
    await review.save();
    res.json({ message: 'Review liked successfully', review });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


