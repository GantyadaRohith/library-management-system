import React from 'react';

function BookCard({ book, user, onRequest, onBookClick, onDelete }) {
  const handleCardClick = (e) => {
    // Don't trigger if clicking on the request button or delete button
    if (e.target.tagName === 'BUTTON') {
      return;
    }
    if (onBookClick) {
      onBookClick(book);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      onDelete(book._id);
    }
  };

  return (
    <div
      className="book-card"
      onClick={handleCardClick}
    >
      <div className="book-card-accent" />
      <div className="book-card-inner">
        <div className="book-card-head">
          <div className="book-card-copy">
            <h3 className="book-title">{book.title}</h3>
            <p className="book-author">by {book.author}</p>
          </div>
          <span className={`book-status ${book.available ? 'book-status-available' : 'book-status-unavailable'}`}>
            {book.available ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <div className="book-chip-row">
          {book.genre && (
            <span className="book-chip book-chip-soft">
              {book.genre}
            </span>
          )}
          {book.language && (
            <span className="book-chip book-chip-ink">
              {book.language}
            </span>
          )}
          {book.pages && (
            <span className="book-chip book-chip-violet">
              {book.pages} pages
            </span>
          )}
        </div>

        <p className="book-description">
          {book.description || 'A searchable library title with full details available in the modal view.'}
        </p>

        <div className="book-card-footer">
          <div className="book-card-hint">
            <span className="book-card-dot" />
            Click for details
          </div>

          <div className="book-card-actions">
          {user?.role === 'student' && book.available && (
            <button
              className="request-button"
              onClick={(e) => {
                e.stopPropagation();
                onRequest(book._id);
              }}
            >
              Request Book
            </button>
          )}

          {(user?.role === 'librarian' || user?.role === 'admin') && (
            <button
              className="btn btn-danger"
              onClick={handleDelete}
              style={{ fontSize: '0.9rem', padding: '0.6rem 1rem' }}
            >
              Delete
            </button>
          )}

          {!book.available && !user?.role && (
            <span className="book-status book-status-unavailable">
              Not Available
            </span>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
