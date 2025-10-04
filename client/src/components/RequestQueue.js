import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import RequestCard from './RequestCard';

function RequestQueue({ user, showToast }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api.get('/api/requests')
      .then(res => setRequests(res.data))
      .catch(() => setRequests([]));
  }, []);

  const acceptRequest = async (requestId) => {
    try {
      await api.post('/api/requests/accept', { requestId });
      if (showToast) showToast('Request accepted!');
      // Refresh the requests list
      const updatedRes = await api.get('/api/requests');
      setRequests(updatedRes.data);
    } catch (err) {
      if (showToast) showToast(err.response?.data?.message || 'Failed to accept request');
    }
  };

  const notifyStudent = async (requestId) => {
    try {
      await api.post('/api/requests/notify', { requestId });
      if (showToast) showToast('Email sent!');
    } catch (err) {
      if (showToast) showToast(err.response?.data?.message || 'Failed to send email');
    }
  };

  const returnBook = async (requestId) => {
    try {
      console.log('Attempting to return book with requestId:', requestId);
      
      const response = await api.post('/api/requests/return', { requestId });
      
      console.log('Return response:', response.data);
      if (showToast) showToast('Book returned successfully!');
      
      // Refresh the requests list
      const updatedRes = await api.get('/api/requests');
      setRequests(updatedRes.data);
    } catch (err) {
      console.error('Return book error:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.message || 'Failed to return book';
      if (showToast) showToast(errorMessage);
    }
  };

  return (
    <div className="card">
      <h2 className="form-title">Request Queue</h2>
      
      <div className="request-queue">
        {requests.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '2rem' }}>
            No pending requests
          </p>
        ) : (
          requests.map(req => (
            <RequestCard 
              key={req._id} 
              req={req} 
              user={user} 
              onAccept={acceptRequest} 
              onNotify={notifyStudent}
              onReturn={returnBook}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default RequestQueue;
