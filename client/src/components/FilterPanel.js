import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './FilterPanel.module.css';

function FilterPanel({ 
  filters, 
  onFiltersChange, 
  user, 
  isExpanded, 
  onToggleExpanded 
}) {
  const [filterOptions, setFilterOptions] = useState({
    genres: [],
    authors: [],
    languages: [],
    publishers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/books/filters/options', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFilterOptions(response.data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value
    });
  };

  const handleSortChange = (field, order) => {
    onFiltersChange({
      ...filters,
      sortBy: field,
      sortOrder: order
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      genre: 'all',
      author: 'all',
      language: 'all',
      available: undefined,
      sortBy: 'addedAt',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = () => {
    return filters.search || 
           (filters.genre && filters.genre !== 'all') ||
           (filters.author && filters.author !== 'all') ||
           (filters.language && filters.language !== 'all') ||
           filters.available !== undefined;
  };

  if (loading) {
    return (
      <div className={styles.filterPanel}>
        <div className={styles.filterHeader}>
          <button 
            className={styles.toggleButton}
            onClick={onToggleExpanded}
          >
            🔽 Filters & Sort
          </button>
        </div>
        <div className={styles.loading}>Loading filters...</div>
      </div>
    );
  }

  return (
    <div className={styles.filterPanel}>
      <div className={styles.filterHeader}>
        <button 
          className={`${styles.toggleButton} ${isExpanded ? styles.expanded : ''}`}
          onClick={onToggleExpanded}
        >
          {isExpanded ? '🔼' : '🔽'} Filters & Sort
        </button>
        {hasActiveFilters() && (
          <button 
            className={styles.clearButton}
            onClick={clearAllFilters}
            title="Clear all filters"
          >
            Clear All
          </button>
        )}
      </div>

      {isExpanded && (
        <div className={styles.filterContent}>
          {/* Filter Controls */}
          <div className={styles.filterSection}>
            <h4 className={styles.sectionTitle}>Filters</h4>
            <div className={styles.filterGrid}>
              {/* Genre Filter */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Genre</label>
                <select
                  className={styles.filterSelect}
                  value={filters.genre || 'all'}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                >
                  <option value="all">All Genres</option>
                  {filterOptions.genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              {/* Author Filter */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Author</label>
                <select
                  className={styles.filterSelect}
                  value={filters.author || 'all'}
                  onChange={(e) => handleFilterChange('author', e.target.value)}
                >
                  <option value="all">All Authors</option>
                  {filterOptions.authors.map(author => (
                    <option key={author} value={author}>{author}</option>
                  ))}
                </select>
              </div>

              {/* Language Filter */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Language</label>
                <select
                  className={styles.filterSelect}
                  value={filters.language || 'all'}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                >
                  <option value="all">All Languages</option>
                  {filterOptions.languages.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>

              {/* Availability Filter (Librarians only) */}
              {user?.role === 'librarian' && (
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Availability</label>
                  <select
                    className={styles.filterSelect}
                    value={filters.available === undefined ? 'all' : filters.available}
                    onChange={(e) => {
                      const value = e.target.value === 'all' ? undefined : e.target.value === 'true';
                      handleFilterChange('available', value);
                    }}
                  >
                    <option value="all">All Books</option>
                    <option value="true">Available Only</option>
                    <option value="false">Borrowed Only</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Sort Controls */}
          <div className={styles.filterSection}>
            <h4 className={styles.sectionTitle}>Sort By</h4>
            <div className={styles.sortControls}>
              <div className={styles.sortGroup}>
                <label className={styles.filterLabel}>Field</label>
                <select
                  className={styles.filterSelect}
                  value={filters.sortBy || 'addedAt'}
                  onChange={(e) => handleSortChange(e.target.value, filters.sortOrder || 'desc')}
                >
                  <option value="addedAt">Date Added</option>
                  <option value="title">Title</option>
                  <option value="author">Author</option>
                  <option value="publishedYear">Year Published</option>
                  <option value="pages">Page Count</option>
                </select>
              </div>
              <div className={styles.sortGroup}>
                <label className={styles.filterLabel}>Order</label>
                <select
                  className={styles.filterSelect}
                  value={filters.sortOrder || 'desc'}
                  onChange={(e) => handleSortChange(filters.sortBy || 'addedAt', e.target.value)}
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterPanel;