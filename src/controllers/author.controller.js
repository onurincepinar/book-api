const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { authorService } = require('../services');

const createAuthor = catchAsync(async (req, res) => {
  const author = await authorService.createAuthor(req.body);
  res.status(httpStatus.CREATED).send(author);
});

const getAuthors = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.name) {
    filter.name = { $regex: req.query.name, $options: 'i' }; // Case-insensitive arama
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await authorService.queryAuthors(filter, options);
  res.send(result);
});


const getAuthor = catchAsync(async (req, res) => {
  const author = await authorService.getAuthorById(req.params.authorId);
  if (!author) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Author not found');
  }
  res.send(author);
});

const updateAuthor = catchAsync(async (req, res) => {
  const author = await authorService.updateAuthorById(req.params.authorId, req.body);
  res.send(author);
});

const deleteAuthor = async (req, res) => {
  try {
    const result = await authorService.deleteAuthorById(req.params.authorId);
    res.status(200).send(result);
  } catch (error) {
    res.status(error.statusCode || 500).send({
      message: error.message || 'Internal Server Error',
    });
  }
};

module.exports = {
  createAuthor,
  getAuthors,
  getAuthor,
  updateAuthor,
  deleteAuthor,
};
