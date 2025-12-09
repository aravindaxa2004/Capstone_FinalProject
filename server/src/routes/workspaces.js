import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get user's workspaces
router.get('/', authenticateToken, (req, res) => {
  try {
    const workspaces = db.prepare(`
      SELECT w.*, wm.role as user_role
      FROM workspaces w
      JOIN workspace_members wm ON w.id = wm.workspace_id
      WHERE wm.user_id = ?
      ORDER BY w.created_at DESC
    `).all(req.user.id);

    res.json({ workspaces });
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    res.status(500).json({ error: 'Failed to fetch workspaces' });
  }
});

// Create workspace
router.post('/', authenticateToken, (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Workspace name is required' });
    }

    const workspaceId = uuidv4();
    const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    db.prepare(`
      INSERT INTO workspaces (id, name, description, owner_id, invite_code)
      VALUES (?, ?, ?, ?, ?)
    `).run(workspaceId, name, description || '', req.user.id, inviteCode);

    // Add creator as admin
    db.prepare(`
      INSERT INTO workspace_members (id, workspace_id, user_id, role)
      VALUES (?, ?, ?, ?)
    `).run(uuidv4(), workspaceId, req.user.id, 'admin');

    // Create default general channel
    const channelId = uuidv4();
    db.prepare(`
      INSERT INTO channels (id, workspace_id, name, description)
      VALUES (?, ?, ?, ?)
    `).run(channelId, workspaceId, 'general', 'General discussion');

    const workspace = db.prepare('SELECT * FROM workspaces WHERE id = ?').get(workspaceId);
    res.status(201).json({ workspace, defaultChannelId: channelId });
  } catch (error) {
    console.error('Error creating workspace:', error);
    res.status(500).json({ error: 'Failed to create workspace' });
  }
});

// Join workspace by invite code
router.post('/join', authenticateToken, (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({ error: 'Invite code is required' });
    }

    const workspace = db.prepare('SELECT * FROM workspaces WHERE invite_code = ?').get(inviteCode);
    if (!workspace) {
      return res.status(404).json({ error: 'Invalid invite code' });
    }

    // Check if already a member
    const existingMember = db.prepare(`
      SELECT id FROM workspace_members WHERE workspace_id = ? AND user_id = ?
    `).get(workspace.id, req.user.id);

    if (existingMember) {
      return res.status(400).json({ error: 'You are already a member of this workspace' });
    }

    db.prepare(`
      INSERT INTO workspace_members (id, workspace_id, user_id, role)
      VALUES (?, ?, ?, ?)
    `).run(uuidv4(), workspace.id, req.user.id, 'member');

    res.json({ workspace });
  } catch (error) {
    console.error('Error joining workspace:', error);
    res.status(500).json({ error: 'Failed to join workspace' });
  }
});

// Get workspace details
router.get('/:workspaceId', authenticateToken, (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Check membership
    const membership = db.prepare(`
      SELECT * FROM workspace_members WHERE workspace_id = ? AND user_id = ?
    `).get(workspaceId, req.user.id);

    if (!membership) {
      return res.status(403).json({ error: 'You are not a member of this workspace' });
    }

    const workspace = db.prepare('SELECT * FROM workspaces WHERE id = ?').get(workspaceId);
    const members = db.prepare(`
      SELECT u.id, u.username, u.email, u.avatar, u.status, wm.role
      FROM users u
      JOIN workspace_members wm ON u.id = wm.user_id
      WHERE wm.workspace_id = ?
    `).all(workspaceId);

    res.json({ workspace, members, userRole: membership.role });
  } catch (error) {
    console.error('Error fetching workspace:', error);
    res.status(500).json({ error: 'Failed to fetch workspace' });
  }
});

// Get workspace members
router.get('/:workspaceId/members', authenticateToken, (req, res) => {
  try {
    const { workspaceId } = req.params;

    const members = db.prepare(`
      SELECT u.id, u.username, u.email, u.avatar, u.status, wm.role
      FROM users u
      JOIN workspace_members wm ON u.id = wm.user_id
      WHERE wm.workspace_id = ?
      ORDER BY wm.role DESC, u.username ASC
    `).all(workspaceId);

    res.json({ members });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

export default router;
