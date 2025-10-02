import React from 'react';

function BookModal({ book, isOpen, onClose, user, onRequest }) {
  if (!isOpen || !book) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{book.title}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="modal-body">
          <div className="book-details">
            <div className="detail-row">
              <span className="detail-label">Author:</span>
              <span className="detail-value">{book.author}</span>
            </div>
            
            {book.description && (
              <div className="detail-row">
                <span className="detail-label">Description:</span>
                <span className="detail-value">{book.description}</span>
              </div>
            )}
            
            {book.genre && (
              <div className="detail-row">
                <span className="detail-label">Genre:</span>
                <span className="detail-value">{book.genre}</span>
              </div>
            )}
            
            {book.publishedYear && (
              <div className="detail-row">
                <span className="detail-label">Published:</span>
                <span className="detail-value">{book.publishedYear}</span>
              </div>
            )}
            
            {book.pages && (
              <div className="detail-row">
                <span className="detail-label">Pages:</span>
                <span className="detail-value">{book.pages}</span>
              </div>
            )}
            
            {book.publisher && (
              <div className="detail-row">
                <span className="detail-label">Publisher:</span>
                <span className="detail-value">{book.publisher}</span>
              </div>
            )}
            
            {book.isbn && (
              <div className="detail-row">
                <span className="detail-label">ISBN:</span>
                <span className="detail-value">{book.isbn}</span>
              </div>
            )}
            
            <div className="detail-row">
              <span className="detail-label">Language:</span>
              <span className="detail-value">{book.language || 'English'}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className={`status-badge ${book.available ? 'status-available' : 'status-unavailable'}`}>
                {book.available ? 'Available' : 'Not Available'}
              </span>
            </div>
            
            {book.addedAt && (
              <div className="detail-row">
                <span className="detail-label">Added:</span>
                <span className="detail-value">
                  {new Date(book.addedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="modal-footer">
          {user?.role === 'student' && book.available && (
            <button 
              className="btn" 
              onClick={() => {
                onRequest(book._id);
                onClose();
              }}
            >
              Request This Book
            </button>
          )}
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookModal;