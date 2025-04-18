const Book = require('./book.model');
const mongoose = require('mongoose');

// Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    // .populate('category', 'name');
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books', details: error.message });
  }
};

// Get single book by ID
const getBookById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid book ID format' });
    }

    const book = await Book.findById(req.params.id);
    // .populate('category', 'name');
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book', details: error.message });
  }
};

// Create new book
const createBook = async (req, res) => {
  try {
    const book = new Book({
      ...req.body,
      createdBy: req.user?._id 
    });
    
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to create book',
      details: error.message 
    });
  }
};

// Update book
const updateBook = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid book ID format' });
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    // .populate('category', 'name');
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to update book',
      details: error.message 
    });
  }
};

// Delete book
const deleteBook = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid book ID format' });
    }

    const book = await Book.findByIdAndDelete(req.params.id);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.status(204).end({message: 'Book deleted successfully'});
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to delete book',
      details: error.message 
    });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};