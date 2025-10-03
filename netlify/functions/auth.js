const { connectToDatabase, handleCors, createResponse } = require('./_utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import models
require('../../server/models/User');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.handler = async (event, context) => {
  // Handle CORS preflight
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  try {
    await connectToDatabase();

    const path = event.path.replace('/.netlify/functions/auth', '');
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};

    // Route: POST /register
    if (path === '/register' && method === 'POST') {
      const { name, email, password, role } = body;

      // Validation
      if (!name || !email || !password || !role) {
        return createResponse(400, { message: 'All fields are required' });
      }

      if (password.length < 6) {
        return createResponse(400, { message: 'Password must be at least 6 characters' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return createResponse(400, { message: 'Email already exists' });
      }

      if (!['student', 'librarian'].includes(role)) {
        return createResponse(400, { message: 'Invalid role selected' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      let userStatus = 'active';
      let userRole = role;
      let requestedRole = null;

      // If registering as librarian, require admin approval
      if (role === 'librarian') {
        userStatus = 'pending';
        userRole = 'student';
        requestedRole = 'librarian';
      }

      const user = new User({ 
        name, 
        email, 
        password: hashedPassword, 
        role: userRole,
        status: userStatus,
        requestedRole: requestedRole,
        createdAt: new Date()
      });

      await user.save();

      if (role === 'librarian') {
        return createResponse(201, { 
          message: 'Registration submitted successfully. Your librarian request is pending admin approval.',
          status: 'pending_approval',
          role: 'student'
        });
      } else {
        return createResponse(201, { 
          message: 'Student account registered successfully',
          status: 'active',
          role: 'student'
        });
      }
    }

    // Route: POST /login
    if (path === '/login' && method === 'POST') {
      const { email, password } = body;

      if (!email || !password) {
        return createResponse(400, { message: 'Email and password are required' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return createResponse(400, { message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return createResponse(400, { message: 'Invalid credentials' });
      }

      // Check account status
      if (user.status === 'suspended') {
        return createResponse(403, { 
          message: 'Account suspended. Contact administrator.',
          status: 'suspended'
        });
      }

      if (user.status === 'pending') {
        return createResponse(403, { 
          message: 'Account pending approval. Please wait for admin approval.',
          status: 'pending',
          requestedRole: user.requestedRole
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      const token = jwt.sign(
        { userId: user._id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
      );

      return createResponse(200, { 
        token, 
        user: { 
          name: user.name, 
          email: user.email, 
          role: user.role,
          status: user.status,
          lastLogin: user.lastLogin
        } 
      });
    }

    return createResponse(404, { message: 'Endpoint not found' });

  } catch (error) {
    console.error('Auth function error:', error);
    return createResponse(500, { message: 'Server error' });
  }
};