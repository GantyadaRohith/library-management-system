import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RequestCard from './RequestCard';

function RequestQueue({ user, showToast }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/requests', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setRequests(res.data))
      .catch(() => setRequests([]));
  }, []);

  const acceptRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/requests/accept', 
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (showToast) showToast('Request accepted!');
      // Refresh the requests list
      const updatedRes = await axios.get('http://localhost:5000/api/requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(updatedRes.data);
    } catch (err) {
      if (showToast) showToast(err.response?.data?.message || 'Failed to accept request');
    }
  };

  const notifyStudent = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/requests/notify', 
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (showToast) showToast('Email sent!');
    } catch (err) {
      if (showToast) showToast(err.response?.data?.message || 'Failed to send email');
    }
  };

  const returnBook = async (requestId) => {
    try {
      console.log('Attempting to return book with requestId:', requestId);
      const token = localStorage.getItem('token');
      
      if (!token) {
        if (showToast) showToast('Authentication token not found. Please login again.');
        return;
      }
      
      const response = await axios.post('http://localhost:5000/api/requests/return', 
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Return response:', response.data);
      if (showToast) showToast('Book returned successfully!');
      
      // Refresh the requests list
      const updatedRes = await axios.get('http://localhost:5000/api/requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
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
