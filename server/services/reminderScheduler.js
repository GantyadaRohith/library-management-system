const cron = require('node-cron');
const dueDateService = require('./dueDateService');

/**
 * Initialize the reminder scheduling system
 * This will run the reminder process daily at 9:00 AM
 */
const initializeReminderScheduler = () => {
  // Run daily at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily due date reminder process...');
    
    try {
      const summary = await dueDateService.processAllReminders();
      
      console.log('Daily reminder process completed:');
      console.log(`- Before due reminders sent: ${summary.beforeDue}`);
      console.log(`- Due today reminders sent: ${summary.dueToday}`);
      console.log(`- Overdue reminders sent: ${summary.overdue}`);
      
      if (summary.errors.length > 0) {
        console.error('Errors during reminder process:');
        summary.errors.forEach(error => console.error(`  - ${error}`));
      }
    } catch (error) {
      console.error('Failed to run daily reminder process:', error);
    }
  });

  // Also run overdue status updates every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    console.log('Updating overdue statuses...');
    
    try {
      const updatedRequests = await dueDateService.updateAllOverdueStatuses();
      console.log(`Updated overdue status for ${updatedRequests.length} requests`);
    } catch (error) {
      console.error('Failed to update overdue statuses:', error);
    }
  });

  console.log('📅 Due date reminder scheduler initialized');
  console.log('  - Daily reminders: 9:00 AM');
  console.log('  - Status updates: Every 6 hours');
};

/**
 * Run reminder process immediately (for testing)
 */
const runRemindersNow = async () => {
  console.log('Running reminder process immediately...');
  
  try {
    const summary = await dueDateService.processAllReminders();
    
    console.log('Immediate reminder process completed:');
    console.log(`- Before due reminders sent: ${summary.beforeDue}`);
    console.log(`- Due today reminders sent: ${summary.dueToday}`);
    console.log(`- Overdue reminders sent: ${summary.overdue}`);
    
    if (summary.errors.length > 0) {
      console.error('Errors during reminder process:');
      summary.errors.forEach(error => console.error(`  - ${error}`));
    }
    
    return summary;
  } catch (error) {
    console.error('Failed to run immediate reminder process:', error);
    throw error;
  }
};

/**
 * Stop all scheduled tasks (for testing or shutdown)
 */
const stopScheduler = () => {
  cron.getTasks().forEach(task => task.destroy());
  console.log('📅 Due date reminder scheduler stopped');
};

module.exports = {
  initializeReminderScheduler,
  runRemindersNow,
  stopScheduler
};