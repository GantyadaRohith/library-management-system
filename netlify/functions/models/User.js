const mongoose = require('mongoose');

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

// Check if the model is already compiled to prevent OverwriteModelError
let User;
try {
  User = mongoose.model('User');
} catch (error) {
  User = mongoose.model('User', userSchema);
}

module.exports = User;