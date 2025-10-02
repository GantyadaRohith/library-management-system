const Request = require('../models/Request');
const nodemailer = require('nodemailer');

// Configuration constants from environment variables
const LOAN_DAYS = parseInt(process.env.LOAN_DAYS) || 14; // Default loan period in days
const LATE_FEE_PER_DAY = parseFloat(process.env.LATE_FEE_PER_DAY) || 0.50; // Late fee per day in dollars
const MAX_LATE_FEE = parseFloat(process.env.MAX_LATE_FEE) || 15.00; // Maximum late fee cap
const REMINDER_DAYS_BEFORE = parseInt(process.env.REMINDER_DAYS_BEFORE) || 3; // Send reminder 3 days before due date

/**
 * Calculate due date from acceptance date
 * @param {Date} acceptedDate - Date when request was accepted
 * @param {number} loanDays - Number of days for loan period
 * @returns {Date} Due date
 */
const calculateDueDate = (acceptedDate = new Date(), loanDays = LOAN_DAYS) => {
  const dueDate = new Date(acceptedDate);
  dueDate.setDate(dueDate.getDate() + loanDays);
  // Set to end of day (23:59:59)
  dueDate.setHours(23, 59, 59, 999);
  return dueDate;
};

/**
 * Check if a request is overdue
 * @param {Date} dueDate - Due date of the book
 * @returns {boolean} True if overdue
 */
const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date() > dueDate;
};

/**
 * Calculate days overdue
 * @param {Date} dueDate - Due date of the book
 * @returns {number} Number of days overdue (0 if not overdue)
 */
const calculateDaysOverdue = (dueDate) => {
  if (!isOverdue(dueDate)) return 0;
  const today = new Date();
  const diffTime = today.getTime() - dueDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Calculate late fee based on days overdue
 * @param {number} daysOverdue - Number of days overdue
 * @returns {number} Late fee amount
 */
const calculateLateFee = (daysOverdue) => {
  if (daysOverdue <= 0) return 0;
  const fee = daysOverdue * LATE_FEE_PER_DAY;
  return Math.min(fee, MAX_LATE_FEE); // Cap at maximum fee
};

/**
 * Update overdue status for a single request
 * @param {string} requestId - Request ID to update
 * @returns {Object} Updated request
 */
const updateOverdueStatus = async (requestId) => {
  const request = await Request.findById(requestId);
  if (!request || request.status !== 'accepted' || !request.dueDate) {
    return request;
  }

  const overdueStatus = isOverdue(request.dueDate);
  const daysOverdue = calculateDaysOverdue(request.dueDate);
  const lateFee = calculateLateFee(daysOverdue);

  request.isOverdue = overdueStatus;
  request.daysOverdue = daysOverdue;
  request.lateFee = lateFee;

  await request.save();
  return request;
};

/**
 * Update overdue status for all active requests
 * @returns {Array} Array of updated requests
 */
const updateAllOverdueStatuses = async () => {
  const activeRequests = await Request.find({ 
    status: 'accepted',
    dueDate: { $exists: true, $ne: null }
  });

  const updates = await Promise.all(
    activeRequests.map(async (request) => {
      const overdueStatus = isOverdue(request.dueDate);
      const daysOverdue = calculateDaysOverdue(request.dueDate);
      const lateFee = calculateLateFee(daysOverdue);

      if (request.isOverdue !== overdueStatus || 
          request.daysOverdue !== daysOverdue || 
          request.lateFee !== lateFee) {
        
        request.isOverdue = overdueStatus;
        request.daysOverdue = daysOverdue;
        request.lateFee = lateFee;
        await request.save();
      }
      
      return request;
    })
  );

  return updates;
};

/**
 * Get all overdue requests
 * @returns {Array} Array of overdue requests
 */
const getOverdueRequests = async () => {
  await updateAllOverdueStatuses(); // Ensure data is current
  return await Request.find({
    status: 'accepted',
    isOverdue: true
  }).populate('student', 'name email').populate('book', 'title author');
};

/**
 * Get requests due soon (within reminder period)
 * @returns {Array} Array of requests due soon
 */
const getRequestsDueSoon = async () => {
  const reminderDate = new Date();
  reminderDate.setDate(reminderDate.getDate() + REMINDER_DAYS_BEFORE);
  reminderDate.setHours(23, 59, 59, 999);

  return await Request.find({
    status: 'accepted',
    dueDate: { $lte: reminderDate, $gte: new Date() },
    isOverdue: false
  }).populate('student', 'name email').populate('book', 'title author');
};

/**
 * Send email notification
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Email content
 * @returns {boolean} Success status
 */
const sendEmail = async (to, subject, text) => {
  try {
    // Check if emails are disabled for development
    if (process.env.EMAIL_ENABLED === 'false') {
      console.log('📧 EMAIL (Development Mode - Not Sent):');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Content: ${text}`);
      console.log('-----------------------------------');
      return true; // Return success for development
    }

    // Configure email transport based on environment variables
    const emailConfig = {
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    };

    // Add service or manual SMTP configuration
    if (process.env.EMAIL_HOST && process.env.EMAIL_PORT) {
      // Manual SMTP configuration
      emailConfig.host = process.env.EMAIL_HOST;
      emailConfig.port = parseInt(process.env.EMAIL_PORT);
      emailConfig.secure = process.env.EMAIL_SECURE === 'true'; // true for 465, false for other ports
      emailConfig.tls = {
        rejectUnauthorized: false // Allow self-signed certificates
      };
    } else {
      // Explicit Gmail SMTP configuration (more reliable than service shortcut)
      emailConfig.host = 'smtp.gmail.com';
      emailConfig.port = 587;
      emailConfig.secure = false; // true for 465, false for other ports like 587
      emailConfig.tls = {
        rejectUnauthorized: false
      };
    }

    const transporter = nodemailer.createTransport(emailConfig);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">${text.replace(/\n/g, '<br>')}</div>`
    });

    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

/**
 * Send due date reminder email
 * @param {Object} request - Request object with populated student and book
 * @param {string} type - Type of reminder ('before_due', 'due_today', 'overdue')
 * @returns {boolean} Success status
 */
const sendDueDateReminder = async (request, type) => {
  const student = request.student;
  const book = request.book;
  const dueDate = request.dueDate.toLocaleDateString();

  let subject, message;

  switch (type) {
    case 'before_due':
      subject = `Library Reminder: "${book.title}" due in ${REMINDER_DAYS_BEFORE} days`;
      message = `Dear ${student.name},

This is a friendly reminder that your borrowed book is due soon:

📚 Book: "${book.title}" by ${book.author}
📅 Due Date: ${dueDate}

Please return the book to the library on or before the due date to avoid late fees.

Thank you!
Library Management System`;
      break;

    case 'due_today':
      subject = `Library Notice: "${book.title}" is due today`;
      message = `Dear ${student.name},

Your borrowed book is due today:

📚 Book: "${book.title}" by ${book.author}
📅 Due Date: ${dueDate}

Please return the book to the library today to avoid late fees.

Thank you!
Library Management System`;
      break;

    case 'overdue':
      const daysOverdue = request.daysOverdue;
      const lateFee = request.lateFee.toFixed(2);
      subject = `Library Overdue Notice: "${book.title}" - ${daysOverdue} day(s) overdue`;
      message = `Dear ${student.name},

Your borrowed book is now overdue:

📚 Book: "${book.title}" by ${book.author}
📅 Due Date: ${dueDate}
⏰ Days Overdue: ${daysOverdue}
💰 Current Late Fee: $${lateFee}

Please return the book as soon as possible. Late fees accrue at $${LATE_FEE_PER_DAY}/day up to a maximum of $${MAX_LATE_FEE}.

Contact the library if you have any questions.

Thank you!
Library Management System`;
      break;

    default:
      return false;
  }

  const success = await sendEmail(student.email, subject, message);
  
  if (success) {
    // Record that reminder was sent
    request.remindersSent.push({ type, sentAt: new Date() });
    await request.save();
  }

  return success;
};

/**
 * Check if a reminder of specific type was already sent recently
 * @param {Object} request - Request object
 * @param {string} type - Reminder type
 * @param {number} hours - Hours to check back (default 24)
 * @returns {boolean} True if reminder was sent recently
 */
const wasReminderSentRecently = (request, type, hours = 24) => {
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - hours);
  
  return request.remindersSent.some(reminder => 
    reminder.type === type && reminder.sentAt > cutoff
  );
};

/**
 * Process all due date reminders (should be run daily)
 * @returns {Object} Summary of reminders sent
 */
const processAllReminders = async () => {
  const summary = {
    beforeDue: 0,
    dueToday: 0,
    overdue: 0,
    errors: []
  };

  try {
    // Update all overdue statuses first
    await updateAllOverdueStatuses();

    // Get requests due soon (before due date)
    const dueSoonRequests = await getRequestsDueSoon();
    for (const request of dueSoonRequests) {
      if (!wasReminderSentRecently(request, 'before_due')) {
        const success = await sendDueDateReminder(request, 'before_due');
        if (success) summary.beforeDue++;
        else summary.errors.push(`Failed to send before_due reminder for request ${request._id}`);
      }
    }

    // Get requests due today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dueTodayRequests = await Request.find({
      status: 'accepted',
      dueDate: { $gte: today, $lt: tomorrow }
    }).populate('student', 'name email').populate('book', 'title author');

    for (const request of dueTodayRequests) {
      if (!wasReminderSentRecently(request, 'due_today')) {
        const success = await sendDueDateReminder(request, 'due_today');
        if (success) summary.dueToday++;
        else summary.errors.push(`Failed to send due_today reminder for request ${request._id}`);
      }
    }

    // Get overdue requests
    const overdueRequests = await getOverdueRequests();
    for (const request of overdueRequests) {
      if (!wasReminderSentRecently(request, 'overdue')) {
        const success = await sendDueDateReminder(request, 'overdue');
        if (success) summary.overdue++;
        else summary.errors.push(`Failed to send overdue reminder for request ${request._id}`);
      }
    }

  } catch (error) {
    summary.errors.push(`Global error: ${error.message}`);
  }

  return summary;
};

module.exports = {
  calculateDueDate,
  isOverdue,
  calculateDaysOverdue,
  calculateLateFee,
  updateOverdueStatus,
  updateAllOverdueStatuses,
  getOverdueRequests,
  getRequestsDueSoon,
  sendDueDateReminder,
  processAllReminders,
  wasReminderSentRecently,
  // Export constants for use elsewhere
  LOAN_DAYS,
  LATE_FEE_PER_DAY,
  MAX_LATE_FEE,
  REMINDER_DAYS_BEFORE
};