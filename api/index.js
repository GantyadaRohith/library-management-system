const { connectToDatabase } = require('./_utils/db');

// Import all models to ensure they're registered
require('../server/models/User');
require('../server/models/Book');
require('../server/models/Request');

// Import routes
const authRoutes = require('../server/routes/auth');
const booksRoutes = require('../server/routes/books');
const requestsRoutes = require('../server/routes/requests');
const adminRoutes = require('../server/routes/admin');

const express = require('express');
const cors = require('cors');

const app = express();

// Security middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://your-app-name.vercel.app'] 
    : ['http://localhost:3000'],
  credentials: true
}));

// Basic security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// Database connection middleware
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Library Management System API',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

module.exports = app;