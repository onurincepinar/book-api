const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');
const { Book } = require('../../src/models');
const setupTestDB = require('../utils/setupTestDB');
const mongoose = require('mongoose');

setupTestDB();

describe('Book routes', () => {
  let authorId;
  let newBook;

  beforeEach(() => {
    authorId = new mongoose.Types.ObjectId();

    newBook = {
      title: 'Harry Potter',
      author: authorId,
      publisher: "Pegasus Yayınları",
      price: 19.99,
      ISBN: '978-0-7475-3269-9',
      language: 'English',
      numberOfPages: 223,
    };
  });

  describe('POST /v1/books', () => {
    test('should create a new book and return 201', async () => {
      const res = await request(app)
        .post('/v1/books')
        .send(newBook)
        .expect(httpStatus.CREATED);

      expect(res.body).toMatchObject({
        message: 'Book created successfully',
        newBook: {
          title: newBook.title,
          author: newBook.author.toString(),
          publisher: newBook.publisher,
          price: newBook.price,
          ISBN: newBook.ISBN,
          language: newBook.language,
          numberOfPages: newBook.numberOfPages,
        },
      });

      const dbBook = await Book.findById(res.body.newBook.id);
      expect(dbBook).toBeDefined();
      expect(dbBook.toObject()).toMatchObject({
        ...newBook,
        author: newBook.author,
      });
    });

    test('should return 400 if required fields are missing', async () => {
      newBook.title = '';

      await request(app)
        .post('/v1/books')
        .send(newBook)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/books', () => {
    test('should get all books and return 200', async () => {
      await Book.create(newBook);
      const res = await request(app).get('/v1/books').expect(httpStatus.OK);
      expect(res.body.books).toBeInstanceOf(Object);
      expect(res.body.books.totalResults).toBeGreaterThan(0);
    });
  });

  describe('GET /v1/books/:bookId', () => {
    test('should get a single book by id', async () => {
      const book = await Book.create(newBook);

      const res = await request(app).get(`/v1/books/${book._id}`).expect(httpStatus.OK);

      expect(res.body).toMatchObject({
        message: 'Book found successfully',
        findBook: {
          title: book.title,
          author: book.author.toString(),
          publisher: book.publisher,
          price: book.price,
          ISBN: book.ISBN,
          language: book.language,
          numberOfPages: book.numberOfPages,
        },
      });
    });

    test('should return 404 if book not found', async () => {
      const fakeBookId = mongoose.Types.ObjectId().toHexString();
      await request(app).get(`/v1/books/${fakeBookId}`).expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/books/:bookId', () => {
    test('should update a book and return 200', async () => {
      const book = await Book.create(newBook);

      const updateBody = { price: 29.99 };

      const res = await request(app)
        .patch(`/v1/books/${book._id}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toMatchObject({
        message: 'Update operation successful',
        findBook: {
          title: book.title,
          price: updateBody.price,
        },
      });

      const dbBook = await Book.findById(book._id);
      expect(dbBook.price).toBe(updateBody.price);
    });

    test('should return 404 if book not found', async () => {
      const fakeBookId = mongoose.Types.ObjectId().toHexString();
      const updateBody = { price: 29.99 };

      await request(app)
        .patch(`/v1/books/${fakeBookId}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/books/:bookId', () => {
    test('should delete a book and return 204', async () => {
      const book = await Book.create(newBook);

      await request(app).delete(`/v1/books/${book._id}`).expect(httpStatus.OK);

      const dbBook = await Book.findById(book._id);
      expect(dbBook).toBeNull();
    });

    test('should return 404 if book not found', async () => {
      const fakeBookId = mongoose.Types.ObjectId().toHexString();
      await request(app).delete(`/v1/books/${fakeBookId}`).expect(httpStatus.NOT_FOUND);
    });
  });
});
