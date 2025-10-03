const { connectToDatabase, handleCors, createResponse } = require('./_utils');
const jwt = require('jsonwebtoken');

// Import models
require('../../server/models/Book');
const mongoose = require('mongoose');
const Book = mongoose.model('Book');

// Authentication middleware
const authenticateToken = (token) => {
  if (!token) throw new Error('No token provided');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

exports.handler = async (event, context) => {
  // Handle CORS preflight
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  try {
    await connectToDatabase();

    const path = event.path.replace('/.netlify/functions/books', '');
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};
    const queryParams = event.queryStringParameters || {};

    // Get auth token
    const authHeader = event.headers.authorization || event.headers.Authorization;
    let user = null;
    
    try {
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        user = authenticateToken(token);
      }
    } catch (error) {
      return createResponse(401, { message: 'Authentication required' });
    }

    if (!user) {
      return createResponse(401, { message: 'Authentication required' });
    }

    // Route: GET / (get all books with search and filtering)
    if (path === '' && method === 'GET') {
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
      } = queryParams;

      // Base query - role-based filtering
      let query = user.role === 'librarian' ? {} : { available: true };

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
      if (user.role === 'librarian' && available !== undefined) {
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

      return createResponse(200, {
        books,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalBooks,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      });
    }

    // Route: GET /filters/options
    if (path === '/filters/options' && method === 'GET') {
      const genres = await Book.distinct('genre');
      const authors = await Book.distinct('author');
      const languages = await Book.distinct('language');
      const publishers = await Book.distinct('publisher');

      return createResponse(200, {
        genres: genres.filter(g => g && g.trim()),
        authors: authors.filter(a => a && a.trim()),
        languages: languages.filter(l => l && l.trim()),
        publishers: publishers.filter(p => p && p.trim())
      });
    }

    // Route: GET /search/suggestions
    if (path === '/search/suggestions' && method === 'GET') {
      const { q } = queryParams;
      if (!q || q.length < 2) {
        return createResponse(200, []);
      }

      const searchRegex = new RegExp(q, 'i');
      const query = user.role === 'librarian' ? {} : { available: true };
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

      const allSuggestions = [...titleSuggestions, ...authorSuggestions]
        .filter((suggestion, index, arr) => 
          arr.findIndex(s => s.text === suggestion.text && s.type === suggestion.type) === index
        )
        .slice(0, 8);

      return createResponse(200, allSuggestions);
    }

    // Route: GET /:id (get single book)
    if (path.startsWith('/') && path.length === 25 && method === 'GET') {
      const bookId = path.substring(1);
      const book = await Book.findById(bookId);
      if (!book) {
        return createResponse(404, { message: 'Book not found' });
      }
      return createResponse(200, book);
    }

    // Route: POST / (add new book - librarian only)
    if (path === '' && method === 'POST') {
      if (user.role !== 'librarian') {
        return createResponse(403, { message: 'Librarian access required' });
      }

      const { title, author, isbn, genre, description, publishedYear, pages, language, publisher } = body;

      if (!title || !author) {
        return createResponse(400, { message: 'Title and author are required' });
      }

      const book = new Book({
        title,
        author,
        isbn,
        genre,
        description,
        publishedYear,
        pages,
        language,
        publisher,
        available: true,
        addedAt: new Date()
      });

      await book.save();
      return createResponse(201, book);
    }

    return createResponse(404, { message: 'Endpoint not found' });

  } catch (error) {
    console.error('Books function error:', error);
    return createResponse(500, { message: 'Server error' });
  }
};