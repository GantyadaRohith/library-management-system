const { connectDB, corsHeaders } = require('./_utils');
const bcrypt = require('bcryptjs');
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
    required: false
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
  // Set CORS headers for all responses
  const headers = corsHeaders;

  try {
    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: ''
      };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    console.log('Register function started');
    
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected');

    const body = event.body ? JSON.parse(event.body) : {};
    const { name, email, password, role } = body;

    console.log('Register function called with:', { name, email, role });

    // Basic validation
    if (!name || !email || !password || !role) {
      console.log('Validation failed: missing fields');
      return { statusCode: , headers, body: JSON.stringify({ error:  }) };
    }

    if (password.length < 6) {
      console.log('Validation failed: password too short');
      return { statusCode: , headers, body: JSON.stringify({ error:  }) };
    }

    if (!['student', 'librarian'].includes(role)) {
      console.log('Validation failed: invalid role');
      return { statusCode: , headers, body: JSON.stringify({ error:  }) };
    }

    console.log('Checking for existing user...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return { statusCode: , headers, body: JSON.stringify({ error:  }) };
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let userStatus = 'active';
    let userRole = role;

    // If registering as librarian, require admin approval
    if (role === 'librarian') {
      userStatus = 'pending';
      userRole = 'student';
    }

    console.log('Creating user...');
    const userData = { 
      name, 
      email, 
      password: hashedPassword, 
      role: userRole,
      status: userStatus,
      createdAt: new Date()
    };

    // Only add requestedRole if it's a librarian request
    if (role === 'librarian') {
      userData.requestedRole = 'librarian';
    }

    const user = new User(userData);

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
