const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'returned'], default: 'pending' },
  requestedAt: { type: Date, default: Date.now },
  acceptedAt: { type: Date }, // When the request was accepted
  dueDate: { type: Date }, // When the book should be returned
  returnedAt: { type: Date },
  isOverdue: { type: Boolean, default: false },
  daysOverdue: { type: Number, default: 0 },
  lateFee: { type: Number, default: 0 }, // Late fee in dollars
  remindersSent: [{ 
    type: { type: String, enum: ['before_due', 'due_today', 'overdue'] },
    sentAt: { type: Date, default: Date.now }
  }],
  notes: { type: String, default: '' } // Optional notes from librarian
});

// Virtual to calculate if book is currently overdue
requestSchema.virtual('currentlyOverdue').get(function() {
  if (this.status !== 'accepted' || !this.dueDate) return false;
  return new Date() > this.dueDate;
});

// Virtual to calculate current days overdue
requestSchema.virtual('currentDaysOverdue').get(function() {
  if (!this.currentlyOverdue) return 0;
  const today = new Date();
  const diffTime = today.getTime() - this.dueDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Include virtuals when converting to JSON
requestSchema.set('toJSON', { virtuals: true });
requestSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Request', requestSchema);
