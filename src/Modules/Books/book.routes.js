const router = require('express').Router();
const validate = require('../../middlewares/errorHandler');
const { bookSchema } = require('./book.validator');
const authMiddleware = require('../../middlewares/authMiddleware');
const bookController = require('./book.controller');

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

// Protected routes (require authentication)
router.use(authMiddleware);

router.post('/', validate(bookSchema), bookController.createBook);
router.put('/:id', validate(bookSchema), bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;