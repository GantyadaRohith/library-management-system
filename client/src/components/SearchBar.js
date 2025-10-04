import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import styles from './SearchBar.module.css';

function SearchBar({ onSearch, value, placeholder = "Search books by title, author, ISBN..." }) {
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeout = useRef(null);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.get(`/api/books/search/suggestions?q=${encodeURIComponent(query)}`);
      setSuggestions(response.data);
      setShowSuggestions(response.data.length > 0);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear existing timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Debounce search and suggestions
    searchTimeout.current = setTimeout(() => {
      onSearch(value);
      fetchSuggestions(value);
    }, 300);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.text);
    setShowSuggestions(false);
    onSearch(suggestion.text);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleBlur = (e) => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false);
      }
    }, 150);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowSuggestions(false);
    setSuggestions([]);
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInputWrapper}>
        <div className={styles.searchIcon}>
          🔍
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => {
            if (suggestions.length > 0 && searchTerm.length >= 2) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          className={styles.searchInput}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className={styles.clearButton}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        {isLoading && (
          <div className={styles.loadingSpinner}>
            ⟳
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div ref={suggestionsRef} className={styles.suggestionsDropdown}>
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.text}-${index}`}
              className={styles.suggestionItem}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseDown={(e) => e.preventDefault()} // Prevent blur
            >
              <span className={styles.suggestionText}>
                {suggestion.text}
              </span>
              <span className={styles.suggestionType}>
                {suggestion.type === 'title' ? '📖' : '👤'}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;