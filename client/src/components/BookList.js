
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

      const response = await axios.get(`http://localhost:5000/api/books?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

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
      await axios.post('http://localhost:5000/api/requests', {
        bookId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (showToast) showToast('Request sent!');
    } catch (err) {
      if (showToast) showToast(err.response?.data?.message || 'Failed to request book');
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
    <div className="card">
      <h2 className="form-title">
        {filters.search || filters.genre !== 'all' || filters.author !== 'all' || filters.language !== 'all' 
          ? 'Search Results' 
          : 'Available Books'}
      </h2>
      
      {user?.role === 'librarian' && (
        <AddBook onAdd={handleAddBook} showToast={showToast} />
      )}

      {/* Search and Filter Controls */}
      <div style={{ marginBottom: '1.5rem' }}>
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

      {/* Results Summary */}
      {pagination.totalBooks !== undefined && (
        <div style={{ 
          marginBottom: '1rem', 
          padding: '0.75rem', 
          background: 'var(--gray-50, #F9FAFB)',
          borderRadius: '6px',
          fontSize: '0.875rem',
          color: 'var(--gray-700, #374151)'
        }}>
          {loading ? (
            'Searching...'
          ) : (
            `Found ${pagination.totalBooks} book${pagination.totalBooks !== 1 ? 's' : ''}`
          )}
        </div>
      )}
      
      {/* Loading State */}
      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          color: 'var(--gray-500, #6B7280)'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📚</div>
          Loading books...
        </div>
      )}

      {/* Books Grid */}
      {!loading && (
        <div className="book-grid">
          {books.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: 'var(--gray-500, #6B7280)', 
              padding: '3rem 2rem',
              background: 'var(--gray-50, #F9FAFB)',
              borderRadius: '12px',
              border: '2px dashed var(--border-color, #e1e5e9)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📖</div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--gray-600, #4B5563)' }}>
                {filters.search || filters.genre !== 'all' || filters.author !== 'all' || filters.language !== 'all'
                  ? 'No books match your search'
                  : 'No books available'}
              </h3>
              <p style={{ margin: 0 }}>
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
              />
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '2rem',
          padding: '1rem',
          background: 'var(--gray-50, #F9FAFB)',
          borderRadius: '8px'
        }}>
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={!pagination.hasPrevPage}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid var(--border-color, #e1e5e9)',
              background: pagination.hasPrevPage ? 'white' : 'var(--gray-100, #F3F4F6)',
              color: pagination.hasPrevPage ? 'var(--text-color, #333)' : 'var(--gray-400, #9CA3AF)',
              borderRadius: '6px',
              cursor: pagination.hasPrevPage ? 'pointer' : 'not-allowed'
            }}
          >
            ← Previous
          </button>
          
          <span style={{ 
            fontSize: '0.875rem', 
            color: 'var(--gray-600, #4B5563)',
            minWidth: '120px',
            textAlign: 'center'
          }}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={!pagination.hasNextPage}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid var(--border-color, #e1e5e9)',
              background: pagination.hasNextPage ? 'white' : 'var(--gray-100, #F3F4F6)',
              color: pagination.hasNextPage ? 'var(--text-color, #333)' : 'var(--gray-400, #9CA3AF)',
              borderRadius: '6px',
              cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed'
            }}
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
      />
    </div>
  );
}

export default BookList;
