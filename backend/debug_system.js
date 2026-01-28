const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });

const checkSystem = async () => {
    try {
        console.log('🔍 Checking System Health...');
        console.log(`🔌 Connecting to MongoDB: ${process.env.MONGODB_URI}...`);

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected!');

        // Check Users
        const User = require('./src/models/User');
        const userCount = await User.countDocuments();
        console.log(`👤 Users in DB: ${userCount}`);
        if (userCount > 0) {
            const sampleUser = await User.findOne();
            console.log(`   Sample User: ${sampleUser.email} (Role: ${sampleUser.role})`);
        }

        // Check Products
        const Product = require('./src/models/Product');
        const productCount = await Product.countDocuments();
        console.log(`📦 Products in DB: ${productCount}`);

        if (productCount === 0) {
            console.log('⚠️ WARNING: No products found! This is why "I cannot see products".');
        }

        mongoose.disconnect();
    } catch (error) {
        console.error('❌ System Check Failed:', error);
    }
};

checkSystem();
