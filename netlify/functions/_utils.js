const mongoose = require('mongoose');

let cachedConnection = null;

const connectToDatabase = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    const MONGO_URI = process.env.MONGO_URI;
    
    if (!MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    const connection = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    cachedConnection = connection;
    console.log('Connected to MongoDB');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || '*'
    : 'http://localhost:3000',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Credentials': 'true'
};

// Helper function to handle CORS preflight
const handleCors = (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }
  return null;
};

// Helper function to create response with CORS headers
const createResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    ...corsHeaders
  },
  body: JSON.stringify(body)
});

module.exports = {
  connectToDatabase,
  handleCors,
  createResponse,
  corsHeaders
};