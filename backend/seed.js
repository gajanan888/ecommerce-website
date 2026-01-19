const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./src/models/Product');
const products = require('./data/products');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoURI =
      process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Delete existing products
    const deletedCount = await Product.deleteMany({});
    console.log(`🗑️  Deleted ${deletedCount.deletedCount} existing products`);

    // Insert new products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Successfully inserted ${createdProducts.length} products`);

    // Display summary
    console.log('\n📊 Product Summary:');
    const categories = {};
    createdProducts.forEach((product) => {
      categories[product.category] = (categories[product.category] || 0) + 1;
    });

    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   • ${category}: ${count} products`);
    });

    // Display price range
    const prices = createdProducts.map((p) => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    console.log(`\n💰 Price Range: ₹${minPrice} - ₹${maxPrice}`);

    console.log('\n✨ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
