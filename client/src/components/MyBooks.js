import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import DueDateInfo from './DueDateInfo';

function MyBooks({ user, showToast }) {
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/requests/my-requests');
      setMyRequests(response.data);
    } catch (err) {
      if (showToast) showToast('Failed to fetch your requests');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '2rem' }}>
          Loading your books...
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="form-title">My Borrowed Books</h2>
      
      <div className="request-queue">
        {myRequests.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '2rem' }}>
            You have no borrowed books
          </p>
        ) : (
          myRequests.map(req => (
            <div key={req._id} className="request-card">
              <div className="request-info">
                <strong>Book:</strong> {req.book?.title || 'N/A'}
              </div>
              <div className="request-info">
                <strong>Author:</strong> {req.book?.author || 'N/A'}
              </div>
              <div className="request-info">
                <strong>Status:</strong> 
                <span className={`status-badge status-${req.status}`} style={{ marginLeft: '0.5rem' }}>
                  {req.status}
                </span>
              </div>
              <div className="request-info">
                <strong>Requested:</strong> {new Date(req.requestedAt).toLocaleDateString()}
              </div>
              
              {/* Due Date Information */}
              {req.status === 'accepted' && req.dueDate && (
                <div className="request-info">
                  <strong>Due Date:</strong>
                  <div style={{ marginTop: '0.5rem' }}>
                    <DueDateInfo request={req} showDetails={true} />
                  </div>
                </div>
              )}
              
              {req.status === 'accepted' && (
                <div style={{ marginTop: '1rem' }}>
                  {req.isOverdue ? (
                    <div className="info-box" style={{ 
                      background: '#FEE2E2', 
                      border: '1px solid #DC2626',
                      color: '#991B1B'
                    }}>
                      <p>
                        ⚠️ <strong>This book is overdue!</strong> Please return it to the library as soon as possible.
                        {req.lateFee > 0 && (
                          <span> You currently owe ${req.lateFee.toFixed(2)} in late fees.</span>
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="info-box">
                      <p>
                        📚 You have this book! Please return it to the library by the due date to avoid late fees.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyBooks;