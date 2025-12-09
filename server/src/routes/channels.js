import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get channels for a workspace
router.get('/workspace/:workspaceId', authenticateToken, (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Check membership
    const membership = db.prepare(`
      SELECT * FROM workspace_members WHERE workspace_id = ? AND user_id = ?
    `).get(workspaceId, req.user.id);

    if (!membership) {
      return res.status(403).json({ error: 'You are not a member of this workspace' });
    }

    const channels = db.prepare(`
      SELECT * FROM channels WHERE workspace_id = ?
      ORDER BY created_at ASC
    `).all(workspaceId);

    res.json({ channels });
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

// Create channel
router.post('/', authenticateToken, (req, res) => {
  try {
    const { workspaceId, name, description, isPrivate } = req.body;

    if (!workspaceId || !name) {
      return res.status(400).json({ error: 'Workspace ID and channel name are required' });
    }

    // Check membership and role
    const membership = db.prepare(`
      SELECT * FROM workspace_members WHERE workspace_id = ? AND user_id = ?
    `).get(workspaceId, req.user.id);

    if (!membership) {
      return res.status(403).json({ error: 'You are not a member of this workspace' });
    }

    // Check if channel name already exists in workspace
    const existingChannel = db.prepare(`
      SELECT id FROM channels WHERE workspace_id = ? AND name = ?
    `).get(workspaceId, name.toLowerCase().replace(/\s+/g, '-'));

    if (existingChannel) {
      return res.status(400).json({ error: 'A channel with this name already exists' });
    }

    const channelId = uuidv4();
    const channelName = name.toLowerCase().replace(/\s+/g, '-');

    db.prepare(`
      INSERT INTO channels (id, workspace_id, name, description, is_private)
      VALUES (?, ?, ?, ?, ?)
    `).run(channelId, workspaceId, channelName, description || '', isPrivate ? 1 : 0);

    const channel = db.prepare('SELECT * FROM channels WHERE id = ?').get(channelId);
    res.status(201).json({ channel });
  } catch (error) {
    console.error('Error creating channel:', error);
    res.status(500).json({ error: 'Failed to create channel' });
  }
});

// Get channel details
router.get('/:channelId', authenticateToken, (req, res) => {
  try {
    const { channelId } = req.params;

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

    res.json({ channel });
  } catch (error) {
    console.error('Error fetching channel:', error);
    res.status(500).json({ error: 'Failed to fetch channel' });
  }
});

// Delete channel
router.delete('/:channelId', authenticateToken, (req, res) => {
  try {
    const { channelId } = req.params;

    const channel = db.prepare('SELECT * FROM channels WHERE id = ?').get(channelId);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    // Check if user is admin
    const membership = db.prepare(`
      SELECT * FROM workspace_members WHERE workspace_id = ? AND user_id = ?
    `).get(channel.workspace_id, req.user.id);

    if (!membership || membership.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete channels' });
    }

    db.prepare('DELETE FROM channels WHERE id = ?').run(channelId);
    res.json({ message: 'Channel deleted successfully' });
  } catch (error) {
    console.error('Error deleting channel:', error);
    res.status(500).json({ error: 'Failed to delete channel' });
  }
});

export default router;
