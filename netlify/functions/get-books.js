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
  console.log('Get books function called');
  
  // Handle CORS preflight
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  if (event.httpMethod !== 'GET') {
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

    console.log('User authenticated:', { userId: user.userId, role: user.role });

    const queryParams = event.queryStringParameters || {};
    const { 
      search, 
      genre, 
      author, 
      language, 
      available, 
      sortBy = 'addedAt', 
      sortOrder = 'desc',
      page = 1,
      limit = 50
    } = queryParams;

    // Base query - role-based filtering
    let query = user.role === 'librarian' ? {} : { available: true };

    // Text search across multiple fields
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { description: searchRegex },
        { isbn: searchRegex },
        { publisher: searchRegex }
      ];
    }

    // Filter by genre
    if (genre && genre !== 'all') {
      query.genre = new RegExp(genre, 'i');
    }

    // Filter by author
    if (author && author !== 'all') {
      query.author = new RegExp(author, 'i');
    }

    // Filter by language
    if (language && language !== 'all') {
      query.language = new RegExp(language, 'i');
    }

    // Filter by availability (for librarians)
    if (user.role === 'librarian' && available !== undefined) {
      query.available = available === 'true';
    }

    // Build sort object
    const sortOptions = {};
    const validSortFields = ['addedAt', 'title', 'author', 'publishedYear', 'pages'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'addedAt';
    sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    console.log('Fetching books with query:', query);
    const books = await Book.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalBooks = await Book.countDocuments(query);
    const totalPages = Math.ceil(totalBooks / parseInt(limit));

    console.log('Found books:', books.length);

    return createResponse(200, {
      books,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalBooks,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get books function error:', error);
    return createResponse(500, { 
      message: 'Server error', 
      error: error.message 
    });
  }
};