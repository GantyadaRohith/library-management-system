// Reset admin password script
require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/library');
    console.log('Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('❌ No admin user found');
      process.exit(1);
    }

    // Reset password to 'admin123'
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    admin.password = hashedPassword;
    await admin.save();
    
    console.log('✅ Admin password reset successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 New Password:', newPassword);
    console.log('🌐 Login at: http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

resetAdminPassword();