import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get messages for a channel
router.get('/channel/:channelId', authenticateToken, (req, res) => {
  try {
    const { channelId } = req.params;
    const { limit = 50, before } = req.query;

    const channel = db.prepare('SELECT * FROM channels WHERE id = ?').get(channelId);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    // Check membership
    const membership = db.prepare(`
      SELECT * FROM workspace_members WHERE workspace_id = ? AND user_id = ?
    `).get(channel.workspace_id, req.user.id);

    if (!membership) {
      return res.status(403).json({ error: 'You are not a member of this workspace' });
    }

    let query = `
      SELECT m.*, u.username, u.avatar, u.status as user_status
      FROM messages m
      JOIN users u ON m.user_id = u.id
      WHERE m.channel_id = ?
    `;
    const params = [channelId];

    if (before) {
      query += ' AND m.created_at < ?';
      params.push(before);
    }

    query += ` ORDER BY m.created_at DESC LIMIT ?`;
    params.push(parseInt(limit));

    const messages = db.prepare(query).all(...params);
    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message (REST fallback, primary is via Socket.io)
router.post('/', authenticateToken, (req, res) => {
  try {
    const { channelId, content } = req.body;

    if (!channelId || !content) {
      return res.status(400).json({ error: 'Channel ID and content are required' });
    }

    const channel = db.prepare('SELECT * FROM channels WHERE id = ?').get(channelId);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    // Check membership
    const membership = db.prepare(`
      SELECT * FROM workspace_members WHERE workspace_id = ? AND user_id = ?
    `).get(channel.workspace_id, req.user.id);

    if (!membership) {
      return res.status(403).json({ error: 'You are not a member of this workspace' });
    }

    const messageId = uuidv4();
    const createdAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO messages (id, channel_id, user_id, content, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(messageId, channelId, req.user.id, content, createdAt);

    const message = {
      id: messageId,
      channel_id: channelId,
      user_id: req.user.id,
      content,
      created_at: createdAt,
      username: req.user.username,
      avatar: req.user.avatar,
      user_status: req.user.status
    };

    res.status(201).json({ message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Delete message
router.delete('/:messageId', authenticateToken, (req, res) => {
  try {
    const { messageId } = req.params;

    const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Only message author can delete
    if (message.user_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own messages' });
    }

    db.prepare('DELETE FROM messages WHERE id = ?').run(messageId);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Get direct messages between two users
router.get('/direct/:userId', authenticateToken, (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    const messages = db.prepare(`
      SELECT dm.*, 
        sender.username as sender_username, sender.avatar as sender_avatar,
        receiver.username as receiver_username, receiver.avatar as receiver_avatar
      FROM direct_messages dm
      JOIN users sender ON dm.sender_id = sender.id
      JOIN users receiver ON dm.receiver_id = receiver.id
      WHERE (dm.sender_id = ? AND dm.receiver_id = ?)
        OR (dm.sender_id = ? AND dm.receiver_id = ?)
      ORDER BY dm.created_at DESC
      LIMIT ?
    `).all(req.user.id, userId, userId, req.user.id, parseInt(limit));

    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Error fetching direct messages:', error);
    res.status(500).json({ error: 'Failed to fetch direct messages' });
  }
});

// Send direct message
router.post('/direct', authenticateToken, (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ error: 'Receiver ID and content are required' });
    }

    const receiver = db.prepare('SELECT id, username, avatar FROM users WHERE id = ?').get(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: 'User not found' });
    }

    const messageId = uuidv4();
    const createdAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO direct_messages (id, sender_id, receiver_id, content, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(messageId, req.user.id, receiverId, content, createdAt);

    const message = {
      id: messageId,
      sender_id: req.user.id,
      receiver_id: receiverId,
      content,
      created_at: createdAt,
      sender_username: req.user.username,
      sender_avatar: req.user.avatar,
      receiver_username: receiver.username,
      receiver_avatar: receiver.avatar
    };

    res.status(201).json({ message });
  } catch (error) {
    console.error('Error sending direct message:', error);
    res.status(500).json({ error: 'Failed to send direct message' });
  }
});

export default router;
