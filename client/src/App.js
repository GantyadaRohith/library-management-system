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
      <header className="app-hero">
        <div>
          <span className="hero-eyebrow">Campus Library Ops</span>
          <h1 className="hero-title">Library Management System</h1>
          <p className="hero-copy">
            A focused workspace for students, librarians, and admins to browse books, manage requests,
            and keep circulation moving.
          </p>
        </div>
        <div className="hero-metric">
          <span className="hero-metric-label">Workspace</span>
          <div className="hero-metric-value">Local-first, Tailwind-powered UI</div>
        </div>
      </header>

      {user && <Navbar user={user} currentPage={page} onLogout={handleLogout} onNav={handleNav} />}

      <main className="page-shell">
        {!user ? (
          <div className="auth-grid">
            <section className="promo-panel">
              <div>
                <p className="hero-eyebrow">Better reading workflow</p>
                <h2 className="promo-title">A calmer interface for the whole library.</h2>
                <p className="section-subtitle">
                  Designed to feel closer to a modern product than a form stack, with clear hierarchy,
                  softer surfaces, and faster navigation.
                </p>
              </div>
              <div className="promo-list">
                <div className="promo-item">
                  <span className="promo-dot" />
                  <div>
                    <span className="promo-item-title">Fast book browsing</span>
                    <span className="promo-item-copy">Search, filter, and inspect books without losing context.</span>
                  </div>
                </div>
                <div className="promo-item">
                  <span className="promo-dot" />
                  <div>
                    <span className="promo-item-title">Clear circulation signals</span>
                    <span className="promo-item-copy">See available, overdue, and pending items at a glance.</span>
                  </div>
                </div>
                <div className="promo-item">
                  <span className="promo-dot" />
                  <div>
                    <span className="promo-item-title">Role-aware actions</span>
                    <span className="promo-item-copy">Student and librarian views stay aligned to their tasks.</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="auth-panel">
              {showRegister ? (
                <>
                  <Register onRegister={() => setShowRegister(false)} />
                  <div className="auth-toggle">
                    Already have an account?{' '}
                    <button onClick={() => setShowRegister(false)}>Login</button>
                  </div>
                </>
              ) : (
                <>
                  <Login setUser={setUser} />
                  <div className="auth-toggle">
                    Don't have an account?{' '}
                    <button onClick={() => setShowRegister(true)}>Register</button>
                  </div>
                </>
              )}
            </section>
          </div>
        ) : (
          <div className="dashboard-panel">
            <div className="dashboard-topbar">
              <div>
                <div className="dashboard-badge">Signed in as {user.role}</div>
                <div className="welcome-message" style={{ color: '#0f172a', margin: '0.8rem 0 0' }}>
                  Welcome back, {user.name}
                </div>
              </div>
            </div>

            {page === 'books' && <BookList user={user} showToast={showToast} />}
            {(user.role === 'librarian' || user.role === 'admin') && page === 'requests' && <RequestQueue user={user} showToast={showToast} />}
            {(user.role === 'librarian' || user.role === 'admin') && page === 'overdue' && <OverdueManagement user={user} showToast={showToast} />}
            {user.role === 'admin' && page === 'admin' && <AdminDashboard user={user} showToast={showToast} />}
            {user.role === 'student' && page === 'my-books' && <MyBooks user={user} showToast={showToast} />}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
