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

  if (event.httpMethod !== 'POST') {
    return createResponse(405, { message: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    const body = event.body ? JSON.parse(event.body) : {};
    const { email, password } = body;

    console.log('Login function called:', { email });

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

  } catch (error) {
    console.error('Login function error:', error);
    return createResponse(500, { message: 'Server error' });
  }
};