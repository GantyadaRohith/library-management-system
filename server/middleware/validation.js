const validator = require('validator');

const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body;
  const errors = [];

  // Check required fields
  if (!name?.trim()) errors.push('Name is required');
  if (!email?.trim()) errors.push('Email is required');
  if (!password) errors.push('Password is required');
  if (!role) errors.push('Role is required');

  // Validate email format
  if (email && !validator.isEmail(email)) {
    errors.push('Please provide a valid email');
  }

  // Validate password strength
  if (password && password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  // Validate role
  if (role && !['student', 'librarian'].includes(role)) {
    errors.push('Role must be either student or librarian');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation errors', errors });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email?.trim()) errors.push('Email is required');
  if (!password) errors.push('Password is required');

  if (email && !validator.isEmail(email)) {
    errors.push('Please provide a valid email');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation errors', errors });
  }

  next();
};

const validateBook = (req, res, next) => {
  const { title, author, publishedYear, pages } = req.body;
  const errors = [];

  if (!title?.trim()) errors.push('Title is required');
  if (!author?.trim()) errors.push('Author is required');
  
  if (publishedYear !== null && publishedYear !== undefined) {
    const year = parseInt(publishedYear);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1000 || year > currentYear) {
      errors.push('Published year must be a valid year between 1000 and current year');
    }
  }
  
  if (pages !== null && pages !== undefined) {
    const pageCount = parseInt(pages);
    if (isNaN(pageCount) || pageCount < 1) {
      errors.push('Pages must be a positive number');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation errors', errors });
  }

  next();
};

module.exports = { validateRegister, validateLogin, validateBook };