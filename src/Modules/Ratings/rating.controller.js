const Rating = require('./rating.model');

// Create or update a rating
const createOrUpdateRating = async (req, res) => {
  try {
    const { value, book } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }      
    
    // Check if rating already exists
    let rating = await Rating.findOne({ book, user: req.user._id });

    if (rating) {
      rating.value = value;
      await rating.save();
    } else {
      rating = await Rating.create({
        value,
        book,
        user: req.user._id
      });
    }

    const populatedRating = await Rating.findById(rating._id)
      .populate('user', 'firstName lastName email')
      .populate('book', 'title author');

    res.status(200).json(populatedRating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all ratings for a specific book
const getRatingsByBook = async (req, res) => {
  try {
    const bookId = req.params.bookId;

    const ratings = await Rating.find({ book: bookId })
      .populate('user', 'firstName lastName email')
      .populate('book', 'title author');

    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a rating (by user or admin)
const deleteRating = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    if (
      rating.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ error: 'Not authorized to delete this rating' });
    }

    await Rating.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Rating deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrUpdateRating,
  getRatingsByBook,
  deleteRating
};
