const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/channels', require('./routes/channels'));
app.use('/api/channels', require('./routes/messages'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ChatterBox API is running' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to ChatterBox API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/me'
      },
      channels: {
        create: 'POST /api/channels',
        listPublic: 'GET /api/channels/public',
        myChannels: 'GET /api/channels/my-channels',
        join: 'POST /api/channels/:id/join',
        leave: 'POST /api/channels/:id/leave',
        details: 'GET /api/channels/:id'
      },
      messages: {
        get: 'GET /api/channels/:id/messages',
        send: 'POST /api/channels/:id/messages'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 ChatterBox server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
});
