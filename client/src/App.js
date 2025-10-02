import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Login from './components/Login';
import Register from './components/Register';
import BookList from './components/BookList';
import RequestQueue from './components/RequestQueue';
import MyBooks from './components/MyBooks';
import OverdueManagement from './components/OverdueManagement';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [page, setPage] = useState('books');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
  };

  const handleLogout = () => {
    setUser(null);
    setPage('books');
    localStorage.removeItem('token');
    showToast('Logged out');
  };

  const handleNav = (navPage) => {
    setPage(navPage);
  };

  return (
    <div className="main-layout">
      <Toast message={toast} onClose={() => setToast('')} />
      <h1 className="page-header">Library Management System</h1>
      
      {user && <Navbar user={user} onLogout={handleLogout} onNav={handleNav} />}
      
      {!user ? (
        <div className="content-container">
          {showRegister ? (
            <>
              <Register onRegister={() => setShowRegister(false)} />
              <div className="auth-toggle">
                Already have an account?{' '}
                <button onClick={() => setShowRegister(false)}>
                  Login
                </button>
              </div>
            </>
          ) : (
            <>
              <Login setUser={setUser} />
              <div className="auth-toggle">
                Don't have an account?{' '}
                <button onClick={() => setShowRegister(true)}>
                  Register
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="content-container">
          <div className="welcome-message">
            Welcome, {user.name} ({user.role})
          </div>
          {page === 'books' && <BookList user={user} showToast={showToast} />}
          {(user.role === 'librarian' || user.role === 'admin') && page === 'requests' && <RequestQueue user={user} showToast={showToast} />}
          {(user.role === 'librarian' || user.role === 'admin') && page === 'overdue' && <OverdueManagement user={user} showToast={showToast} />}
          {user.role === 'admin' && page === 'admin' && <AdminDashboard user={user} showToast={showToast} />}
          {user.role === 'student' && page === 'my-books' && <MyBooks user={user} showToast={showToast} />}
        </div>
      )}
    </div>
  );
}

export default App;
