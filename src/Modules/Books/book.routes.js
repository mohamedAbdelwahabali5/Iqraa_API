const router = require('express').Router();
const validate = require('../../middlewares/errorHandler');
const { bookSchema } = require('./book.validator');
const authMiddleware = require('../../middlewares/authMiddleware');
const adminFilter = require('../../middlewares/adminMiddleware');
const bookController = require('./book.controller');

// Public routes
router.get('/', bookController.getAllBooks);
router.post('/', authMiddleware, adminFilter, validate(bookSchema), bookController.createBook);
router.get('/:id', bookController.getBookById);
router.put('/:id', authMiddleware, adminFilter, validate(bookSchema), bookController.updateBook);
router.delete('/:id', authMiddleware, adminFilter, bookController.deleteBook);

module.exports = router;