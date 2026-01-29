const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const User = require('../src/models/User');

const listUsers = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(mongoURI);

    console.log('--- START USERS ---');
    const users = await User.find({});
    users.forEach((u) => {
      console.log(u.email);
    });
    console.log('--- END USERS ---');

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

listUsers();
