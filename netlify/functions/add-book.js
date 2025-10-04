const { connectToDatabase, handleCors, createResponse } = require('./_utils');
const jwt = require('jsonwebtoken');
const Book = require('./models/Book');

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
  console.log('Add book function called');
  
  // Handle CORS preflight
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  if (event.httpMethod !== 'POST') {
    return createResponse(405, { message: 'Method not allowed' });
  }

  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Database connected');

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
      return createResponse(401, { message: 'Authentication required' });
    }

    if (!user) {
      return createResponse(401, { message: 'Authentication required' });
    }

    if (user.role !== 'librarian') {
      return createResponse(403, { message: 'Librarian access required' });
    }

    console.log('User authenticated:', { userId: user.userId, role: user.role });

    const body = event.body ? JSON.parse(event.body) : {};
    const { title, author, isbn, genre, description, publishedYear, pages, language, publisher } = body;

    console.log('Adding book:', { title, author });

    if (!title || !author) {
      return createResponse(400, { message: 'Title and author are required' });
    }

    const book = new Book({
      title,
      author,
      isbn,
      genre,
      description,
      publishedYear,
      pages,
      language,
      publisher,
      available: true,
      addedAt: new Date()
    });

    await book.save();
    console.log('Book saved successfully:', book._id);

    return createResponse(201, {
      message: 'Book added successfully',
      book: book
    });

  } catch (error) {
    console.error('Add book function error:', error);
    return createResponse(500, { 
      message: 'Server error', 
      error: error.message 
    });
  }
};