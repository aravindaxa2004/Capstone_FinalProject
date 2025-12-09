# ChatHub - Real-Time Chat Application

<div align="center">
  <img src="client/public/favicon.svg" alt="ChatHub Logo" width="80" height="80">
  
  **A modern, full-stack chat application similar to Discord and Slack**
  
  Built with React, Node.js, Express, Socket.io, and SQLite
</div>

---

## ✨ Features

### Core Features
- 🔐 **User Authentication** - Secure JWT-based registration and login
- 💬 **Real-time Messaging** - Instant message delivery via WebSocket
- 📝 **Channels** - Organize conversations by topic
- 👥 **Workspaces** - Create and manage team workspaces
- 🔗 **Invite System** - Share invite codes to add team members
- 💌 **Direct Messages** - Private one-on-one conversations
- ⌨️ **Typing Indicators** - See when others are typing
- 🟢 **User Presence** - Online/offline status indicators

### UI/UX Features
- 🎨 Modern, dark-themed UI inspired by Discord
- 📱 Responsive design for all screen sizes
- ⚡ Smooth animations and transitions
- 🔔 Real-time updates without page refresh

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.io Client** - Real-time communication
- **Zustand** - State management
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **date-fns** - Date formatting

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.io** - WebSocket server
- **better-sqlite3** - SQLite database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd workspace
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```
   
   Or install separately:
   ```bash
   # Root dependencies
   npm install
   
   # Server dependencies
   cd server && npm install
   
   # Client dependencies
   cd ../client && npm install
   ```

3. **Set up environment variables**
   
   The server comes with a default `.env` file. For production, update these values:
   ```env
   PORT=3001
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=http://localhost:5173
   ```

4. **Start the development servers**
   ```bash
   # From the root directory, run both servers
   npm run dev
   ```
   
   Or run them separately:
   ```bash
   # Terminal 1 - Server
   npm run dev:server
   
   # Terminal 2 - Client
   npm run dev:client
   ```

5. **Open the application**
   
   Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
workspace/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── modals/    # Modal dialogs
│   │   │   ├── ChatArea.jsx
│   │   │   ├── MembersSidebar.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── MessageItem.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TypingIndicator.jsx
│   │   │   └── WelcomeScreen.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Chat.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/      # API and Socket services
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── store/         # State management
│   │   │   └── useStore.js
│   │   ├── App.jsx        # Main app component
│   │   ├── index.css      # Global styles
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── middleware/    # Express middleware
│   │   │   └── auth.js
│   │   ├── routes/        # API routes
│   │   │   ├── auth.js
│   │   │   ├── channels.js
│   │   │   ├── messages.js
│   │   │   └── workspaces.js
│   │   ├── database.js    # Database setup
│   │   └── index.js       # Server entry point
│   ├── data/              # SQLite database (created at runtime)
│   ├── .env               # Environment variables
│   └── package.json
│
├── package.json           # Root package.json
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout user |

### Workspaces
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workspaces` | Get user's workspaces |
| POST | `/api/workspaces` | Create workspace |
| POST | `/api/workspaces/join` | Join via invite code |
| GET | `/api/workspaces/:id` | Get workspace details |
| GET | `/api/workspaces/:id/members` | Get workspace members |

### Channels
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/channels/workspace/:id` | Get workspace channels |
| POST | `/api/channels` | Create channel |
| DELETE | `/api/channels/:id` | Delete channel |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/channel/:id` | Get channel messages |
| POST | `/api/messages` | Send message |
| DELETE | `/api/messages/:id` | Delete message |
| GET | `/api/messages/direct/:userId` | Get direct messages |
| POST | `/api/messages/direct` | Send direct message |

---

## 🔄 WebSocket Events

### Client → Server
| Event | Description |
|-------|-------------|
| `workspace:join` | Join workspace room |
| `workspace:leave` | Leave workspace room |
| `channel:join` | Join channel room |
| `channel:leave` | Leave channel room |
| `message:send` | Send message to channel |
| `message:delete` | Delete message |
| `typing:start` | Start typing indicator |
| `typing:stop` | Stop typing indicator |
| `dm:send` | Send direct message |

### Server → Client
| Event | Description |
|-------|-------------|
| `user:status` | User online/offline status |
| `message:new` | New message received |
| `message:deleted` | Message was deleted |
| `typing:start` | User started typing |
| `typing:stop` | User stopped typing |
| `channel:new` | New channel created |
| `dm:new` | New direct message |

---

## 🧪 Demo Credentials

A demo account is created automatically:
- **Email:** demo@chathub.com
- **Password:** demo123

A default workspace "General Workspace" with invite code `WELCOME2024` is also created.

---

## 🎯 Future Enhancements

- [ ] File uploads and image sharing
- [ ] Message reactions (emoji)
- [ ] Message editing
- [ ] Voice/Video calls
- [ ] User profiles and avatars
- [ ] Message search
- [ ] Notifications
- [ ] Thread replies
- [ ] Mobile app (React Native)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

<div align="center">
  <p>Built with ❤️ for your capstone project</p>
</div>
