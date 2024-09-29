const Joi = require('joi');
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { Author } = require('../models');

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
 * Validates the update body for an author
 * @param {Object} updateBody
 * @throws {ApiError}
 */
const validateUpdateAuthorBody = (updateBody) => {
    const schema = Joi.object({
      name: Joi.string().trim().optional(),
      country: Joi.string().trim().optional(),
      birthDate: Joi.date().optional(),
    });
  
    const { error } = schema.validate(updateBody);
  
    if (error) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Update operation not completed successfully, because ${error.details[0].message}`
      );
    }
  };
  
  module.exports = {
    validateObjectId,
    validateUpdateAuthorBody,
  };
