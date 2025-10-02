// Script to create the first admin account
require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createAdminAccount = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/library');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('❌ Admin account already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Create admin account
    const adminEmail = 'admin@library.com';
    const adminPassword = 'admin123'; // Change this to a secure password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = new User({
      name: 'System Administrator',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      status: 'active',
      createdAt: new Date()
    });

    await adminUser.save();
    
    console.log('✅ Admin account created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('⚠️  Please change the password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating admin account:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdminAccount();