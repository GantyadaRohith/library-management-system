require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Security middleware
app.use(express.json({ limit: '10mb' }));
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? (process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(o => o.trim()) : ['http://localhost:3000'])
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Basic security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/library';

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is required. Please set it in your .env file');
  process.exit(1);
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    // Initialize reminder scheduler after DB connection
    try {
      const reminderScheduler = require('./services/reminderScheduler');
      reminderScheduler.initializeReminderScheduler();
    } catch (schedulerError) {
      console.error('Scheduler initialization error:', schedulerError);
      // Continue without scheduler if there's an error
    }
  })
    .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });



console.log('Loading routes...');

try {
  const authRoutes = require('./routes/auth');
  console.log('Auth routes loaded');
  
  const booksRoutes = require('./routes/books');
  console.log('Books routes loaded');
  
  const requestsRoutes = require('./routes/requests');
  console.log('Requests routes loaded');
  
  const adminRoutes = require('./routes/admin');
  console.log('Admin routes loaded');

  app.use('/api/auth', authRoutes);
  app.use('/api/books', booksRoutes);
  app.use('/api/requests', requestsRoutes);
  app.use('/api/admin', adminRoutes);
  console.log('Routes configured');
} catch (routeError) {
  console.error('Error loading routes:', routeError);
  process.exit(1);
}

app.get('/', (req, res) => {
  res.send('Library Management System API');
});

console.log('Starting HTTP server...');
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API available at http://localhost:5000`);
});
