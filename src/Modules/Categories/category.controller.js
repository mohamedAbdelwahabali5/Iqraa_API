const Category = require('./category.model');
const APIError = require('../../utils/APIError');
const { asyncHandler } = require('../../utils/asyncHandler');

// Get all categories
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
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
     // Check if category already exists
     const existingCategory = await Category.findOne({ 
        name: req.body.name
    });
    
    if (existingCategory) {
        throw new APIError('Category name already exists', 400);
    }

    const category = await Category.create(req.body);
    res.status(201).json({ 
        success: true, 
        message: 'Category created successfully',
        data: category 
    });
});

// Update category
const updateCategory = asyncHandler(async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!category) {
            throw new APIError('Category not found', 404);
        }

        res.json({ success: true,message:"Category updated successfully", data: category });
    } catch (error) {
        if (error.code === 11000) {
            throw new APIError('Category name already exists', 400);
        }
        throw error;
    }
});

// Delete category (soft delete)
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndDelete(
        req.params.id,
        { new: true }
    );

    if (!category) {
        throw new APIError('Category not found', 404);
    }

    res.json({ 
        success: true, 
        message: 'Category deleted successfully',
        data: category 
    });
});

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};