const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const authorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: false,
      trim: true,
    },
    birthDate: {
      type: Date,
      required: false,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
authorSchema.plugin(toJSON);
authorSchema.plugin(paginate);

/**
 * @typedef Author
 */
const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
