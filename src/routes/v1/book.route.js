const express = require('express');
const bookController = require('../../controllers/book.controller');

const router = express.Router();

router
  .route('/')
  .post(bookController.createBook)
  .get(bookController.getBooks);

router
  .route('/:bookId')
  .get(bookController.getBook)
  .patch(bookController.updateBook)
  .delete( bookController.deleteBook);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management and retrieval
 */

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - publisher
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *                 description: Author ID (ObjectId)
 *               publisher:
 *                 type: string
 *               price:
 *                 type: number
 *                 description: Book price
 *               ISBN:
 *                 type: string
 *                 description: Book ISBN number
 *               language:
 *                 type: string
 *                 description: Language of the book
 *               numberOfPages:
 *                 type: integer
 *                 description: Number of pages
 *             example:
 *               title: Harry Potter and the Philosopher's Stone
 *               author: "603dcbba8f1b2b3a90e1e99b" # Example ObjectId for author
 *               publisher: "İş Bankası"
 *               price: 19.99
 *               ISBN: "978-0-7475-3269-9"
 *               language: English
 *               numberOfPages: 223
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'  # Example of the created book
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Book title
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by query in the form of field:desc/asc (ex. title:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of books
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */


/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a Book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 title: Harry Potter and the Chamber of Secrets
 *                 author: "603dcbba8f1b2b3a90e1e99b" # Example ObjectId for author
 *                 publisher: "publisher id"
 *                 price: 21.99
 *                 ISBN: "978-0-7475-3849-3"
 *                 language: English
 *                 numberOfPages: 251
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a Book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               publisher:
 *                 type: string
 *               ISBN:
 *                 type: string
 *               language:
 *                 type: string
 *               numberOfPages:
 *                 type: integer
 *             example:
 *               title: Harry Potter and the Prisoner of Azkaban
 *               price: 24.99
 *               publisher: "Bloomsbury"
 *               ISBN: "978-0-7475-4215-5"
 *               language: English
 *               numberOfPages: 317
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               example:
 *                 title: Harry Potter and the Prisoner of Azkaban
 *                 author: "603dcbba8f1b2b3a90e1e99b" # Example ObjectId for author
 *                 publisher: "Bloomsbury"
 *                 price: 24.99
 *                 ISBN: "978-0-7475-4215-5"
 *                 language: English
 *                 numberOfPages: 317
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
