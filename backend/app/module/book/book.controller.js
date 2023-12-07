const asyncHandler = require('express-async-handler');
const Book = require('../book/book.model');
const bookService = require('./book.services');
const { sendResponse } = require('../../../services/responseService');
// const client = require('../../../config/redisConfig');

/**
 * Retrieves a paginated list of books from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} Paginated list of books, along with pagination details.
 * @throws {Error} Throws an error if there's an issue fetching books data.
 */
exports.getBooksList = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = 12;
  const skip = (page - 1) * itemsPerPage;

  const [books, totalBooks] = await Promise.all([
    Book.find().sort({ createdAt: -1 }).skip(skip).limit(itemsPerPage),
    Book.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalBooks / itemsPerPage);
  const nextPage = page < totalPages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  return sendResponse(res, 200, true, 'Books data fetched successfully!', {
    books,
    currentPage: page,
    totalPages,
    nextPage,
    prevPage,
  });
});

/**
 * Retrieves a book by its ID and increments its read count.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Object} Retrieved book details.
 * @throws {Error} Throws an error if there's an issue fetching the book data.
 */
exports.getBookByID = asyncHandler(async (req, res, next) => {
  const bookId = req.params.id;

  try {
    const book = await bookService.getBookByID(bookId);

    if (!book) {
      return sendResponse(res, 404, false, 'No books found');
    }

    return sendResponse(res, 200, true, 'Books retrieved successfully', book);
  } catch (error) {
    next(error);
  }
});

/**
 * Create a new book for the authenticated user
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Body} New book details.
 * @throws {Error} Throws an error if there's an issue fetching the book data.
 */
exports.addBook = asyncHandler(async (req, res, next) => {
  try {
    // Extract book data from the request body
    const {
      title,
      description,
      price,
      shippingFees,
      genre,
      rating,
      featured,
      author,
      thumbnail,
      publishTime,
      ISBN,
      language,
      publisher,
      pages,
    } = req.body;

    // Extract stock data from the request body
    let { inStock, remainingStock } = req.body.stock || {};

    // set inStock to false if remainingStock is 0
    if (remainingStock === 0) {
      inStock = false;
    }

    // Validate Fields
    if (!title) {
      return sendResponse(res, 400, false, 'Title is required');
    }

    if (!description) {
      return sendResponse(res, 400, false, 'Description is required');
    }

    if (!price || isNaN(price) || price <= 0) {
      return sendResponse(res, 400, false, 'Price must be a positive number');
    }

    if (!shippingFees || isNaN(shippingFees) || shippingFees < 0) {
      return sendResponse(
        res,
        400,
        false,
        'Shipping fees must be a non-negative number'
      );
    }

    // Check if ISBN already exists in the database
    const existingBook = await bookService.getBookByISBN(ISBN);
    if (existingBook) {
      return sendResponse(
        res,
        400,
        false,
        'Book with this ISBN already exists'
      );
    }
    // Prepare book data object
    const bookData = {
      title,
      description,
      price,
      shippingFees,
      genre,
      rating,
      featured,
      author,
      thumbnail,
      publishTime,
      ISBN,
      pages,
      language,
      publisher,
      stock: {
        inStock,
        remainingStock,
      },
    };

    const book = await bookService.createBook(bookData);
    return sendResponse(res, 201, true, 'Book created successfully', book);
  } catch (error) {
    next(error);
  }
});

/**
 * Get book by ISBN
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Params} ISBN number
 * @throws {Error} Throws an error if there's an issue fetching the book data.
 */
exports.bookByISBN = asyncHandler(async (req, res, next) => {
  try {
    const { ISBN } = req.params.id;

    // Check if ISBN already exists in the database
    const existingBook = await bookService.getBookByISBN(ISBN);
    if (existingBook) {
      return sendResponse(
        res,
        200,
        true,
        existingBook,
        'Book fetched successfully'
      );
    }
  } catch (error) {
    next(error);
  }
});

/**
 * Update an existing book for the authenticated user
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Body} Updated book details.
 * @throws {Error} Throws an error if there's an issue updating the book data.
 */
exports.updateBook = asyncHandler(async (req, res, next) => {
  try {
    const {
      id,
      title,
      price,
      rating,
      featured,
      author,
      thumbnail,
      publishTime,
    } = req.body;
    const book = await Book.findById(id).lean();

    if (!book) {
      return sendResponse(res, 404, false, 'Book not found');
    }

    // Check if the authenticated user has permission to update this book
    if (book.user.toString() !== req.user.id) {
      return sendResponse(
        res,
        403,
        false,
        'Unauthorized - User does not have permission to update this book'
      );
    }

    // Update the book with the provided data
    await Book.updateOne(
      { _id: id },
      { title, price, rating, featured, author, thumbnail, publishTime }
    );

    return sendResponse(res, 200, true, 'Book updated successfully');
  } catch (error) {
    next(error);
  }
});

/**
 * Delete a book for the authenticated user
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Body} Deleted book details.
 * @throws {Error} Throws an error if there's an issue deleting the book data.
 */
exports.deleteBook = asyncHandler(async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return sendResponse(res, 404, true, 'Book not found');
    }

    // Check if the authenticated user has permission to delete this book
    if (book.user.toString() !== req.user.id) {
      return sendResponse(
        res,
        403,
        false,
        'Unauthorized - User does not have permission to delete this book'
      );
    }

    // Delete the book and return the deleted book details
    const deletedBook = await Book.findByIdAndRemove(req.params.id, req.body, {
      new: true,
    });
    return sendResponse(res, 200, false, 'Book was deleted', deletedBook);
  } catch (error) {
    next(error);
  }
});

/**
 * Search books by title and/or author
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {Body} Retrieved books matching the search criteria.
 * @throws {Error} Throws an error if there's an issue searching for books.
 */
exports.searchBook = asyncHandler(async (req, res, next) => {
  const { title, author } = req.query;

  try {
    const books = await bookService.searchBooks(title, author);

    if (books.length === 0) {
      return sendResponse(res, 404, false, 'Book not found');
    }

    return sendResponse(res, 200, true, 'Books retrieved successfully', books);
  } catch (error) {
    next(error);
  }
});

/**
 * Reading status of a book
 * Allow users to mark books as "Currently Reading," "Read," or "To Read."
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response indicating the success or failure of the operation.
 */

exports.updateReadingStatusController = asyncHandler(async (req, res, next) => {
  const { bookId } = req.params;
  const { readingStatus } = req.body;

  try {
    const updatedBook = await bookService.updateReadingStatus(
      bookId,
      readingStatus
    );
    return sendResponse(
      res,
      200,
      true,
      'Reading status updated successfully',
      updatedBook
    );
  } catch (error) {
    next(error);
  }
});
