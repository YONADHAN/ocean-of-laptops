const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,           // Handles new MongoDB connection string format
      useUnifiedTopology: true,        // Handles monitoring engine for better connections
    });
    console.log('MongoDB Database is connected...');
  } catch (error) {
    console.error('DB connection error:', error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
