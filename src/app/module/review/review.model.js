const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  rating: Number,
  content: String,
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
