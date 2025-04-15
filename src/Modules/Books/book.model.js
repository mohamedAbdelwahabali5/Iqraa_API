const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
    index: true
  },
  author: {
    type: String,
    minlength: [3, 'Author must be at least 3 characters'],
    maxlength: [50, 'Author cannot exceed 100 characters'],
    trim: true,
    required: [true, 'Author reference is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  coverImage: {
    type: String,
    required: [true, 'Cover image is required'],
    validate: {
      validator: function(v) {
        return /\.(jpg|jpeg|png|webp)$/i.test(v);
      },
      message: props => `${props.value} is not a valid image file!`
    }
  },
  pdfFile:{
    type: String,
    required: true,
    trim: true,
    default: 'https://default'
  },
  available: {
    type: Boolean,
    default: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock quantity cannot be negative'],
    default: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category reference is required']
  },
  publishedDate: {
    type: Date,
    required: [true, 'Published date is required'],
    max: [Date.now, 'Published date cannot be in the future']
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    enum: {
      values: ['English', 'Arabic'],
      message: 'Language must be English or Arabic'
    },
    default: 'Arabic'
  }
 }, {
    timestamps: true // Adds createdAt and updatedAt automatically
});



const Book = mongoose.model('Book', bookSchema);

module.exports = {
    Book
};