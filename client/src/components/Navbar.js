import React from 'react';

function Navbar({ user, currentPage, onLogout, onNav }) {
  const navItems = [
    { key: 'books', label: 'Books', visible: true },
    { key: 'requests', label: 'Requests', visible: user?.role === 'librarian' || user?.role === 'admin' },
    { key: 'overdue', label: 'Due Dates', visible: user?.role === 'librarian' || user?.role === 'admin' },
    { key: 'admin', label: 'Admin Panel', visible: user?.role === 'admin' },
    { key: 'my-books', label: 'My Books', visible: user?.role === 'student' },
  ];

  return (
    <nav className="navbar navbar-shell">
      <div className="navbar-row">
        <div className="navbar-brand">
          <div className="navbar-mark">LM</div>
          <div>
            <div className="navbar-eyebrow">Library dashboard</div>
            <div className="navbar-title">Campus circulation</div>
          </div>
        </div>

        <div className="navbar-tabs">
          {navItems
            .filter(item => item.visible)
            .map(item => {
              const active = currentPage === item.key;
              return (
                <button
                  key={item.key}
                  className={`nav-tab ${active ? 'nav-tab-active' : 'nav-tab-idle'}`}
                  onClick={() => onNav(item.key)}
                >
                  <span className={`nav-tab-dot ${active ? 'nav-tab-dot-active' : 'nav-tab-dot-idle'}`} />
                  {item.label}
                </button>
              );
            })}
        </div>

        <div className="navbar-user">
          <div className="navbar-user-meta">
            <div className="navbar-user-label">Signed in</div>
            <div className="navbar-user-name">{user?.name}</div>
          </div>
          {user && (
            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
