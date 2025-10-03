const { connectToDatabase, handleCors, createResponse } = require('./_utils');
const jwt = require('jsonwebtoken');

// Import models
require('../../server/models/Request');
require('../../server/models/Book');
require('../../server/models/User');
const mongoose = require('mongoose');
const Request = mongoose.model('Request');
const Book = mongoose.model('Book');

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
  // Handle CORS preflight
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  try {
    await connectToDatabase();

    const path = event.path.replace('/.netlify/functions/requests', '');
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};
    const queryParams = event.queryStringParameters || {};

    // Get auth token
    const authHeader = event.headers.authorization || event.headers.Authorization;
    let user = null;
    
    try {
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        user = authenticateToken(token);
      }
    } catch (error) {
      return createResponse(401, { message: 'Authentication required' });
    }

    if (!user) {
      return createResponse(401, { message: 'Authentication required' });
    }

    // Route: GET / (get requests - role-based access)
    if (path === '' && method === 'GET') {
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
      const requests = await Request.find(query)
        .populate('bookId', 'title author isbn')
        .populate('userId', 'name email')
        .sort({ requestedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const totalRequests = await Request.countDocuments(query);
      const totalPages = Math.ceil(totalRequests / parseInt(limit));

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
    }

    // Route: POST / (create new request - students only)
    if (path === '' && method === 'POST') {
      if (user.role !== 'student') {
        return createResponse(403, { message: 'Only students can request books' });
      }

      const { bookId } = body;

      if (!bookId) {
        return createResponse(400, { message: 'Book ID is required' });
      }

      // Check if book exists and is available
      const book = await Book.findById(bookId);
      if (!book) {
        return createResponse(404, { message: 'Book not found' });
      }

      if (!book.available) {
        return createResponse(400, { message: 'Book is not available' });
      }

      // Check if user already has a pending request for this book
      const existingRequest = await Request.findOne({
        userId: user.userId,
        bookId: bookId,
        status: { $in: ['pending', 'approved'] }
      });

      if (existingRequest) {
        return createResponse(400, { 
          message: existingRequest.status === 'pending' 
            ? 'You already have a pending request for this book'
            : 'You have already borrowed this book'
        });
      }

      const request = new Request({
        userId: user.userId,
        bookId: bookId,
        status: 'pending',
        requestedAt: new Date()
      });

      await request.save();

      // Populate the response
      await request.populate('bookId', 'title author isbn');
      await request.populate('userId', 'name email');

      return createResponse(201, {
        message: 'Book request submitted successfully',
        request
      });
    }

    // Route: PUT /:id/approve (approve request - librarian only)
    if (path.match(/^\/[a-f\d]{24}\/approve$/) && method === 'PUT') {
      if (user.role !== 'librarian') {
        return createResponse(403, { message: 'Librarian access required' });
      }

      const requestId = path.split('/')[1];
      const { dueDate } = body;

      const request = await Request.findById(requestId);
      if (!request) {
        return createResponse(404, { message: 'Request not found' });
      }

      if (request.status !== 'pending') {
        return createResponse(400, { message: 'Request is not pending' });
      }

      // Check if book is still available
      const book = await Book.findById(request.bookId);
      if (!book || !book.available) {
        return createResponse(400, { message: 'Book is no longer available' });
      }

      // Update request
      request.status = 'approved';
      request.approvedAt = new Date();
      request.dueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days default

      // Mark book as unavailable
      book.available = false;
      book.borrowedBy = request.userId;
      book.borrowedAt = new Date();
      book.dueDate = request.dueDate;

      await Promise.all([request.save(), book.save()]);

      await request.populate('bookId', 'title author isbn');
      await request.populate('userId', 'name email');

      return createResponse(200, {
        message: 'Request approved successfully',
        request
      });
    }

    // Route: PUT /:id/reject (reject request - librarian only)
    if (path.match(/^\/[a-f\d]{24}\/reject$/) && method === 'PUT') {
      if (user.role !== 'librarian') {
        return createResponse(403, { message: 'Librarian access required' });
      }

      const requestId = path.split('/')[1];
      const { rejectionReason } = body;

      const request = await Request.findById(requestId);
      if (!request) {
        return createResponse(404, { message: 'Request not found' });
      }

      if (request.status !== 'pending') {
        return createResponse(400, { message: 'Request is not pending' });
      }

      request.status = 'rejected';
      request.rejectedAt = new Date();
      request.rejectionReason = rejectionReason;

      await request.save();

      await request.populate('bookId', 'title author isbn');
      await request.populate('userId', 'name email');

      return createResponse(200, {
        message: 'Request rejected successfully',
        request
      });
    }

    // Route: PUT /:id/return (return book - librarian only)
    if (path.match(/^\/[a-f\d]{24}\/return$/) && method === 'PUT') {
      if (user.role !== 'librarian') {
        return createResponse(403, { message: 'Librarian access required' });
      }

      const requestId = path.split('/')[1];

      const request = await Request.findById(requestId);
      if (!request) {
        return createResponse(404, { message: 'Request not found' });
      }

      if (request.status !== 'approved') {
        return createResponse(400, { message: 'Book is not currently borrowed' });
      }

      // Update request
      request.status = 'returned';
      request.returnedAt = new Date();

      // Mark book as available
      const book = await Book.findById(request.bookId);
      if (book) {
        book.available = true;
        book.borrowedBy = null;
        book.borrowedAt = null;
        book.dueDate = null;
        await book.save();
      }

      await request.save();

      await request.populate('bookId', 'title author isbn');
      await request.populate('userId', 'name email');

      return createResponse(200, {
        message: 'Book returned successfully',
        request
      });
    }

    return createResponse(404, { message: 'Endpoint not found' });

  } catch (error) {
    console.error('Requests function error:', error);
    return createResponse(500, { message: 'Server error' });
  }
};