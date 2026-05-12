import React from 'react';

function BookModal({ book, isOpen, onClose, user, onRequest, onDelete }) {
  if (!isOpen || !book) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      onDelete(book._id);
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content modal-content-book">
        <div className="modal-header modal-header-book">
          <div>
            <div className="modal-kicker">Book details</div>
            <h2 className="modal-title modal-title-book">{book.title}</h2>
          </div>
          <button className="modal-close modal-close-book" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-body modal-body-book">
          <div className="book-details book-details-book">
            <div className="detail-row detail-row-book">
              <span className="detail-label detail-label-book">Author</span>
              <span className="detail-value detail-value-book">{book.author}</span>
            </div>

            {book.description && (
              <div className="detail-row detail-row-book detail-row-stack">
                <span className="detail-label detail-label-book">Description</span>
                <span className="detail-value detail-value-book">{book.description}</span>
              </div>
            )}

            {book.genre && (
              <div className="detail-row detail-row-book">
                <span className="detail-label detail-label-book">Genre</span>
                <span className="detail-value detail-value-book">{book.genre}</span>
              </div>
            )}

            {book.publishedYear && (
              <div className="detail-row detail-row-book">
                <span className="detail-label detail-label-book">Published</span>
                <span className="detail-value detail-value-book">{book.publishedYear}</span>
              </div>
            )}

            {book.pages && (
              <div className="detail-row detail-row-book">
                <span className="detail-label detail-label-book">Pages</span>
                <span className="detail-value detail-value-book">{book.pages}</span>
              </div>
            )}

            {book.publisher && (
              <div className="detail-row detail-row-book">
                <span className="detail-label detail-label-book">Publisher</span>
                <span className="detail-value detail-value-book">{book.publisher}</span>
              </div>
            )}

            {book.isbn && (
              <div className="detail-row detail-row-book">
                <span className="detail-label detail-label-book">ISBN</span>
                <span className="detail-value detail-value-book">{book.isbn}</span>
              </div>
            )}

            <div className="detail-row detail-row-book">
              <span className="detail-label detail-label-book">Language</span>
              <span className="detail-value detail-value-book">{book.language || 'English'}</span>
            </div>

            <div className="detail-row detail-row-book detail-row-status">
              <span className="detail-label detail-label-book">Status</span>
              <div>
                <span className={`status-badge status-pill ${book.available ? 'status-pill-available' : 'status-pill-unavailable'}`}>
                  {book.available ? 'Available' : 'Not Available'}
                </span>
              </div>
            </div>

            {book.addedAt && (
              <div className="detail-row detail-row-book">
                <span className="detail-label detail-label-book">Added</span>
                <span className="detail-value detail-value-book">{new Date(book.addedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer modal-footer-book">
          {user?.role === 'student' && book.available && (
            <button
              className="request-button request-button-modal"
              onClick={() => {
                onRequest(book._id);
                onClose();
              }}
            >
              Request This Book
            </button>
          )}
          {(user?.role === 'librarian' || user?.role === 'admin') && (
            <button
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete Book
            </button>
          )}
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookModal;