// __tests__/author.test.js
const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app'); // Express uygulamanızı burada içe aktarın
const { Author } = require('../../src/models'); // Author modelini içe aktarın
const setupTestDB = require('../utils/setupTestDB');
const mongoose = require('mongoose');

setupTestDB();

describe('Author routes', () => {
  let newAuthor;

  beforeEach(() => {
    newAuthor = {
      name: 'John Doe',
      country: 'USA',
      birthDate: "1980-01-01T00:00:00.000Z", 
    };
  });

  describe('POST /v1/authors', () => {
    test('should create a new author and return 201 with a success message', async () => {
      const res = await request(app)
        .post('/v1/authors')
        .send(newAuthor)
        .expect(httpStatus.CREATED);

      expect(res.body).toMatchObject({
        message: 'Author created successfully',
        newAuthor: {
          name: newAuthor.name,
          country: newAuthor.country,
          birthDate: newAuthor.birthDate, // UTC formatında kontrol
        },
      });

      const dbAuthor = await Author.findById(res.body.newAuthor.id);
      expect(dbAuthor).toBeDefined();

      expect(dbAuthor.toObject()).toMatchObject({
        name: newAuthor.name,
        country: newAuthor.country,
        birthDate: dbAuthor.birthDate, // UTC formatında kontrol
      });
    });

    test('should return 400 if required fields are missing', async () => {
      newAuthor.name = '';

      await request(app)
        .post('/v1/authors')
        .send(newAuthor)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/authors', () => {
    test('should get all authors and return 200 with success message', async () => {
      await Author.create(newAuthor);
      const res = await request(app).get('/v1/authors').expect(httpStatus.OK);

      expect(res.body).toMatchObject({
        message: expect.stringContaining('Successfully retrieved'),
        authors: expect.any(Object),
      });

      expect(res.body.authors.results).toBeInstanceOf(Array);
      expect(res.body.authors.results.length).toBeGreaterThan(0);
    });
  });

  describe('GET /v1/authors/:authorId', () => {
    test('should get a single author by id with success message', async () => {
      const author = await Author.create(newAuthor);

      const res = await request(app).get(`/v1/authors/${author._id}`).expect(httpStatus.OK);

      expect(res.body).toMatchObject({
        message: 'Author found successfully',
        author: {
          name: author.name,
          country: author.country,
          birthDate: author.birthDate.toISOString(),
        },
      });
    });

    test('should return 404 if author not found', async () => {
      const fakeAuthorId = mongoose.Types.ObjectId().toHexString();
      await request(app).get(`/v1/authors/${fakeAuthorId}`).expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/authors/:authorId', () => {
    test('should update an author and return 200 with success message', async () => {
      const author = await Author.create(newAuthor);

      const updateBody = { name: 'Updated Name' };

      const res = await request(app)
        .patch(`/v1/authors/${author._id}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toMatchObject({
        message: 'Update operation successful',
        author: {
          name: updateBody.name,
        },
      });

      const dbAuthor = await Author.findById(author._id);
      expect(dbAuthor.name).toBe(updateBody.name);
    });

    test('should return 404 if author not found', async () => {
      const fakeAuthorId = mongoose.Types.ObjectId().toHexString();
      const updateBody = { name: 'Updated Name' };

      await request(app)
        .patch(`/v1/authors/${fakeAuthorId}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/authors/:authorId', () => {
    test('should delete an author and return 204', async () => {
      const author = await Author.create(newAuthor);

      await request(app).delete(`/v1/authors/${author._id}`).expect(httpStatus.OK);

      const dbAuthor = await Author.findById(author._id);
      expect(dbAuthor).toBeNull();
    });

    test('should return 404 if author not found', async () => {
      const fakeAuthorId = mongoose.Types.ObjectId().toHexString();
      await request(app).delete(`/v1/authors/${fakeAuthorId}`).expect(httpStatus.NOT_FOUND);
    });
  });
});
