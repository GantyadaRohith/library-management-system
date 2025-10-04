const { connectToDatabase, handleCors, createResponse } = require('./_utils');
const jwt = require('jsonwebtoken');
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
  console.log('Get requests function called');
  
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
    let query = {};
    
    // Students can only see their own requests
    if (user.role === 'student') {
      query.userId = user.userId;
    }
    // Librarians can see all requests

    const { status, page = 1, limit = 50 } = queryParams;
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    console.log('Fetching requests with query:', query);
    const requests = await Request.find(query)
      .populate('bookId', 'title author isbn')
      .populate('userId', 'name email')
      .sort({ requestedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalRequests = await Request.countDocuments(query);
    const totalPages = Math.ceil(totalRequests / parseInt(limit));

    console.log('Found requests:', requests.length);

    return createResponse(200, {
      requests,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRequests,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get requests function error:', error);
    return createResponse(500, { 
      message: 'Server error', 
      error: error.message 
    });
  }
};