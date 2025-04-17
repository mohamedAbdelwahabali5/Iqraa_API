const Category = require('./category.model');
const APIError = require('../../utils/APIError');
const { asyncHandler } = require('../../utils/asyncHandler');

// Get all categories
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ isActive: true });
    res.json({ success: true, data: categories });
});

// Get category by ID
const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
        throw new APIError('Category not found', 404);
    }
    
    res.json({ success: true, data: category });
});

// Create new category
const createCategory = asyncHandler(async (req, res) => {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
});

// Update category
const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!category) {
        throw new APIError('Category not found', 404);
    }

    res.json({ success: true, data: category });
});

// Delete category (soft delete)
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
    );

    if (!category) {
        throw new APIError('Category not found', 404);
    }

    res.json({ success: true, data: category });
});

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};