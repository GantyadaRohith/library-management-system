const { connectToDatabase, handleCors, createResponse } = require('./_utils');
const bcrypt = require('bcryptjs');

// Import models
require('../../server/models/User');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.handler = async (event, context) => {
  // Handle CORS preflight
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  if (event.httpMethod !== 'POST') {
    return createResponse(405, { message: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    const body = event.body ? JSON.parse(event.body) : {};
    const { name, email, password, role } = body;

    console.log('Register function called:', { name, email, role });

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

  } catch (error) {
    console.error('Register function error:', error);
    return createResponse(500, { message: 'Server error' });
  }
};