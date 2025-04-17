const router = require('express').Router();
const validate = require('../../middlewares/errorHandler');
const { categorySchema } = require('./category.validator');
const authMiddleware = require('../../middlewares/authMiddleware');
const categoryController = require('./category.controller');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected routes (require authentication)
router.use(authMiddleware);

router.post('/', validate(categorySchema), categoryController.createCategory);
router.put('/:id', validate(categorySchema), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;