const Book = require('../book/book.model');

/**
 * Retrieves books associated with a specific user ID.
 *
 * @param {string} userId - The unique identifier of the user.
 * @returns {Array} An array of book objects belonging to the user, sorted by creation date in descending order.
 * @throws {Error} Throws an error if there's an issue fetching books data.
 *
 * @example
 * const userId = '1234567890';
 * const books = await getBooksByUserId(userId);
 * // books: [{...}, {...}, ...]
 */
exports.getBooksByUserId = async userId => {
  try {
    // Fetch books from the database for the given user ID, sorting them by creation date.
    const books = await Book.find({ user: userId }).sort({ createdAt: -1 });
    return books;
  } catch (error) {
    // If an error occurs during the database operation, throw a custom error message.
    throw new Error('Error fetching books data');
  }
};

/**
 * Retrieves a paginated list of books from the database.
 *
 * @param {number} page - The page number for pagination.
 * @returns {Array} Paginated list of books.
 * @throws {Error} Throws an error if there's an issue fetching books data.
 */
exports.getBooksList = async (page = 1) => {
  try {
    const itemsPerPage = 12;
    const skip = (page - 1) * itemsPerPage;
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(itemsPerPage);
    return books;
  } catch (error) {
    throw new Error('Error fetching books data');
  }
};

/**
 * Retrieves a book by its ID and increments its read count.
 *
 * @param {string} bookId - The unique identifier of the book.
 * @returns {Object} Retrieved book details.
 * @throws {Error} Throws an error if there's an issue fetching the book data.
 */
exports.getBookByID = async bookId => {
  try {
    const book = await Book.findByIdAndUpdate(
      bookId,
      { $inc: { read: 1 } },
      { new: true }
    )
      .populate({
        path: 'reviews.user',
        select: 'full_name avatar',
      })
      .lean();
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
  } catch (error) {
    throw new Error('Error fetching book data by ID');
  }
};

/**
 * Retrieves books matching the provided title and author.
 *
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 * @returns {Array} List of books matching the title and author.
 * @throws {Error} Throws an error if there's an issue fetching books data.
 */
exports.searchBooks = async (title, author) => {
  try {
    const books = await Book.find({
      title: { $regex: new RegExp(title, 'i') },
      author: { $regex: new RegExp(author, 'i') },
    });
    return books;
  } catch (error) {
    throw new Error('Error searching books');
  }
};

/**
 * Creates a new book in the database.
 *
 * @param {Object} bookData - The data for the new book.
 * @returns {Object} Created book details.
 * @throws {Error} Throws an error if there's an issue creating the book.
 */
exports.createBook = async bookData => {
  try {
    const book = await Book.create(bookData);
    return book;
  } catch (error) {
    throw new Error('Error creating book');
  }
};

/**
 * Updates an existing book in the database.
 *
 * @param {string} bookId - The unique identifier of the book.
 * @param {Object} updatedData - The updated data for the book.
 * @returns {Object} Updated book details.
 * @throws {Error} Throws an error if there's an issue updating the book.
 */
exports.updateBook = async (bookId, updatedData) => {
  try {
    const book = await Book.findByIdAndUpdate(bookId, updatedData, {
      new: true,
    });
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
  } catch (error) {
    throw new Error('Error updating book');
  }
};

/**
 * Deletes a book from the database.
 *
 * @param {string} bookId - The unique identifier of the book.
 * @returns {Object} Deleted book details.
 * @throws {Error} Throws an error if there's an issue deleting the book.
 */
exports.deleteBook = async bookId => {
  try {
    const book = await Book.findByIdAndRemove(bookId, { new: true });
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
  } catch (error) {
    throw new Error('Error deleting book');
  }
};

/**
 * @function getBookByISBN
 * @description Retrieves a book from the database based on its ISBN.
 *
 * @param {string} ISBN - The ISBN of the book to retrieve.
 * @returns {Promise} A promise that resolves to the found book or null if not found.
 * @throws Will throw an error if there's an issue with the database query.
 */
exports.getBookByISBN = async ISBN => {
  try {
    // Use the Book model to find a book with the specified ISBN in the database
    const book = await Book.findOne({ ISBN: ISBN }).exec();
    return book;
  } catch (error) {
    throw new Error('Error retrieving book by ISBN: ' + error.message);
  }
};

/**
 * Updates the reading status of a book.
 *
 * @param {string} bookId - The unique identifier of the book to be updated.
 * @param {string} readingStatus - The new reading status to be set ('Currently Reading', 'Read', 'To Read').
 * @returns {Promise<Object>} A Promise that resolves to the updated book object.
 * @throws {Error} Throws an error if there's an issue updating the reading status.
 */
exports.updateReadingStatus = async (bookId, readingStatus) => {
  try {
    const book = await Book.findByIdAndUpdate(bookId, { readingStatus }, { new: true });
    return book;
  } catch (error) {
    throw new Error('Error updating reading status');
  }
};