const express = require('express');
const Request = require('../models/Request');
const Book = require('../models/Book');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { requireLibrarian } = require('../middleware/roleAuth');
const dueDateService = require('../services/dueDateService');
const router = express.Router();

// Get all requests (for librarians and admins)
router.get('/', requireLibrarian, async (req, res) => {
  try {
    const requests = await Request.find({ status: { $ne: 'returned' } })
      .populate('student', 'name email')
      .populate('book', 'title author')
      .sort({ requestedAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error('Request error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Student: Request a book
router.post('/', authenticateToken, requireRole('student'), async (req, res) => {
  const { bookId } = req.body;
  try {
    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required' });
    }

    const book = await Book.findById(bookId);
    if (!book || !book.available) return res.status(400).json({ message: 'Book not available' });
    
    // Check if student already has a pending request for this book
    const existingRequest = await Request.findOne({
      student: req.user.userId,
      book: bookId,
      status: { $in: ['pending', 'accepted'] }
    });
    
    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a request for this book' });
    }
    
    const request = new Request({ student: req.user.userId, book: bookId });
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    console.error('Request error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Librarian: Accept a request
router.post('/accept', requireLibrarian, async (req, res) => {
  const { requestId } = req.body;
  try {
    const request = await Request.findById(requestId).populate('student book');
    if (!request || request.status !== 'pending') return res.status(400).json({ message: 'Invalid request' });
    
    // Accept the request and set due date
    const acceptedAt = new Date();
    const dueDate = dueDateService.calculateDueDate(acceptedAt);
    
    request.status = 'accepted';
    request.acceptedAt = acceptedAt;
    request.dueDate = dueDate;
    request.isOverdue = false;
    request.daysOverdue = 0;
    request.lateFee = 0;
    
    await request.save();
    await Book.findByIdAndUpdate(request.book._id, { available: false });
    
    res.json({ 
      message: 'Request accepted',
      dueDate: dueDate,
      loanDays: dueDateService.LOAN_DAYS
    });
  } catch (err) {
    console.error('Request error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Librarian: Send resubmission email
router.post('/notify', requireLibrarian, async (req, res) => {
  const { requestId } = req.body;
  try {
    const request = await Request.findById(requestId).populate('student book');
    if (!request || request.status !== 'accepted') return res.status(400).json({ message: 'Invalid request' });
    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: request.student.email,
      subject: 'Book Resubmission Reminder',
      text: `Please return the book: ${request.book.title}`
    };
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Email sent' });
  } catch (err) {
    console.error('Request error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Librarian: Mark book as returned
router.post('/return', requireLibrarian, async (req, res) => {
  const { requestId } = req.body;
  try {
    console.log('Return request received for requestId:', requestId);
    
    if (!requestId) {
      console.log('Missing requestId in request body');
      return res.status(400).json({ message: 'Request ID is required' });
    }

    const request = await Request.findById(requestId).populate('student book');
    console.log('Found request:', request ? request._id : 'null');
    
    if (!request) {
      console.log('Request not found in database');
      return res.status(404).json({ message: 'Request not found' });
    }
    
    console.log('Current request status:', request.status);
    if (request.status !== 'accepted') {
      console.log('Request status not accepted, cannot return');
      return res.status(400).json({ message: 'Only accepted requests can be returned' });
    }

    // Update request status to returned
    request.status = 'returned';
    request.returnedAt = new Date();
    await request.save();
    console.log('Request updated to returned status');

    // Update book availability
    await Book.findByIdAndUpdate(request.book._id, { available: true });
    console.log('Book availability updated to true');

    res.json({ 
      message: 'Book returned successfully',
      request: {
        id: request._id,
        status: request.status,
        returnedAt: request.returnedAt,
        book: request.book.title,
        student: request.student.name
      }
    });
    console.log('Return operation completed successfully');
  } catch (err) {
    console.error('Return error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get student's active requests (for students to see their borrowed books)
router.get('/my-requests', authenticateToken, requireRole('student'), async (req, res) => {
  try {
    // Update overdue status before returning data
    const requests = await Request.find({ 
      student: req.user.userId,
      status: { $in: ['pending', 'accepted'] }
    })
    .populate('book', 'title author')
    .sort({ requestedAt: -1 });
    
    // Update overdue status for each accepted request
    const updatedRequests = await Promise.all(
      requests.map(async (request) => {
        if (request.status === 'accepted' && request.dueDate) {
          return await dueDateService.updateOverdueStatus(request._id);
        }
        return request;
      })
    );
    
    res.json(updatedRequests);
  } catch (err) {
    console.error('Request error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Librarian: Get overdue books
router.get('/overdue', requireLibrarian, async (req, res) => {
  try {
    const overdueRequests = await dueDateService.getOverdueRequests();
    res.json(overdueRequests);
  } catch (err) {
    console.error('Overdue requests error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Librarian: Get books due soon
router.get('/due-soon', requireLibrarian, async (req, res) => {
  try {
    const dueSoonRequests = await dueDateService.getRequestsDueSoon();
    res.json(dueSoonRequests);
  } catch (err) {
    console.error('Due soon requests error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Librarian: Send manual reminder for a specific request
router.post('/send-reminder', requireLibrarian, async (req, res) => {
  const { requestId, reminderType = 'overdue' } = req.body;
  try {
    const request = await Request.findById(requestId)
      .populate('student', 'name email')
      .populate('book', 'title author');
      
    if (!request || request.status !== 'accepted') {
      return res.status(400).json({ message: 'Invalid request or not accepted' });
    }

    // Update overdue status first
    await dueDateService.updateOverdueStatus(requestId);
    const updatedRequest = await Request.findById(requestId)
      .populate('student', 'name email')
      .populate('book', 'title author');

    const success = await dueDateService.sendDueDateReminder(updatedRequest, reminderType);
    
    if (success) {
      res.json({ message: 'Reminder sent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to send reminder' });
    }
  } catch (err) {
    console.error('Send reminder error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Librarian: Update overdue status for all active requests
router.post('/update-overdue', requireLibrarian, async (req, res) => {
  try {
    const updatedRequests = await dueDateService.updateAllOverdueStatuses();
    res.json({ 
      message: `Updated ${updatedRequests.length} requests`,
      count: updatedRequests.length
    });
  } catch (err) {
    console.error('Update overdue error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Librarian: Process all reminder emails (can be called manually or by cron)
router.post('/process-reminders', requireLibrarian, async (req, res) => {
  try {
    const summary = await dueDateService.processAllReminders();
    res.json({
      message: 'Reminder processing completed',
      summary
    });
  } catch (err) {
    console.error('Process reminders error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get due date statistics (for dashboard)
router.get('/statistics', requireLibrarian, async (req, res) => {
  try {
    await dueDateService.updateAllOverdueStatuses();
    
    const [totalActive, overdueCount, dueSoonCount, totalLateFees] = await Promise.all([
      Request.countDocuments({ status: 'accepted' }),
      Request.countDocuments({ status: 'accepted', isOverdue: true }),
      dueDateService.getRequestsDueSoon().then(requests => requests.length),
      Request.aggregate([
        { $match: { status: 'accepted', isOverdue: true } },
        { $group: { _id: null, totalFees: { $sum: '$lateFee' } } }
      ]).then(result => result[0]?.totalFees || 0)
    ]);

    res.json({
      totalActiveLoans: totalActive,
      overdueBooks: overdueCount,
      dueSoon: dueSoonCount,
      totalLateFees: totalLateFees.toFixed(2),
      loanPeriodDays: dueDateService.LOAN_DAYS,
      lateFeePerDay: dueDateService.LATE_FEE_PER_DAY,
      maxLateFee: dueDateService.MAX_LATE_FEE
    });
  } catch (err) {
    console.error('Statistics error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
