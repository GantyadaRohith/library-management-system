const { connectToDatabase, handleCors, createResponse } = require('./_utils');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./models/User');

exports.handler = async (event, context) => {
  console.log('Register function started');
  
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

    const body = event.body ? JSON.parse(event.body) : {};
    const { name, email, password, role } = body;

    console.log('Register function called with:', { name, email, role });

    // Basic validation
    if (!name || !email || !password || !role) {
      console.log('Validation failed: missing fields');
      return createResponse(400, { message: 'All fields are required' });
    }

    if (password.length < 6) {
      console.log('Validation failed: password too short');
      return createResponse(400, { message: 'Password must be at least 6 characters' });
    }

    if (!['student', 'librarian'].includes(role)) {
      console.log('Validation failed: invalid role');
      return createResponse(400, { message: 'Invalid role selected' });
    }

    console.log('Checking for existing user...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return createResponse(400, { message: 'Email already exists' });
    }

    console.log('Hashing password...');
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

    console.log('Creating user...');
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
    console.log('User saved successfully');

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
    console.error('Error stack:', error.stack);
    return createResponse(500, { 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};