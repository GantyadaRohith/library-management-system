// Admin routes for user management and system administration
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Request = require('../models/Request');
const Book = require('../models/Book');
const { requireAdmin, requireLibrarian } = require('../middleware/roleAuth');

const router = express.Router();

// Get all users (admin only)
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get pending librarian requests (admin only)
router.get('/pending-librarians', requireAdmin, async (req, res) => {
  try {
    const pendingUsers = await User.find({
      requestedRole: 'librarian',
      status: 'pending'
    }).select('-password').sort({ createdAt: -1 });
    
    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve librarian request (admin only)
router.post('/approve-librarian/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.requestedRole !== 'librarian' || user.status !== 'pending') {
      return res.status(400).json({ message: 'Invalid approval request' });
    }

    user.role = 'librarian';
    user.status = 'active';
    user.requestedRole = null;
    user.approvedBy = req.user._id;
    await user.save();

    res.json({ message: 'Librarian approved successfully', user: user.name });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reject librarian request (admin only)
router.post('/reject-librarian/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.requestedRole !== 'librarian' || user.status !== 'pending') {
      return res.status(400).json({ message: 'Invalid rejection request' });
    }

    user.role = 'student'; // Default to student
    user.status = 'active';
    user.requestedRole = null;
    await user.save();

    res.json({ 
      message: 'Librarian request rejected', 
      user: user.name,
      reason: reason || 'No reason provided'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change user role (admin only)
router.put('/users/:userId/role', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, status } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent changing own role
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }

    if (role && ['student', 'librarian', 'admin'].includes(role)) {
      user.role = role;
    }
    
    if (status && ['active', 'pending', 'suspended'].includes(status)) {
      user.status = status;
    }

    user.approvedBy = req.user._id;
    await user.save();

    res.json({ 
      message: 'User updated successfully', 
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get system statistics (admin and librarian)
router.get('/statistics', requireLibrarian, async (req, res) => {
  try {
    const [
      totalUsers,
      totalBooks,
      totalRequests,
      pendingLibrarians,
      activeRequests,
      overdueRequests
    ] = await Promise.all([
      User.countDocuments(),
      Book.countDocuments(),
      Request.countDocuments(),
      User.countDocuments({ requestedRole: 'librarian', status: 'pending' }),
      Request.countDocuments({ status: 'accepted' }),
      Request.countDocuments({ 
        status: 'accepted',
        dueDate: { $lt: new Date() }
      })
    ]);

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const requestsByStatus = await Request.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      overview: {
        totalUsers,
        totalBooks,
        totalRequests,
        pendingLibrarians,
        activeRequests,
        overdueRequests
      },
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      requestsByStatus: requestsByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user (admin only)
router.delete('/users/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Prevent deleting own account
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has active requests
    const activeRequests = await Request.countDocuments({
      student: userId,
      status: { $in: ['pending', 'accepted'] }
    });

    if (activeRequests > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete user with active book requests',
        activeRequests
      });
    }

    await User.findByIdAndDelete(userId);
    
    res.json({ 
      message: 'User deleted successfully',
      deletedUser: user.name
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;