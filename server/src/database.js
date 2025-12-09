import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync, existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure data directory exists
const dataDir = join(__dirname, '../data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const db = new Database(join(__dirname, '../data/chathub.db'));

// Enable foreign keys
db.pragma('journal_mode = WAL');

// Initialize database schema
export function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT,
      status TEXT DEFAULT 'offline',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Workspaces table
  db.exec(`
    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      owner_id TEXT NOT NULL,
      invite_code TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    )
  `);

  // Workspace members
  db.exec(`
    CREATE TABLE IF NOT EXISTS workspace_members (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      role TEXT DEFAULT 'member',
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(workspace_id, user_id)
    )
  `);

  // Channels table
  db.exec(`
    CREATE TABLE IF NOT EXISTS channels (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      is_private INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
    )
  `);

  // Messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      channel_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Direct messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS direct_messages (
      id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create default workspace and channel for demo
  const existingWorkspace = db.prepare('SELECT id FROM workspaces WHERE name = ?').get('General Workspace');
  if (!existingWorkspace) {
    const workspaceId = uuidv4();
    const channelId = uuidv4();
    const demoUserId = uuidv4();
    const hashedPassword = bcrypt.hashSync('demo123', 10);

    // Create demo user
    db.prepare(`
      INSERT INTO users (id, username, email, password, avatar, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(demoUserId, 'DemoUser', 'demo@chathub.com', hashedPassword, null, 'offline');

    // Create default workspace
    db.prepare(`
      INSERT INTO workspaces (id, name, description, owner_id, invite_code)
      VALUES (?, ?, ?, ?, ?)
    `).run(workspaceId, 'General Workspace', 'Welcome to ChatHub! This is the default workspace.', demoUserId, 'WELCOME2024');

    // Add demo user to workspace
    db.prepare(`
      INSERT INTO workspace_members (id, workspace_id, user_id, role)
      VALUES (?, ?, ?, ?)
    `).run(uuidv4(), workspaceId, demoUserId, 'admin');

    // Create general channel
    db.prepare(`
      INSERT INTO channels (id, workspace_id, name, description)
      VALUES (?, ?, ?, ?)
    `).run(channelId, workspaceId, 'general', 'General discussion channel');

    // Create a welcome message
    db.prepare(`
      INSERT INTO messages (id, channel_id, user_id, content)
      VALUES (?, ?, ?, ?)
    `).run(uuidv4(), channelId, demoUserId, 'Welcome to ChatHub! 🎉 Start chatting and enjoy real-time messaging!');

    console.log('✅ Default workspace and channel created');
  }

  console.log('✅ Database initialized successfully');
}

export default db;
