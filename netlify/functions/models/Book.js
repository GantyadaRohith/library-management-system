const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    trim: true
  },
  genre: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  publishedYear: {
    type: Number
  },
  pages: {
    type: Number
  },
  language: {
    type: String,
    default: 'English',
    trim: true
  },
  publisher: {
    type: String,
    trim: true
  },
  available: {
    type: Boolean,
    default: true
  },
  borrowedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  borrowedAt: {
    type: Date
  },
  dueDate: {
    type: Date
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

// Check if the model is already compiled to prevent OverwriteModelError
let Book;
try {
  Book = mongoose.model('Book');
} catch (error) {
  Book = mongoose.model('Book', bookSchema);
}

module.exports = Book;