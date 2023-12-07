const mongoose = require('mongoose');

// Book Schema Definition

const bookSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'User',
    },
    title: {
      type: String,
      trim: true,
      indexedDB: true,
      required: [true, 'Please add a text value'],
    },
    genre: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      required: [false, 'Please add a text value'],
    },
    thumbnail: {
      trim: true,
      type: String,
    },
    price: { type: Number, required: true, trim: true },
    shippingFees: {
      type: Number,
      default: 0 
    },
    stock: {
      inStock: {
        type: Boolean,
        default: true,
      },
      remainingStock: {
        type: Number,
        default: 0,
      },
    },
    author: {
      type: String,
      required: true,
      trim: true,
      indexedDB: true,
    },
    averageRating: {
      type: Number,
      required: false,
      default: 0,
    },
    featured: {
      type: Boolean,
      required: false,
      indexedDB: true,
    },
    read: { type: Number, default: 0 },
    publishTime: {
      type: Number,
      required: true,
    },
    ISBN: {
      type: String,
      unique: true,
      required: false,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          required: false,
        },
        comment: {
          type: String,
          required: false,
        },
      },
    ],
    readingStatus: {
      type: String,
      enum: ['Currently Reading', 'Read', 'To Read'],
      required: false,
    },
    language: { type: String, required: true },
    pages: { type: String, required: true },
    publisher: { type: String, required: true },
    
  },
  { timestamps: true, versionKey: false }
);

// Static methods to the schema for filtering and sorting
bookSchema.statics.filterAndSort = async function (filterOptions, sortOptions) {
  const query = this.find();

  if (filterOptions) {
    const filters = {};

    if (filterOptions.genre) {
      filters.genre = filterOptions.genre;
    }

    if (filterOptions.priceMin) {
      filters.price = { $gte: filterOptions.priceMin };
    }

    if (filterOptions.priceMax) {
      filters.price = { ...filters.price, $lte: filterOptions.priceMax };
    }

    if (filterOptions.title) {
      filters.title = filterOptions.title;
    }

    query.where(filters);
  }

  if (sortOptions) {
    switch (sortOptions.price) {
      case 'asc':
        query.sort({ price: 1 });
        break;
      case 'desc':
        query.sort({ price: -1 });
        break;
      default:
    }

    switch (sortOptions.popularity) {
      case 'asc':
        query.sort({ reviews: 1 });
        break;
      case 'desc':
        query.sort({ reviews: -1 });
        break;
      default:
    }
  }

  return await query.lean().exec();
};

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
