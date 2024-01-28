// Basic Lib Imports
const express = require('express');
const router = express.Router();

const reviewController = require('./review.controller');

const { authMiddleware } = require('../../middleware/authMiddleware');

// Routing Implement
router.post(
  '/leave-review',
  authMiddleware,
  reviewController.leaveReviewAndRating
);
router.get(
  '/average-ratings/:bookId',
  authMiddleware,
  reviewController.viewAverageRatingsAndReviews
);
router.post(
  '/like-review',
  authMiddleware,
  reviewController.likeOrUpvoteReview
);

module.exports = router;
