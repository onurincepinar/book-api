const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { bookService } = require('../services');

const createBook = catchAsync(async (req, res) => {
  const book = await bookService.createBook(req.body);
  res.status(httpStatus.CREATED).send(book);
});

const getBooks = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.title) {
    filter.title = { $regex: req.query.title, $options: 'i' };
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await bookService.queryBooks(filter, options);
  res.status(httpStatus.OK).send(result);
});

const getBook = catchAsync(async (req, res) => {
  const book = await bookService.getBookById(req.params.bookId);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }
  res.send(book);
});

const updateBook = catchAsync(async (req, res) => {
  const book = await bookService.updateBookById(req.params.bookId, req.body);
  res.send(book);
});

const deleteBook = async (req, res) => {
  try {
    const result = await bookService.deleteBookById(req.params.bookId);
    res.status(200).send(result);
  } catch (error) {
    res.status(error.statusCode || 500).send({
      message: error.message || 'Internal Server Error',
    });
  }
};


module.exports = {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
};
