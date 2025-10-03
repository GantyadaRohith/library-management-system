const { connectToDatabase, handleCors, createResponse } = require('./_utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Define User schema directly in the function
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'librarian'],
    default: 'student'
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'pending'],
    default: 'active'
  },
  requestedRole: {
    type: String,
    enum: ['librarian'],
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

// Get or create User model
const User = mongoose.models.User || mongoose.model('User', userSchema);

exports.handler = async (event, context) => {
  console.log('Login function started');
  
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
    const { email, password } = body;

    console.log('Login attempt for:', { email, hasPassword: !!password });

    if (!email || !password) {
      console.log('Missing email or password');
      return createResponse(400, { message: 'Email and password are required' });
    }

    console.log('Looking for user with email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return createResponse(400, { message: 'Invalid credentials' });
    }

    console.log('User found:', { id: user._id, email: user.email, role: user.role, status: user.status });

    console.log('Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match');
      return createResponse(400, { message: 'Invalid credentials' });
    }

    console.log('Password matches!');

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