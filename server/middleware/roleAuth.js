// Role-based access control middleware
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Check if user has specific role
const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ message: 'Access token required' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      // Check if user account is active
      if (user.status !== 'active') {
        return res.status(403).json({ 
          message: 'Account is pending approval or suspended',
          status: user.status 
        });
      }

      // Check if user has required role
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ 
          message: 'Insufficient permissions',
          required: allowedRoles,
          current: user.role
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};

// Specific role middleware functions
const requireAdmin = requireRole(['admin']);
const requireLibrarian = requireRole(['admin', 'librarian']);
const requireStudent = requireRole(['admin', 'librarian', 'student']);

// Permission check functions
const canManageUsers = (userRole) => {
  return userRole === 'admin';
};

const canManageBooks = (userRole) => {
  return ['admin', 'librarian'].includes(userRole);
};

const canApproveRequests = (userRole) => {
  return ['admin', 'librarian'].includes(userRole);
};

const canViewOverdue = (userRole) => {
  return ['admin', 'librarian'].includes(userRole);
};

const canSendReminders = (userRole) => {
  return ['admin', 'librarian'].includes(userRole);
};

module.exports = {
  requireRole,
  requireAdmin,
  requireLibrarian,
  requireStudent,
  canManageUsers,
  canManageBooks,
  canApproveRequests,
  canViewOverdue,
  canSendReminders
};