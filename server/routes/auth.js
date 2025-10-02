const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateRegister, validateLogin } = require('../middleware/validation');

const router = express.Router();

// Register
router.post('/register', validateRegister, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Validate role
    if (!['student', 'librarian'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role selected' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    let userStatus = 'active';
    let userRole = role;
    let requestedRole = null;

    // If registering as librarian, require admin approval
    if (role === 'librarian') {
      userStatus = 'pending';
      userRole = 'student'; // Default to student until approved
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
      res.status(201).json({ 
        message: 'Registration submitted successfully. Your librarian request is pending admin approval.',
        status: 'pending_approval',
        role: 'student' // Temporary role until approved
      });
    } else {
      res.status(201).json({ 
        message: 'Student account registered successfully',
        status: 'active',
        role: 'student'
      });
    }
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', validateLogin, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check account status
    if (user.status === 'suspended') {
      return res.status(403).json({ 
        message: 'Account suspended. Contact administrator.',
        status: 'suspended'
      });
    }

    if (user.status === 'pending') {
      return res.status(403).json({ 
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

    res.json({ 
      token, 
      user: { 
        name: user.name, 
        email: user.email, 
        role: user.role,
        status: user.status,
        lastLogin: user.lastLogin
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
