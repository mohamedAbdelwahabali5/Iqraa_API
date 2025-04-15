const Comment = require('./comment.model');

// Get all comments for specific book
const getAllComments = async (req, res) => {
  try {
    const { bookId } = req.params;
    
    if (!bookId) {
      return res.status(400).json({ error: 'Book ID is required' });
    }
    
    const comments = await Comment.find({ book: bookId })
      .populate('user', 'firstName lastName email')
      .populate('book', 'title author')
      .sort({ createdAt: -1 });
      
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific comment by ID
const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('book', 'title author');
      
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { text, book } = req.body;
    
    if (!text || !book) {
      return res.status(400).json({ error: 'Text and book ID are required' });
    }
    
    const comment = new Comment({
      text,
      book,
      user: req.user._id
    });
    
    await comment.save();
    
    const populatedComment = await comment
      .populate('user', 'firstName lastName email')
      .populate('book', 'title author')
      .execPopulate();
    
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a comment by ID
const updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this comment' });
    }
    
    comment.text = text;
    const updatedComment = await comment.save();
    
    const populatedComment = await updatedComment
      .populate('user', 'firstName lastName email')
      .populate('book', 'title author')
      .execPopulate();
      
    res.status(200).json(populatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a comment by ID       
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }
    
    await comment.remove();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment
};