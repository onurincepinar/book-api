const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Author',
      required: true,
    },
    price: {
      type: Number,
      required: false,
    },
    ISBN: {
      type: String,
      required: false,
    },
    language: {
      type: String,
      required: false,
    },
    numberOfPages: {
      type: Number,
      required: false,
    },
    publisher: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
bookSchema.plugin(toJSON);
bookSchema.plugin(paginate);

/**
 * @typedef Book
 */
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
