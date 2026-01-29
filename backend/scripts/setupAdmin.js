const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');
const User = require('../src/models/User');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const setupAdmin = async () => {
  try {
    // 1. Connect to Database
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 2. Define Super Admin Credentials
    const adminData = {
      name: 'Super Admin',
      email: 'admin@elitewear.com', // Professional default email
      password: 'admin123', // Simple default password (user should change later)
      role: 'admin',
      isActive: true,
      phone: '000-000-0000',
    };

    // 3. Check if Admin Exists
    let admin = await User.findOne({ email: adminData.email });

    if (admin) {
      console.log('ℹ️  Admin account already exists.');
      // Optional: Reset password if flag provided, but for now just notify
      admin.role = 'admin'; // Ensure role is correct
      admin.isActive = true;
      await admin.save();
      console.log('   - Role ensured as ADMIN');
    } else {
      // 4. Create Admin
      console.log('🔨 Creating new Super Admin account...');
      admin = await User.create(adminData);
      console.log('✅ Admin account created successfully!');
    }

    // 5. Output Summary
    console.log('\n=============================================');
    console.log('🛡️  ADMIN SETUP COMPLETE');
    console.log('=============================================');
    console.log('📧 Email:    ' + adminData.email);
    console.log('🔑 Password: ' + adminData.password);
    console.log('---------------------------------------------');
    console.log('👉 Login here: http://localhost:3000/login');
    console.log('👉 Dashboard:  http://localhost:3000/admin/dashboard');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Setup Failed:', error.message);
    process.exit(1);
  }
};

setupAdmin();
