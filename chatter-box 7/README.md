# ChatterBox – Team Communication Platform

A full-stack chat application built with the MERN stack (MongoDB, Express, React, Node.js) featuring JWT authentication.

---

## 📋 Project Overview

ChatterBox is a Slack-style application where users can:
- Create accounts and authenticate securely
- Create and join public channels
- Exchange messages in real-time

### Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Node.js, Express, MongoDB (Mongoose) |
| **Frontend** | React, Axios, React Router |
| **Authentication** | JWT tokens with bcrypt password hashing |
| **Styling** | Custom CSS with modern design |

---

## 🗂 Project Structure

```
chatter-box 7/
├── server/                 # Backend API
│   ├── config/
│   │   └── db.js          # Database connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── channelController.js
│   │   └── messageController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Channel.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── channels.js
│   │   └── messages.js
│   ├── package.json
│   └── server.js
│
├── client-cra/             # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── ChannelList.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── SendMessageForm.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Channel.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── styles/
│   │   │   ├── AuthForm.css
│   │   │   ├── Channel.css
│   │   │   ├── Components.css
│   │   │   └── Navbar.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:
```
MONGO_URI=mongodb://localhost:27017/chatterbox
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
PORT=5000
```

Start the server:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd client-cra
npm install
npm start
```

The app will open at `http://localhost:3000`

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Authenticate user |

### Channels
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/channels` | Create channel |
| GET | `/api/channels/public` | List all channels |
| GET | `/api/channels/:id` | Get channel details |
| POST | `/api/channels/:id/subscription` | Subscribe to channel |
| DELETE | `/api/channels/:id/subscription` | Unsubscribe from channel |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/channels/:id/messages` | Get channel messages |
| POST | `/api/channels/:id/messages` | Send message |

---

## ✅ Features Checklist

- [x] User registration with password hashing
- [x] JWT-based authentication
- [x] Protected API routes
- [x] Channel creation and listing
- [x] Subscribe/unsubscribe from channels
- [x] Message posting and retrieval
- [x] Auto-refresh messages (polling)
- [x] Responsive UI design

---

## 🎨 Design

The application features a modern teal/emerald color scheme with:
- Dark theme for reduced eye strain
- Responsive layout for all devices
- Smooth animations and transitions
- Clean, intuitive interface

---

## 📝 License

Educational project for learning full-stack development.
