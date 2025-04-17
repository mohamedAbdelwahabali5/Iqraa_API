const router = require('express').Router();
const validate = require('../../middlewares/errorHandler');
const { categorySchema } = require('./category.validator');
const authMiddleware = require('../../middlewares/authMiddleware');
const {getAllCategories, getCategoryById,createCategory,updateCategory,deleteCategory} = require('./category.controller');

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Protected routes (require authentication)
// router.use(authMiddleware);

router.post('/', validate(categorySchema), createCategory);
router.put('/:id', validate(categorySchema), updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;