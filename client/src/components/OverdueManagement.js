import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DueDateInfo from './DueDateInfo';
import styles from './OverdueManagement.module.css';

function OverdueManagement({ user, showToast }) {
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [dueSoonBooks, setDueSoonBooks] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [sendingReminder, setSendingReminder] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [overdueRes, dueSoonRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/requests/overdue', { headers }),
        axios.get('http://localhost:5000/api/requests/due-soon', { headers }),
        axios.get('http://localhost:5000/api/requests/statistics', { headers })
      ]);

      setOverdueBooks(overdueRes.data);
      setDueSoonBooks(dueSoonRes.data);
      setStatistics(statsRes.data);
    } catch (error) {
      console.error('Error fetching overdue data:', error);
      if (showToast) showToast('Failed to fetch overdue information');
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async (requestId, reminderType = 'overdue') => {
    try {
      setSendingReminder(requestId);
      const token = localStorage.getItem('token');
      
      await axios.post('http://localhost:5000/api/requests/send-reminder', {
        requestId,
        reminderType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (showToast) showToast('Reminder sent successfully!');
      
      // Refresh data to update reminder counts
      fetchData();
    } catch (error) {
      console.error('Error sending reminder:', error);
      if (showToast) showToast('Failed to send reminder');
    } finally {
      setSendingReminder(null);
    }
  };

  const updateOverdueStatuses = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/requests/update-overdue', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (showToast) showToast('Overdue statuses updated!');
      fetchData();
    } catch (error) {
      console.error('Error updating overdue statuses:', error);
      if (showToast) showToast('Failed to update overdue statuses');
    }
  };

  const processAllReminders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/requests/process-reminders', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const summary = response.data.summary;
      const totalSent = summary.beforeDue + summary.dueToday + summary.overdue;
      
      if (showToast) {
        showToast(`Sent ${totalSent} reminders (${summary.overdue} overdue, ${summary.dueToday} due today, ${summary.beforeDue} due soon)`);
      }
      
      fetchData();
    } catch (error) {
      console.error('Error processing reminders:', error);
      if (showToast) showToast('Failed to process reminders');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className={styles.loading}>
          <div className={styles.loadingIcon}>📚</div>
          <p>Loading overdue information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="form-title">Due Date Management</h2>

      {/* Statistics Dashboard */}
      <div className={styles.statisticsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{statistics.totalActiveLoans || 0}</div>
          <div className={styles.statLabel}>Active Loans</div>
        </div>
        
        <div className={`${styles.statCard} ${styles.warning}`}>
          <div className={styles.statNumber}>{statistics.overdueBooks || 0}</div>
          <div className={styles.statLabel}>Overdue Books</div>
        </div>
        
        <div className={`${styles.statCard} ${styles.info}`}>
          <div className={styles.statNumber}>{statistics.dueSoon || 0}</div>
          <div className={styles.statLabel}>Due Soon</div>
        </div>
        
        <div className={`${styles.statCard} ${styles.danger}`}>
          <div className={styles.statNumber}>${statistics.totalLateFees || '0.00'}</div>
          <div className={styles.statLabel}>Total Late Fees</div>
        </div>
      </div>

      {/* Management Actions */}
      <div className={styles.actionButtons}>
        <button 
          className="btn btn-secondary" 
          onClick={updateOverdueStatuses}
        >
          🔄 Update Overdue Status
        </button>
        
        <button 
          className="btn" 
          onClick={processAllReminders}
        >
          📧 Send All Reminders
        </button>
      </div>

      {/* Configuration Info */}
      <div className={styles.configInfo}>
        <div className={styles.configItem}>
          <strong>Loan Period:</strong> {statistics.loanPeriodDays || 14} days
        </div>
        <div className={styles.configItem}>
          <strong>Late Fee:</strong> ${statistics.lateFeePerDay || '0.50'}/day (max ${statistics.maxLateFee || '15.00'})
        </div>
      </div>

      {/* Overdue Books */}
      {overdueBooks.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            ⚠️ Overdue Books ({overdueBooks.length})
          </h3>
          
          <div className={styles.bookList}>
            {overdueBooks.map(request => (
              <div key={request._id} className={`${styles.bookItem} ${styles.overdue}`}>
                <div className={styles.bookInfo}>
                  <div className={styles.bookTitle}>
                    📚 {request.book?.title || 'N/A'}
                  </div>
                  <div className={styles.studentName}>
                    👤 {request.student?.name || 'N/A'}
                  </div>
                  <div className={styles.studentEmail}>
                    📧 {request.student?.email || 'N/A'}
                  </div>
                </div>
                
                <div className={styles.dueDateSection}>
                  <DueDateInfo request={request} showDetails={true} />
                </div>
                
                <div className={styles.actions}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => sendReminder(request._id, 'overdue')}
                    disabled={sendingReminder === request._id}
                  >
                    {sendingReminder === request._id ? '📧...' : '📧 Send Reminder'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Books Due Soon */}
      {dueSoonBooks.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            ⏰ Due Soon ({dueSoonBooks.length})
          </h3>
          
          <div className={styles.bookList}>
            {dueSoonBooks.map(request => (
              <div key={request._id} className={`${styles.bookItem} ${styles.dueSoon}`}>
                <div className={styles.bookInfo}>
                  <div className={styles.bookTitle}>
                    📚 {request.book?.title || 'N/A'}
                  </div>
                  <div className={styles.studentName}>
                    👤 {request.student?.name || 'N/A'}
                  </div>
                  <div className={styles.studentEmail}>
                    📧 {request.student?.email || 'N/A'}
                  </div>
                </div>
                
                <div className={styles.dueDateSection}>
                  <DueDateInfo request={request} showDetails={true} />
                </div>
                
                <div className={styles.actions}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => sendReminder(request._id, 'before_due')}
                    disabled={sendingReminder === request._id}
                  >
                    {sendingReminder === request._id ? '📧...' : '📧 Send Reminder'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Issues */}
      {overdueBooks.length === 0 && dueSoonBooks.length === 0 && (
        <div className={styles.noIssues}>
          <div className={styles.noIssuesIcon}>✅</div>
          <h3>All books are on time!</h3>
          <p>No overdue books or urgent due dates to manage.</p>
        </div>
      )}
    </div>
  );
}

export default OverdueManagement;