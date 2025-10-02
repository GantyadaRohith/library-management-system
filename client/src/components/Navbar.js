import React from 'react';

function Navbar({ user, onLogout, onNav }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <button className="nav-link" onClick={() => onNav('books')}>
          Books
        </button>
        {(user?.role === 'librarian' || user?.role === 'admin') && (
          <>
            <button className="nav-link" onClick={() => onNav('requests')}>
              Requests
            </button>
            <button className="nav-link" onClick={() => onNav('overdue')}>
              Due Dates
            </button>
          </>
        )}
        {user?.role === 'admin' && (
          <button className="nav-link" onClick={() => onNav('admin')}>
            🔧 Admin Panel
          </button>
        )}
        {user?.role === 'student' && (
          <button className="nav-link" onClick={() => onNav('my-books')}>
            My Books
          </button>
        )}
        <div style={{ flex: 1 }}></div>
        {user && (
          <button className="nav-link" onClick={onLogout} style={{ textDecoration: 'underline' }}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
