const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, default: 'No description available.' },
  isbn: { type: String, default: '' },
  publishedYear: { type: Number, default: null },
  genre: { type: String, default: 'General' },
  pages: { type: Number, default: null },
  language: { type: String, default: 'English' },
  publisher: { type: String, default: '' },
  available: { type: Boolean, default: true },
  addedAt: { type: Date, default: Date.now }
});

// Create text index for efficient searching
bookSchema.index({
  title: 'text',
  author: 'text',
  description: 'text',
  isbn: 'text',
  publisher: 'text'
}, {
  weights: {
    title: 10,
    author: 5,
    description: 1,
    isbn: 3,
    publisher: 2
  }
});

// Create compound indexes for common queries
bookSchema.index({ genre: 1, available: 1 });
bookSchema.index({ author: 1, available: 1 });
bookSchema.index({ addedAt: -1 });
bookSchema.index({ available: 1, addedAt: -1 });

module.exports = mongoose.model('Book', bookSchema);
