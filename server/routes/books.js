const express = require('express');
const Book = require('../models/Book');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateBook } = require('../middleware/validation');
const router = express.Router();

// Get all books with advanced search and filtering (requires authentication)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      search, 
      genre, 
      author, 
      language, 
      available, 
      sortBy = 'addedAt', 
      sortOrder = 'desc',
      page = 1,
      limit = 50
    } = req.query;

    // Base query - role-based filtering
    let query = req.user.role === 'librarian' ? {} : { available: true };

    // Text search across multiple fields
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { description: searchRegex },
        { isbn: searchRegex },
        { publisher: searchRegex }
      ];
    }

    // Filter by genre
    if (genre && genre !== 'all') {
      query.genre = new RegExp(genre, 'i');
    }

    // Filter by author
    if (author && author !== 'all') {
      query.author = new RegExp(author, 'i');
    }

    // Filter by language
    if (language && language !== 'all') {
      query.language = new RegExp(language, 'i');
    }

    // Filter by availability (for librarians)
    if (req.user.role === 'librarian' && available !== undefined) {
      query.available = available === 'true';
    }

    // Build sort object
    const sortOptions = {};
    const validSortFields = ['addedAt', 'title', 'author', 'publishedYear', 'pages'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'addedAt';
    sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const books = await Book.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalBooks = await Book.countDocuments(query);
    const totalPages = Math.ceil(totalBooks / parseInt(limit));

    res.json({
      books,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalBooks,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get filter options for search dropdowns
router.get('/filters/options', authenticateToken, async (req, res) => {
  try {
    // Get distinct values for filters
    const genres = await Book.distinct('genre');
    const authors = await Book.distinct('author');
    const languages = await Book.distinct('language');
    const publishers = await Book.distinct('publisher');

    res.json({
      genres: genres.filter(g => g && g.trim()),
      authors: authors.filter(a => a && a.trim()),
      languages: languages.filter(l => l && l.trim()),
      publishers: publishers.filter(p => p && p.trim())
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get search suggestions (auto-complete)
router.get('/search/suggestions', authenticateToken, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const searchRegex = new RegExp(q, 'i');
    const query = req.user.role === 'librarian' ? {} : { available: true };
    query.$or = [
      { title: searchRegex },
      { author: searchRegex }
    ];

    const suggestions = await Book.find(query)
      .select('title author')
      .limit(10);

    const titleSuggestions = suggestions
      .filter(book => book.title.toLowerCase().includes(q.toLowerCase()))
      .map(book => ({
        text: book.title,
        type: 'title'
      }));

    const authorSuggestions = suggestions
      .filter(book => book.author.toLowerCase().includes(q.toLowerCase()))
      .map(book => ({
        text: book.author,
        type: 'author'
      }));

    // Remove duplicates and limit results
    const allSuggestions = [...titleSuggestions, ...authorSuggestions]
      .filter((suggestion, index, arr) => 
        arr.findIndex(s => s.text === suggestion.text && s.type === suggestion.type) === index
      )
      .slice(0, 8);

    res.json(allSuggestions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single book details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Librarian: Add a new book
router.post('/', authenticateToken, requireRole('librarian'), validateBook, async (req, res) => {
  const { title, author } = req.body;
  try {
    const book = new Book({ title, author });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Librarian/Admin: Delete a book
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user has librarian or admin role
    if (req.user.role !== 'librarian' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
