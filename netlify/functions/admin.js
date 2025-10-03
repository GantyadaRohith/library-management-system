const { connectToDatabase, handleCors, createResponse } = require('./_utils');
const jwt = require('jsonwebtoken');

// Import models
const User = require('./models/User');
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
  // Handle CORS preflight
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  try {
    await connectToDatabase();

    const path = event.path.replace('/.netlify/functions/admin', '');
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

    if (!user || user.role !== 'librarian') {
      return createResponse(403, { message: 'Librarian access required' });
    }

    // Route: GET /stats (dashboard statistics)
    if (path === '/stats' && method === 'GET') {
      const [
        totalBooks,
        totalUsers,
        pendingRequests,
        approvedRequests,
        availableBooks,
        borrowedBooks,
        overdueBooks
      ] = await Promise.all([
        Book.countDocuments(),
        User.countDocuments({ role: { $in: ['student', 'librarian'] } }),
        Request.countDocuments({ status: 'pending' }),
        Request.countDocuments({ status: 'approved' }),
        Book.countDocuments({ available: true }),
        Book.countDocuments({ available: false }),
        Book.countDocuments({ 
          available: false, 
          dueDate: { $lt: new Date() } 
        })
      ]);

      // Recent activity
      const recentRequests = await Request.find()
        .populate('userId', 'name email')
        .populate('bookId', 'title author')
        .sort({ requestedAt: -1 })
        .limit(10);

      return createResponse(200, {
        stats: {
          totalBooks,
          totalUsers,
          pendingRequests,
          approvedRequests,
          availableBooks,
          borrowedBooks,
          overdueBooks
        },
        recentActivity: recentRequests
      });
    }

    // Route: GET /users (manage users)
    if (path === '/users' && method === 'GET') {
      const { status, role, page = 1, limit = 50 } = queryParams;
      
      let query = {};
      
      if (status && status !== 'all') {
        query.status = status;
      }
      
      if (role && role !== 'all') {
        query.role = role;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const totalUsers = await User.countDocuments(query);
      const totalPages = Math.ceil(totalUsers / parseInt(limit));

      return createResponse(200, {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      });
    }

    // Route: PUT /users/:id/status (update user status)
    if (path.match(/^\/users\/[a-f\d]{24}\/status$/) && method === 'PUT') {
      const userId = path.split('/')[2];
      const { status, role } = body;

      if (!['active', 'suspended', 'pending'].includes(status)) {
        return createResponse(400, { message: 'Invalid status' });
      }

      const targetUser = await User.findById(userId);
      if (!targetUser) {
        return createResponse(404, { message: 'User not found' });
      }

      targetUser.status = status;
      
      // If approving a librarian request
      if (status === 'active' && role && targetUser.requestedRole === 'librarian') {
        targetUser.role = 'librarian';
        targetUser.requestedRole = null;
      }

      await targetUser.save();

      return createResponse(200, {
        message: 'User status updated successfully',
        user: {
          id: targetUser._id,
          name: targetUser.name,
          email: targetUser.email,
          role: targetUser.role,
          status: targetUser.status
        }
      });
    }

    // Route: GET /overdue (get overdue books)
    if (path === '/overdue' && method === 'GET') {
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

      return createResponse(200, {
        overdueBooks: overdueData,
        count: overdueData.length
      });
    }

    // Route: POST /send-reminder (send overdue reminder)
    if (path === '/send-reminder' && method === 'POST') {
      const { userId, bookId, message } = body;

      // In a real application, you would send an email here
      // For now, we'll just log it and return success
      console.log(`Reminder sent to user ${userId} for book ${bookId}: ${message}`);

      return createResponse(200, {
        message: 'Reminder sent successfully'
      });
    }

    return createResponse(404, { message: 'Endpoint not found' });

  } catch (error) {
    console.error('Admin function error:', error);
    return createResponse(500, { message: 'Server error' });
  }
};