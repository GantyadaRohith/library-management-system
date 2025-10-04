const { connectDB, corsHeaders } = require('./_utils');
const mongoose = require('mongoose');

// Book schema (local definition)
const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  totalCopies: { type: Number, required: true, min: 1 },
  availableCopies: { type: Number, required: true, min: 0 },
  description: String,
  publishedYear: Number,
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  addedAt: { type: Date, default: Date.now }
});

let Book;
try {
  Book = mongoose.model('Book');
} catch {
  Book = mongoose.model('Book', BookSchema);
}

exports.handler = async (event, context) => {
  // Set CORS headers for all responses
  const headers = corsHeaders;

  try {
    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: ''
      };
    }

    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    console.log('Getting filter options...');

    // Connect to database
    await connectDB();

    // Get unique categories
    const categories = await Book.distinct('category');
    
    // Get unique authors
    const authors = await Book.distinct('author');
    
    // Get year range
    const yearRange = await Book.aggregate([
      {
        $group: {
          _id: null,
          minYear: { $min: '$publishedYear' },
          maxYear: { $max: '$publishedYear' }
        }
      }
    ]);

    const filterOptions = {
      categories: categories.filter(Boolean).sort(),
      authors: authors.filter(Boolean).sort(),
      yearRange: yearRange.length > 0 ? {
        min: yearRange[0].minYear || 1900,
        max: yearRange[0].maxYear || new Date().getFullYear()
      } : {
        min: 1900,
        max: new Date().getFullYear()
      }
    };

    console.log('Filter options retrieved:', filterOptions);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(filterOptions)
    };

  } catch (error) {
    console.error('Error getting filter options:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to get filter options',
        details: error.message 
      })
    };
  }
};