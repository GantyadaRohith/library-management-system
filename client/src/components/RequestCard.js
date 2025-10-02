import React from 'react';
import DueDateInfo from './DueDateInfo';

function RequestCard({ req, user, onAccept, onNotify, onReturn }) {
  return (
    <div className="request-card">
      <div className="request-info">
        <strong>Book:</strong> {req.book?.title || 'N/A'}
      </div>
      <div className="request-info">
        <strong>Student:</strong> {req.student?.name || 'N/A'}
      </div>
      <div className="request-info">
        <strong>Status:</strong> 
        <span className={`status-badge status-${req.status}`} style={{ marginLeft: '0.5rem' }}>
          {req.status}
        </span>
      </div>
      
      {/* Due Date Information */}
      {req.status === 'accepted' && req.dueDate && (
        <div className="request-info">
          <strong>Due Date:</strong>
          <div style={{ marginTop: '0.5rem' }}>
            <DueDateInfo request={req} showDetails={false} />
          </div>
        </div>
      )}
      
      {user?.role === 'librarian' && req.status === 'pending' && (
        <button className="btn btn-success" onClick={() => onAccept(req._id)}>
          Accept Request
        </button>
      )}
      
      {user?.role === 'librarian' && req.status === 'accepted' && (
        <div className="button-group">
          <button className="btn btn-secondary" onClick={() => onNotify(req._id)}>
            Send Reminder
          </button>
          <button 
            className="btn" 
            onClick={() => {
              console.log('Return button clicked for request:', req._id);
              if (onReturn) {
                onReturn(req._id);
              } else {
                console.error('onReturn function is not defined');
              }
            }}
          >
            Mark as Returned
          </button>
        </div>
      )}
    </div>
  );
}

export default RequestCard;
