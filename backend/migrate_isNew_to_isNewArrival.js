require('dotenv').config();
const mongoose = require('mongoose');

const migrateProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('products');

    // Check if there are any products with the old field
    const count = await collection.countDocuments({ isNew: { $exists: true } });
    console.log(`Found ${count} products with 'isNew' field.`);

    if (count > 0) {
      console.log('Starting migration...');

      // Update all documents: set isNewArrival to value of isNew, and unset isNew
      const result = await collection.updateMany({ isNew: { $exists: true } }, [
        { $set: { isNewArrival: '$isNew' } },
        { $unset: ['isNew'] },
      ]);

      console.log(
        `Migration complete. Modified ${result.modifiedCount} documents.`
      );
    } else {
      console.log('No migration needed.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateProducts();
