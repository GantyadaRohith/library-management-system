
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import AddBook from './AddBook';
import BookCard from './BookCard';
import BookModal from './BookModal';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';

function BookList({ user, showToast }) {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    genre: 'all',
    author: 'all',
    language: 'all',
    available: undefined,
    sortBy: 'addedAt',
    sortOrder: 'desc',
    page: 1,
    limit: 20
  });

  const fetchBooks = async (searchFilters = filters) => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      
      // Build query parameters
      const params = new URLSearchParams();
      
      if (searchFilters.search) params.append('search', searchFilters.search);
      if (searchFilters.genre && searchFilters.genre !== 'all') params.append('genre', searchFilters.genre);
      if (searchFilters.author && searchFilters.author !== 'all') params.append('author', searchFilters.author);
      if (searchFilters.language && searchFilters.language !== 'all') params.append('language', searchFilters.language);
      if (searchFilters.available !== undefined) params.append('available', searchFilters.available);
      if (searchFilters.sortBy) params.append('sortBy', searchFilters.sortBy);
      if (searchFilters.sortOrder) params.append('sortOrder', searchFilters.sortOrder);
      if (searchFilters.page) params.append('page', searchFilters.page);
      if (searchFilters.limit) params.append('limit', searchFilters.limit);

      const response = await api.get(`/api/books?${params}`);

      // Handle both old format (array) and new format (object with books and pagination)
      if (Array.isArray(response.data)) {
        setBooks(response.data);
        setPagination({});
      } else {
        setBooks(response.data.books || []);
        setPagination(response.data.pagination || {});
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to fetch books');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    fetchBooks(filters);
  }, [filters]);

  const requestBook = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/api/requests', {
        bookId
      });
      if (showToast) showToast('Request sent!');
    } catch (err) {
      if (showToast) showToast(err.response?.data?.message || 'Failed to request book');
    }
  };

  const deleteBook = async (bookId) => {
    try {
      await api.delete(`/api/books/${bookId}`);
      if (showToast) showToast('Book deleted successfully');
      // Refresh books list
      fetchBooks(filters);
      // Close modal if it's the deleted book
      if (selectedBook?._id === bookId) {
        handleCloseModal();
      }
    } catch (err) {
      if (showToast) showToast(err.response?.data?.message || 'Failed to delete book');
    }
  };

  const handleAddBook = () => {
    fetchBooks();
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      page: 1 // Reset to first page when searching
    }));
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination.totalPages || 1)) {
      setFilters(prev => ({
        ...prev,
        page: newPage
      }));
    }
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  return (
    <div className="card book-view">
      <div className="book-view-header">
        <div>
      <h2 className="form-title book-view-title">
        {filters.search || filters.genre !== 'all' || filters.author !== 'all' || filters.language !== 'all'
          ? 'Search Results'
          : 'Available Books'}
      </h2>
          <p className="book-view-subtitle">
            Browse the collection, filter by relevance, and open any title for the full record.
          </p>
        </div>
        {pagination.totalBooks !== undefined && (
          <div className="book-results-pill">
            {loading ? 'Searching...' : `${pagination.totalBooks} books`}
          </div>
        )}
      </div>

      {user?.role === 'librarian' && (
        <AddBook onAdd={handleAddBook} showToast={showToast} />
      )}

      {/* Search and Filter Controls */}
      <div className="book-controls">
        <SearchBar
          onSearch={handleSearch}
          value={filters.search}
          placeholder="Search books by title, author, ISBN, or description..."
        />

        <FilterPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
          user={user}
          isExpanded={isFiltersExpanded}
          onToggleExpanded={() => setIsFiltersExpanded(!isFiltersExpanded)}
        />
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Loading State */}
      {loading && (
        <div className="book-loading">
          <div className="book-loading-icon">📚</div>
          <div className="book-loading-title">Loading books...</div>
          <div className="book-loading-copy">Fetching titles and filters from the collection.</div>
        </div>
      )}

      {/* Books Grid */}
      {!loading && (
        <div className="book-grid">
          {books.length === 0 ? (
            <div className="book-empty">
              <div className="book-empty-icon">📖</div>
              <h3 className="book-empty-title">
                {filters.search || filters.genre !== 'all' || filters.author !== 'all' || filters.language !== 'all'
                  ? 'No books match your search'
                  : 'No books available'}
              </h3>
              <p className="book-empty-copy">
                {filters.search || filters.genre !== 'all' || filters.author !== 'all' || filters.language !== 'all'
                  ? 'Try adjusting your search terms or filters'
                  : 'Check back later for new additions'}
              </p>
            </div>
          ) : (
            books.map(book => (
              <BookCard
                key={book._id}
                book={book}
                user={user}
                onRequest={requestBook}
                onBookClick={handleBookClick}
                onDelete={deleteBook}
              />
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="book-pagination">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={!pagination.hasPrevPage}
            className={`book-page-button ${pagination.hasPrevPage ? 'book-page-button-active' : 'book-page-button-disabled'}`}
          >
            ← Previous
          </button>

          <span className="book-page-indicator">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={!pagination.hasNextPage}
            className={`book-page-button ${pagination.hasNextPage ? 'book-page-button-active' : 'book-page-button-disabled'}`}
          >
            Next →
          </button>
        </div>
      )}

      <BookModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={user}
        onRequest={requestBook}
        onDelete={deleteBook}
      />
    </div>
  );
}

export default BookList;
