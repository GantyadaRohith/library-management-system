import React from 'react';

function BookCard({ book, user, onRequest, onBookClick }) {
  const handleCardClick = (e) => {
    // Don't trigger if clicking on the request button
    if (e.target.tagName === 'BUTTON') {
      return;
    }
    if (onBookClick) {
      onBookClick(book);
    }
  };

  return (
    <div className="book-card" onClick={handleCardClick}>
      <h3 className="book-title">{book.title}</h3>
      <p className="book-author">by {book.author}</p>
      
      {book.genre && (
        <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', margin: '0.25rem 0' }}>
          📚 {book.genre}
        </p>
      )}
      
      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          {user?.role === 'student' && book.available && (
            <button 
              className="btn" 
              onClick={(e) => {
                e.stopPropagation();
                onRequest(book._id);
              }}
            >
              Request Book
            </button>
          )}
          
          {!book.available && (
            <span style={{ color: 'var(--error-red)', fontWeight: '600' }}>
              Not Available
            </span>
          )}
        </div>
        
        <span style={{ 
          color: 'var(--gray-400)', 
          fontSize: '0.8rem',
          fontStyle: 'italic'
        }}>
          Click for details
        </span>
      </div>
    </div>
  );
}

export default BookCard;
