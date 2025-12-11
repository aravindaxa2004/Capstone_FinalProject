/**
 * Database Configuration Module
 * Handles MongoDB connection setup and management
 */
import mongoose from 'mongoose';

const establishConnection = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default establishConnection;
