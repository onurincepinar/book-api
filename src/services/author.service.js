const httpStatus = require('http-status');
const { Author } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');
const { validateObjectId, validateUpdateAuthorBody } = require('../validation/author.validation');

/**
 * Create a Author
 * @param {Object} authorBody
 * @returns {Promise<Author>}
 */
const createAuthor = async (authorBody) => {
  const newAuthor = await Author.create(authorBody);

  return {
    message: 'Author created successfully',
    newAuthor,
  };
};

/**
 * Query for authors
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAuthors = async (filter, options) => {
  const authors = await Author.paginate(filter, options);

  if (authors.totalResults != 0) {
    return {
      message: `Successfully retrieved ${authors.totalResults} authors`,
      authors,
    };
  }
  else{   
      throw new ApiError(httpStatus.NOT_FOUND, 'Author not found');    
  }
  
};

/**
 * Get Author by id
 * @param {ObjectId} id
 * @returns {Promise<Object>} An object containing a message and the found author
 */
const getAuthorById = async (id) => {
  validateObjectId(id); // Validate authorId correct format
  
  const findAuthor = await Author.findById(id);
  
  // Check if the author exists after trying to find it
  if (!findAuthor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Author not found');
  }

  return {
    message: 'Author found successfully',
    author: findAuthor, // Rename the property to be more consistent
  };
};

/**
 * Update Author by id
 * @param {ObjectId} authorId
 * @param {Object} updateBody
 * @returns {Promise<Author>}
 */
const updateAuthorById = async (authorId, updateBody) => {
  validateObjectId(authorId); // Validate authorId correct format
  validateUpdateAuthorBody(updateBody); // Validate updateBody

  const author = await Author.findById(authorId); //Get author from database
  if (!author) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Author not found');
  }

  Object.assign(author, updateBody); // Update operation
  await author.save();
  return {
    message: 'Update operation successful',
    author,
  };
};

/**
 * Delete author by id
 * @param {ObjectId} authorId
 * @returns {Promise<Author>}
 */
const deleteAuthorById = async (authorId) => {
  validateObjectId(authorId); // Validate authorId correct format
  const author = await Author.findById(authorId);
  if (!author) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Author not found');
  }
  await author.remove();
  return {
    message: 'Book deleted successfully',
  };
};

module.exports = {
  createAuthor,
  queryAuthors,
  getAuthorById,
  updateAuthorById,
  deleteAuthorById,
};
