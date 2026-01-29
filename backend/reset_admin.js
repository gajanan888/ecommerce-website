const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./src/models/User'); // Adjust path as needed

dotenv.config({ path: path.join(__dirname, '.env') });

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔌 Connected to DB');

    const email = 'gajananwadksar6@gmail.com';
    const newPassword = 'admin123';

    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ Admin user not found!');
    } else {
      user.password = newPassword;
      // Pre-save hook will hash it
      await user.save();
      console.log(`✅ Password reset successfully for ${email}`);
      console.log(`🔑 New Password: ${newPassword}`);
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

resetAdmin();
