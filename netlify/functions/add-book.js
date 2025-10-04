const { connectDB, corsHeaders } = require('./_utils');
const jwt = require('jsonwebtoken');
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

// Authentication middleware
const authenticateToken = (token) => {
  if (!token) throw new Error('No token provided');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

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

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    console.log('Add book function called');

    // Connect to database
    await connectDB();

    // Get auth token
    const authHeader = event.headers.authorization || event.headers.Authorization;
    let user = null;
    
    try {
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        user = authenticateToken(token);
      }
    } catch (error) {
      console.log('Authentication failed:', error.message);
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Authentication required' })
      };
    }

    if (!user) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Authentication required' })
      };
    }

    if (user.role !== 'librarian') {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Librarian access required' })
      };
    }

    console.log('User authenticated:', { userId: user.userId, role: user.role });

    const body = event.body ? JSON.parse(event.body) : {};
    const { title, author, isbn, category, totalCopies, description, publishedYear } = body;

    console.log('Adding book:', { title, author, category });

    if (!title || !author || !isbn || !category || !totalCopies) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Title, author, ISBN, category, and total copies are required' })
      };
    }

    // Check if book already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Book with this ISBN already exists' })
      };
    }

    const book = new Book({
      title,
      author,
      isbn,
      category,
      totalCopies: parseInt(totalCopies),
      availableCopies: parseInt(totalCopies),
      description,
      publishedYear: publishedYear ? parseInt(publishedYear) : undefined,
      addedBy: user.userId,
      addedAt: new Date()
    });

    await book.save();
    console.log('Book saved successfully:', book._id);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: 'Book added successfully',
        book: book
      })
    };

  } catch (error) {
    console.error('Add book function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to add book',
        details: error.message 
      })
    };
  }
};