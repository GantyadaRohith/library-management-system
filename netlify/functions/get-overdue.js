const { connectToDatabase, handleCors, createResponse } = require('./_utils');
const jwt = require('jsonwebtoken');
const Book = require('./models/Book');
const Request = require('./models/Request');

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
  console.log('Get overdue function called');
  
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

    if (user.role !== 'librarian') {
      return createResponse(403, { message: 'Librarian access required' });
    }

    console.log('User authenticated:', { userId: user.userId, role: user.role });

    console.log('Fetching overdue books...');
    const overdueBooks = await Book.find({
      available: false,
      dueDate: { $lt: new Date() }
    }).populate('borrowedBy', 'name email');

    // Get associated requests for more details
    const bookIds = overdueBooks.map(book => book._id);
    const requests = await Request.find({
      bookId: { $in: bookIds },
      status: 'approved'
    }).populate('userId', 'name email');

    // Combine data
    const overdueData = overdueBooks.map(book => {
      const request = requests.find(req => req.bookId.toString() === book._id.toString());
      return {
        book,
        request,
        daysOverdue: Math.floor((new Date() - new Date(book.dueDate)) / (1000 * 60 * 60 * 24))
      };
    });

    console.log('Found overdue books:', overdueData.length);

    return createResponse(200, {
      overdueBooks: overdueData,
      count: overdueData.length
    });

  } catch (error) {
    console.error('Get overdue function error:', error);
    return createResponse(500, { 
      message: 'Server error', 
      error: error.message 
    });
  }
};