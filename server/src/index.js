import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

import db, { initializeDatabase } from './database.js';
import { authenticateSocket } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import workspaceRoutes from './routes/workspaces.js';
import channelRoutes from './routes/channels.js';
import messageRoutes from './routes/messages.js';

// Load environment variables
dotenv.config();

// Initialize database
initializeDatabase();

const app = express();
const server = createServer(app);

// Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Track online users
const onlineUsers = new Map();
const userSockets = new Map();
const typingUsers = new Map();

// Socket.io authentication middleware
io.use(authenticateSocket);

// Socket.io connection handling
io.on('connection', (socket) => {
  const user = socket.user;
  console.log(`🟢 User connected: ${user.username} (${user.id})`);

  // Store socket reference
  userSockets.set(user.id, socket.id);
  onlineUsers.set(user.id, {
    ...user,
    socketId: socket.id
  });

  // Update user status in database
  db.prepare('UPDATE users SET status = ? WHERE id = ?').run('online', user.id);

  // Broadcast user online status
  io.emit('user:status', { userId: user.id, status: 'online' });

  // Join workspace rooms
  socket.on('workspace:join', (workspaceId) => {
    socket.join(`workspace:${workspaceId}`);
    console.log(`${user.username} joined workspace: ${workspaceId}`);
  });

  // Leave workspace rooms
  socket.on('workspace:leave', (workspaceId) => {
    socket.leave(`workspace:${workspaceId}`);
    console.log(`${user.username} left workspace: ${workspaceId}`);
  });

  // Join channel room
  socket.on('channel:join', (channelId) => {
    socket.join(`channel:${channelId}`);
    console.log(`${user.username} joined channel: ${channelId}`);
  });

  // Leave channel room
  socket.on('channel:leave', (channelId) => {
    socket.leave(`channel:${channelId}`);
    // Clear typing status when leaving
    const key = `${channelId}:${user.id}`;
    typingUsers.delete(key);
    io.to(`channel:${channelId}`).emit('typing:stop', { channelId, userId: user.id });
    console.log(`${user.username} left channel: ${channelId}`);
  });

  // Handle new message
  socket.on('message:send', (data) => {
    const { channelId, content } = data;

    if (!channelId || !content) {
      socket.emit('error', { message: 'Channel ID and content are required' });
      return;
    }

    const messageId = uuidv4();
    const createdAt = new Date().toISOString();

    try {
      db.prepare(`
        INSERT INTO messages (id, channel_id, user_id, content, created_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(messageId, channelId, user.id, content, createdAt);

      const message = {
        id: messageId,
        channel_id: channelId,
        user_id: user.id,
        content,
        created_at: createdAt,
        username: user.username,
        avatar: user.avatar,
        user_status: user.status
      };

      // Broadcast to channel
      io.to(`channel:${channelId}`).emit('message:new', message);

      // Clear typing indicator
      const key = `${channelId}:${user.id}`;
      typingUsers.delete(key);
      io.to(`channel:${channelId}`).emit('typing:stop', { channelId, userId: user.id });
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle message deletion
  socket.on('message:delete', (data) => {
    const { messageId, channelId } = data;

    const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(messageId);
    if (!message || message.user_id !== user.id) {
      socket.emit('error', { message: 'Cannot delete this message' });
      return;
    }

    db.prepare('DELETE FROM messages WHERE id = ?').run(messageId);
    io.to(`channel:${channelId}`).emit('message:deleted', { messageId, channelId });
  });

  // Handle typing indicator
  socket.on('typing:start', (channelId) => {
    const key = `${channelId}:${user.id}`;
    typingUsers.set(key, { userId: user.id, username: user.username, channelId });
    socket.to(`channel:${channelId}`).emit('typing:start', {
      channelId,
      userId: user.id,
      username: user.username
    });
  });

  socket.on('typing:stop', (channelId) => {
    const key = `${channelId}:${user.id}`;
    typingUsers.delete(key);
    socket.to(`channel:${channelId}`).emit('typing:stop', { channelId, userId: user.id });
  });

  // Handle direct messages
  socket.on('dm:send', (data) => {
    const { receiverId, content } = data;

    if (!receiverId || !content) {
      socket.emit('error', { message: 'Receiver ID and content are required' });
      return;
    }

    const messageId = uuidv4();
    const createdAt = new Date().toISOString();

    try {
      const receiver = db.prepare('SELECT id, username, avatar FROM users WHERE id = ?').get(receiverId);
      if (!receiver) {
        socket.emit('error', { message: 'User not found' });
        return;
      }

      db.prepare(`
        INSERT INTO direct_messages (id, sender_id, receiver_id, content, created_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(messageId, user.id, receiverId, content, createdAt);

      const message = {
        id: messageId,
        sender_id: user.id,
        receiver_id: receiverId,
        content,
        created_at: createdAt,
        sender_username: user.username,
        sender_avatar: user.avatar,
        receiver_username: receiver.username,
        receiver_avatar: receiver.avatar
      };

      // Send to sender
      socket.emit('dm:new', message);

      // Send to receiver if online
      const receiverSocketId = userSockets.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('dm:new', message);
      }
    } catch (error) {
      console.error('Error sending DM:', error);
      socket.emit('error', { message: 'Failed to send direct message' });
    }
  });

  // Handle channel creation (broadcast to workspace)
  socket.on('channel:created', (data) => {
    const { workspaceId, channel } = data;
    io.to(`workspace:${workspaceId}`).emit('channel:new', channel);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`🔴 User disconnected: ${user.username} (${user.id})`);

    // Clean up
    userSockets.delete(user.id);
    onlineUsers.delete(user.id);

    // Update user status
    db.prepare('UPDATE users SET status = ? WHERE id = ?').run('offline', user.id);

    // Broadcast user offline status
    io.emit('user:status', { userId: user.id, status: 'offline' });

    // Clear all typing indicators for this user
    typingUsers.forEach((value, key) => {
      if (key.endsWith(`:${user.id}`)) {
        typingUsers.delete(key);
        io.to(`channel:${value.channelId}`).emit('typing:stop', {
          channelId: value.channelId,
          userId: user.id
        });
      }
    });
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`
🚀 ChatHub Server running on port ${PORT}
📡 Socket.io enabled
🗄️  Database initialized
  `);
});
