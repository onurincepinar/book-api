const Joi = require('joi');
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { Book } = require('../models');

/**
 * Validates whether the provided id is a valid ObjectId
 * @param {string} id
 * @throws {ApiError}
 */
const validateObjectId = (id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please enter a valid id');
  }
};

/**
 * Validates the update body for a book
 * @param {Object} updateBody
 * @throws {ApiError}
 */
const validateUpdateBookBody = (updateBody) => {
  const schema = Joi.object({
    title: Joi.string().optional(),
    author: Joi.string().optional(),
    price: Joi.number().optional(),
    ISBN: Joi.string().optional(),
    language: Joi.string().optional(),
    numberOfPages: Joi.number().optional(),
    publisher: Joi.string().optional(),
  });

  const { error } = schema.validate(updateBody);

  if (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Update operation not completed successfully, because ${error.details[0].message}`);

  }
};


/**
 * Validates if the book exists in the database by id
 * @param {ObjectId} bookId
 * @throws {ApiError}
 */
const validateBookExists = async (bookId) => {
    const book = await Book.findById(bookId);
    if (!book) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
    }
    return book;
  };
  
  module.exports = {
    validateObjectId,
    validateUpdateBookBody,
    validateBookExists,
  };
