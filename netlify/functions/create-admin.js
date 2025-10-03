const { connectToDatabase, handleCors, createResponse } = require('./_utils');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Define User schema
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

const User = mongoose.models.User || mongoose.model('User', userSchema);

exports.handler = async (event, context) => {
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  if (event.httpMethod !== 'POST') {
    return createResponse(405, { message: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    // Check if any librarian already exists
    const existingLibrarian = await User.findOne({ role: 'librarian' });
    if (existingLibrarian) {
      return createResponse(400, { 
        message: 'Admin already exists. This function is only for initial setup.',
        admin: existingLibrarian.email
      });
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const { name, email, password, secretKey } = body;

    // Secret key for security (you can set this in environment variables)
    const ADMIN_SETUP_KEY = process.env.ADMIN_SETUP_KEY || 'create-first-admin-2024';
    
    if (secretKey !== ADMIN_SETUP_KEY) {
      return createResponse(403, { message: 'Invalid secret key' });
    }

    if (!name || !email || !password) {
      return createResponse(400, { message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return createResponse(400, { message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'librarian',
      status: 'active',
      createdAt: new Date()
    });

    await admin.save();

    return createResponse(201, {
      message: 'Admin account created successfully',
      admin: {
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Create admin error:', error);
    return createResponse(500, { message: 'Server error' });
  }
};