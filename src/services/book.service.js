const httpStatus = require('http-status');
const { Book } = require('../models');
const ApiError = require('../utils/ApiError');
const { validateObjectId,validateUpdateBookBody } = require('../validation/book.validation');
/**
 * Create a book
 * @param {Object} bookBody
 * @returns {Promise<Book>}
 */
const createBook = async (bookBody) => {
  const newBook = await Book.create(bookBody);

  return {
    message: 'Book created successfully',
    newBook
  };
};

/**
 * Query for books
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBooks = async (filter, options) => {
  const books = await Book.paginate(filter, options);

  if (books.totalResults != 0) {
    return {
      message: `Successfully retrieved ${books.totalResults} books`,
      books,
    };

  }
  else{   
      throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');    
  }
};

/**
 * Get book by id
 * @param {ObjectId} id
 * @returns {Promise<Book>}
 */
const getBookById = async (id) => {

  validateObjectId(id); // Validate bookId correct format
   const findBook= await Book.findById(id);

   // Check if the book exists after trying to find it
   if (!findBook) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }
   return {
    message: 'Book found successfully',
    findBook
  };
};

/**
 * Update book by id
 * @param {ObjectId} bookId
 * @param {Object} updateBody
 * @returns {Promise<Book>}
 */
const updateBookById = async (bookId, updateBody) => {
  validateObjectId(bookId); // Validate bookId correct format
  validateUpdateBookBody(updateBody); // Validate updateBody

  const findBook= await Book.findById(bookId);
  // Check if the book exists after trying to find it
  if (!findBook) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }

  Object.assign(findBook, updateBody);// Update operation
  await findBook.save();
  return {
    message: 'Update operation successful',
    findBook,
  };
};

/**
 * Delete book by id
 * @param {ObjectId} bookId
 * @returns {Promise<Book>}
 */
const deleteBookById = async (bookId) => {
  validateObjectId(bookId); // Validate bookId
  const findBook = await Book.findById(bookId);

  // Check if the book exists after trying to find it
  if (!findBook) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }

  await findBook.remove(); // Remove book
  return {
    message: 'Book deleted successfully', // Mesajı döndür
  };
};

module.exports = {
  createBook,
  queryBooks,
  getBookById,
  updateBookById,
  deleteBookById,
};
