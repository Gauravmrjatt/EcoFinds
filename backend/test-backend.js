const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/.env' });

// Test database connection
const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MongoDB URI:', process.env.MONGO_URI ? 'Configured' : 'Not configured');
    
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ MongoDB Connected successfully');
      
      // Test collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Available collections:', collections.map(c => c.name));
      
      await mongoose.connection.close();
      console.log('✅ Database connection test completed');
    } else {
      console.log('❌ MongoDB URI not configured');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
};

// Test environment variables
const testEnvVars = () => {
  console.log('\n=== Environment Variables ===');
  console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');
  console.log('PORT:', process.env.PORT || 'Not set');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Configured' : 'Not configured');
  console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE || 'Not set');
  console.log('MONGO_URI:', process.env.MONGO_URI ? 'Configured' : 'Not configured');
};

const main = async () => {
  console.log('🧪 EcoFinds Backend Test Suite\n');
  
  testEnvVars();
  console.log('\n=== Database Connection Test ===');
  await testConnection();
  
  console.log('\n✅ All tests completed!');
  process.exit(0);
};

main();
