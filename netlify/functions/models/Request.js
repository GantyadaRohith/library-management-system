const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'returned'],
    default: 'pending'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date
  },
  rejectedAt: {
    type: Date
  },
  returnedAt: {
    type: Date
  },
  dueDate: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  }
});

// Check if the model is already compiled to prevent OverwriteModelError
let Request;
try {
  Request = mongoose.model('Request');
} catch (error) {
  Request = mongoose.model('Request', requestSchema);
}

module.exports = Request;