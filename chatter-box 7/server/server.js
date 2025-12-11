/**
 * ChatterBox API Server
 * Main entry point for the Express application
 */
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import route modules
import authenticationRoutes from './routes/auth.js';
import channelRoutes from './routes/channels.js';
import messageRoutes from './routes/messages.js';

// Load environment configuration
dotenv.config();

// Initialize Express application
const application = express();

// Configure middleware
application.use(cors());
application.use(express.json());

// Establish database connection
const initializeDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Database connection established successfully');
  } catch (connectionError) {
    console.error('❌ Database connection failed:', connectionError.message);
    process.exit(1);
  }
};

initializeDatabase();

// Mount API routes
application.use('/api/auth', authenticationRoutes);
application.use('/api/channels', channelRoutes);
application.use('/api/channels', messageRoutes);

// Health check endpoint
application.get('/api/status', (req, res) => {
  res.json({ status: 'operational', timestamp: new Date().toISOString() });
});

// Launch server
const SERVER_PORT = process.env.PORT || 5000;
application.listen(SERVER_PORT, () => {
  console.log(`🚀 ChatterBox API running on port ${SERVER_PORT}`);
});
