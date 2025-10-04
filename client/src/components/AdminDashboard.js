import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [statistics, setStatistics] = useState({});
  const [users, setUsers] = useState([]);
  const [pendingLibrarians, setPendingLibrarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [statsRes, usersRes, pendingRes] = await Promise.all([
        api.get('/api/admin/statistics'),
        api.get('/api/admin/users'),
        api.get('/api/admin/pending-librarians')
      ]);

      setStatistics(statsRes.data);
      setUsers(usersRes.data);
      setPendingLibrarians(pendingRes.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load admin data');
      setLoading(false);
    }
  };

  const handleApproveLibrarian = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/admin/approve-librarian/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchData(); // Refresh data
      alert('Librarian approved successfully!');
    } catch (error) {
      alert('Failed to approve librarian');
    }
  };

  const handleRejectLibrarian = async (userId) => {
    const reason = prompt('Reason for rejection (optional):');
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/admin/reject-librarian/${userId}`, 
        { reason }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchData(); // Refresh data
      alert('Librarian request rejected');
    } catch (error) {
      alert('Failed to reject librarian request');
    }
  };

  const handleChangeUserRole = async (userId, newRole, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/users/${userId}/role`, 
        { role: newRole, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchData(); // Refresh data
      alert('User updated successfully!');
    } catch (error) {
      alert('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user: ${userName}?`)) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        fetchData(); // Refresh data
        alert('User deleted successfully!');
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  if (loading) return <div className={styles.loading}>Loading admin dashboard...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.adminDashboard}>
      <div className={styles.header}>
        <h1>🔧 Admin Dashboard</h1>
        <p>System Administration & User Management</p>
      </div>

      <div className={styles.tabs}>
        <button 
          className={activeTab === 'overview' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={activeTab === 'users' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button 
          className={activeTab === 'pending' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('pending')}
        >
          ⏳ Pending Approvals ({pendingLibrarians.length})
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className={styles.overview}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>👥 Total Users</h3>
              <div className={styles.statNumber}>{statistics.overview?.totalUsers || 0}</div>
            </div>
            <div className={styles.statCard}>
              <h3>📚 Total Books</h3>
              <div className={styles.statNumber}>{statistics.overview?.totalBooks || 0}</div>
            </div>
            <div className={styles.statCard}>
              <h3>📋 Total Requests</h3>
              <div className={styles.statNumber}>{statistics.overview?.totalRequests || 0}</div>
            </div>
            <div className={styles.statCard}>
              <h3>⏳ Pending Librarians</h3>
              <div className={styles.statNumber}>{statistics.overview?.pendingLibrarians || 0}</div>
            </div>
            <div className={styles.statCard}>
              <h3>📖 Active Loans</h3>
              <div className={styles.statNumber}>{statistics.overview?.activeRequests || 0}</div>
            </div>
            <div className={styles.statCard}>
              <h3>⚠️ Overdue Books</h3>
              <div className={styles.statNumber}>{statistics.overview?.overdueRequests || 0}</div>
            </div>
          </div>

          <div className={styles.chartSection}>
            <div className={styles.chartCard}>
              <h3>Users by Role</h3>
              <div className={styles.roleBreakdown}>
                <div>👨‍🎓 Students: {statistics.usersByRole?.student || 0}</div>
                <div>📚 Librarians: {statistics.usersByRole?.librarian || 0}</div>
                <div>🔧 Admins: {statistics.usersByRole?.admin || 0}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className={styles.users}>
          <h2>All Users</h2>
          <div className={styles.userTable}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <select 
                        value={user.role} 
                        onChange={(e) => handleChangeUserRole(user._id, e.target.value, user.status)}
                      >
                        <option value="student">Student</option>
                        <option value="librarian">Librarian</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        value={user.status} 
                        onChange={(e) => handleChangeUserRole(user._id, user.role, e.target.value)}
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>
                    <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
                    <td>
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteUser(user._id, user.name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'pending' && (
        <div className={styles.pending}>
          <h2>Pending Librarian Approvals</h2>
          {pendingLibrarians.length === 0 ? (
            <div className={styles.noPending}>No pending librarian requests</div>
          ) : (
            <div className={styles.pendingList}>
              {pendingLibrarians.map(user => (
                <div key={user._id} className={styles.pendingCard}>
                  <div className={styles.userInfo}>
                    <h3>{user.name}</h3>
                    <p>📧 {user.email}</p>
                    <p>📅 Requested: {new Date(user.createdAt).toLocaleDateString()}</p>
                    <p>🎯 Requesting: <strong>Librarian</strong> role</p>
                  </div>
                  <div className={styles.actions}>
                    <button 
                      className={styles.approveBtn}
                      onClick={() => handleApproveLibrarian(user._id)}
                    >
                      ✅ Approve
                    </button>
                    <button 
                      className={styles.rejectBtn}
                      onClick={() => handleRejectLibrarian(user._id)}
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;