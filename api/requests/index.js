const { connectToDatabase } = require('../_utils/db');
require('../../server/models/Request');
require('../../server/models/Book');
require('../../server/models/User');
const requestsRoutes = require('../../server/routes/requests');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://your-app-name.vercel.app'] 
    : ['http://localhost:3000'],
  credentials: true
}));

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

app.use('/api/requests', requestsRoutes);

module.exports = app;