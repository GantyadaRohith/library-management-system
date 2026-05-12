import React from 'react';
import styles from './DueDateInfo.module.css';

function DueDateInfo({ request, showDetails = false }) {
  if (!request.dueDate) return null;

  const dueDate = new Date(request.dueDate);
  const today = new Date();
  const timeDiff = dueDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDueDateStatus = () => {
    if (request.isOverdue) {
      return {
        type: 'overdue',
        text: `${request.daysOverdue} day${request.daysOverdue !== 1 ? 's' : ''} overdue`,
        icon: '⚠️'
      };
    } else if (daysDiff <= 0) {
      return {
        type: 'due-today',
        text: 'Due today',
        icon: '📅'
      };
    } else if (daysDiff <= 3) {
      return {
        type: 'due-soon',
        text: `Due in ${daysDiff} day${daysDiff !== 1 ? 's' : ''}`,
        icon: '⏰'
      };
    } else {
      return {
        type: 'normal',
        text: `Due in ${daysDiff} days`,
        icon: '📖'
      };
    }
  };

  const status = getDueDateStatus();

  return (
    <div className={styles.dueDateInfo}>
      <div className={`${styles.statusBadge} ${styles[status.type]}`}>
        <span className={styles.icon}>{status.icon}</span>
        <span className={styles.text}>{status.text}</span>
      </div>
      
      {showDetails && (
        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.label}>Due Date:</span>
            <span className={styles.value}>{formatDate(request.dueDate)}</span>
          </div>
          
          {request.acceptedAt && (
            <div className={styles.detailRow}>
              <span className={styles.label}>Borrowed:</span>
              <span className={styles.value}>{formatDate(request.acceptedAt)}</span>
            </div>
          )}
          
          {request.isOverdue && request.lateFee > 0 && (
            <div className={styles.detailRow}>
              <span className={styles.label}>Late Fee:</span>
              <span className={`${styles.value} ${styles.lateFee}`}>
                ₹{Math.round(request.lateFee)}
              </span>
            </div>
          )}
          
          {request.remindersSent && request.remindersSent.length > 0 && (
            <div className={styles.detailRow}>
              <span className={styles.label}>Reminders:</span>
              <span className={styles.value}>
                {request.remindersSent.length} sent
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DueDateInfo;