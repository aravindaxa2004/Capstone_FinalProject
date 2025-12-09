# ChatterBox - Team Chat Application

ChatterBox is a full-stack web application similar to Slack or Discord. It allows teams or groups to communicate through channels, supporting real-time messaging with a modern, responsive user interface.

![ChatterBox](https://via.placeholder.com/800x400?text=ChatterBox+Team+Chat)

## Features

### User Authentication
- ✅ User registration with email, username, and password
- ✅ Secure login with JWT tokens
- ✅ Password hashing using bcrypt
- ✅ Protected routes requiring authentication
- ✅ Persistent login using localStorage

### Channel Management
- ✅ Create public channels with name and description
- ✅ Browse all available channels
- ✅ Join and leave channels
- ✅ View channel members
- ✅ Channel creator tracking

### Messaging
- ✅ Send messages in joined channels
- ✅ Real-time message updates (auto-refresh)
- ✅ Message grouping by date
- ✅ Sender information with timestamps
- ✅ Message persistence in database

### User Interface
- ✅ Modern, Discord-like dark theme
- ✅ Responsive design for all screen sizes
- ✅ Intuitive sidebar navigation
- ✅ Clean message display with avatars
- ✅ Modal for channel creation

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Routing | React Router DOM |
| HTTP Client | Axios |
| Backend | Express.js + Node.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT (jsonwebtoken) |
| Security | bcryptjs |
| Styling | CSS (custom) |

---

## Project Structure

```
chatterbox/
├── backend/                    # Express.js backend
│   ├── config/
│   │   └── db.js              # MongoDB connection setup
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── User.js            # User schema (username, email, password, joinedChannels)
│   │   ├── Channel.js         # Channel schema (name, description, members, createdBy)
│   │   └── Message.js         # Message schema (content, sender, channelId, timestamp)
│   ├── routes/
│   │   ├── auth.js            # Authentication routes (register, login, profile)
│   │   ├── channels.js        # Channel routes (CRUD, join, leave)
│   │   └── messages.js        # Message routes (get, send)
│   ├── .env                   # Environment variables (not committed)
│   ├── .env.example           # Environment template
│   ├── .gitignore
│   ├── package.json
│   └── server.js              # Express app entry point
│
├── frontend/                   # React frontend
│   ├── public/
│   │   └── vite.svg           # App icon
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ChannelView.jsx      # Channel messages view
│   │   │   ├── ChannelView.css
│   │   │   ├── CreateChannelModal.jsx   # Modal for creating channels
│   │   │   ├── CreateChannelModal.css
│   │   │   ├── MessageInput.jsx     # Message input form
│   │   │   ├── MessageInput.css
│   │   │   ├── MessageList.jsx      # Messages display
│   │   │   ├── MessageList.css
│   │   │   ├── Sidebar.jsx          # Channel sidebar navigation
│   │   │   └── Sidebar.css
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Authentication state management
│   │   ├── pages/
│   │   │   ├── Auth.css             # Shared auth styles
│   │   │   ├── Chat.jsx             # Main chat page
│   │   │   ├── Chat.css
│   │   │   ├── Login.jsx            # Login page
│   │   │   └── Register.jsx         # Registration page
│   │   ├── services/
│   │   │   └── api.js               # Axios API configuration
│   │   ├── App.jsx                  # Main app with routing
│   │   ├── App.css
│   │   ├── index.css                # Global styles
│   │   └── main.jsx                 # React entry point
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md                  # This file
```

---

## API Endpoints

### Authentication

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user profile | Yes |

### Channels

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| POST | `/api/channels` | Create a new channel | Yes |
| GET | `/api/channels/public` | List all public channels | Yes |
| GET | `/api/channels/my-channels` | Get user's joined channels | Yes |
| GET | `/api/channels/:id` | Get channel details | Yes |
| POST | `/api/channels/:id/join` | Join a channel | Yes |
| POST | `/api/channels/:id/leave` | Leave a channel | Yes |

### Messages

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| GET | `/api/channels/:id/messages` | Get messages in channel | Yes (member) |
| POST | `/api/channels/:id/messages` | Send message in channel | Yes (member) |

---

## Setup Instructions

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas cloud)

### 1. Clone the Repository

```bash
cd chatterbox
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your settings:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: A secure random string
# - PORT: Server port (default: 5000)
```

**Environment Variables (.env):**
```
MONGODB_URI=mongodb://localhost:27017/chatterbox
JWT_SECRET=your_secure_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

### 3. Frontend Setup

```bash
# Navigate to frontend folder (from project root)
cd frontend

# Install dependencies
npm install
```

### 4. Start MongoDB

If using local MongoDB:
```bash
# Start MongoDB service
mongod
```

Or use MongoDB Atlas (cloud) - update MONGODB_URI in .env

### 5. Run the Application

**Start Backend (from /backend folder):**
```bash
npm run dev    # Development with auto-reload
# or
npm start      # Production
```
The API will be available at `http://localhost:5000`

**Start Frontend (from /frontend folder):**
```bash
npm run dev
```
The app will be available at `http://localhost:3000`

---

## Usage Guide

### 1. Register an Account
- Navigate to `http://localhost:3000`
- Click "Register" and create an account with username, email, and password

### 2. Login
- Use your email and password to log in
- JWT token is stored in localStorage for persistent sessions

### 3. Create a Channel
- Click "Create Channel" button in sidebar
- Enter a channel name (lowercase, no spaces)
- Optionally add a description
- You automatically join channels you create

### 4. Join Channels
- Switch to "Browse All" tab in sidebar
- Click "Join" button on any channel
- You can now send and receive messages in that channel

### 5. Send Messages
- Select a joined channel from sidebar
- Type your message in the input at the bottom
- Press Enter to send (Shift+Enter for new line)

### 6. Leave Channels
- Click the leave button in channel header
- Or hover over "Joined" badge in browse view

---

## MongoDB Schemas

### User Schema
```javascript
{
  username: String,      // Required, unique, 3-30 chars
  email: String,         // Required, unique, valid email
  password: String,      // Required, min 6 chars (hashed with bcrypt)
  joinedChannels: [ObjectId]  // References to Channel documents
}
```

### Channel Schema
```javascript
{
  name: String,          // Required, 2-50 chars
  description: String,   // Optional, max 500 chars
  members: [ObjectId],   // References to User documents
  createdBy: ObjectId    // Reference to User who created channel
}
```

### Message Schema
```javascript
{
  content: String,       // Required, max 2000 chars
  sender: ObjectId,      // Reference to User who sent message
  channelId: ObjectId,   // Reference to Channel
  timestamp: Date        // When message was sent
}
```

---

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt before storage
2. **JWT Authentication**: Secure token-based authentication
3. **Protected Routes**: API endpoints require valid JWT token
4. **Input Validation**: Server-side validation for all inputs
5. **Member Verification**: Only channel members can send/view messages

---

## Folder Organization for Submission

When submitting as a ZIP file, organize your project as follows:

```
ChatterBox-Project.zip
└── chatterbox/
    ├── backend/           # All backend files
    │   ├── config/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   ├── .env.example
    │   ├── package.json
    │   └── server.js
    │
    ├── frontend/          # All frontend files
    │   ├── public/
    │   ├── src/
    │   ├── index.html
    │   ├── package.json
    │   └── vite.config.js
    │
    └── README.md          # This documentation
```

**Important Notes for Submission:**
- Do NOT include `node_modules/` folders (they will be recreated with `npm install`)
- Do NOT include the actual `.env` file (include `.env.example` instead)
- Do NOT include `dist/` folder from frontend build

---

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file
   - For Atlas, ensure IP is whitelisted

2. **CORS Errors**
   - Backend CORS is configured for localhost:3000 and localhost:5173
   - Update CORS origins in server.js if using different ports

3. **JWT Errors**
   - Ensure JWT_SECRET is set in .env
   - Clear localStorage and login again if token is invalid

4. **Port Already in Use**
   - Change PORT in .env for backend
   - Change port in vite.config.js for frontend

---

## Future Enhancements

- [ ] Real-time messaging with WebSockets (Socket.io)
- [ ] Direct messages between users
- [ ] File attachments
- [ ] Message editing and deletion
- [ ] User profile customization
- [ ] Channel moderation features
- [ ] Search functionality
- [ ] Message reactions

---

## License

This project is created for educational purposes.

---

## Author

ChatterBox - A Slack/Discord Clone

Built with ❤️ using React, Express, and MongoDB
