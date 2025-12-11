# ChatterBox – Learner’s Guide

A step‑by‑step roadmap for building a team‑chat app with MERN (MongoDB, Express, React, Node) and JWT auth.

---

## 📋 Project Overview

- **Goal:** Build a Slack‑style app where users sign up/in, create or join channels, and exchange messages.
- **Tech Stack:**  
  - **Backend:** Node.js, Express, MongoDB (Mongoose), JWT  
  - **Frontend:** React, Axios, React Router  
  - **Auth:** JSON Web Tokens stored in `localStorage`  
  - **Testing:** Postman for API routes  

---

## 🔧 1. Set Up Your Workspace

1. Create a root folder `chatterbox/`
2. Inside, make two subfolders:  
   - `server/` (backend)  
   - `client/` (frontend)

---

## 🛠 2. Backend (server/)

1. **Initialize**  
   - `npm init -y`  
   - Install: `express mongoose dotenv cors bcryptjs jsonwebtoken nodemon`

2. **Structure**  
   - `models/` → User, Channel, Message schemas  
   - `controllers/` → auth, channel, message logic  
   - `routes/` → auth.js, channels.js, messages.js  
   - `middleware/` → JWT validation  
   - `server.js` → wire up Express, connect MongoDB, mount routes  
   - `.env` → MONGO_URI, JWT_SECRET, PORT

3. **Implement Features**  
   - **Auth:** register & login → issue JWT  
   - **Channels:** create, list public, subscribe/unsubscrib, details  
   - **Messages:** fetch history, post new  

4. **Run & Verify**  
   - `npm run dev` (with nodemon)  
   - Use Postman to hit each route, storing the JWT for protected endpoints.

---

## 🌐 3. Frontend (client/)

1. **Initialize**  
   - `npx create-react-app .`  
   - Install: `axios react-router-dom`

2. **Structure**  
   - `src/api/axios.js` → base Axios + JWT interceptor  
   - `src/context/AuthContext.jsx` → user & token state  
   - `src/components/` → Navbar, ChannelList, MessageList, SendMessageForm  
   - `src/pages/` → Register, Login, Home (channels), Channel (chat view)  
   - `App.jsx` & `index.js` → Router + Context + Protected routes

3. **Implement UI Flows**  
   - **Register/Login** → call backend, save token+user  
   - **Home** → list/create channels  
   - **Channel view** → poll messages, send new

4. **Run**  
   - `npm start` → React on http://localhost:3000  
   - Ensure it talks to your backend at port 5000

---

## 🗒️ 4. Testing with Postman

1. Create an environment with variables:  
   - `baseUrl` = `http://localhost:5000/api`  
   - `jwtToken` (empty)

2. **Auth**  
   - POST `/auth/register` → create user  
   - POST `/auth/login` → grab token (save to `jwtToken`)

3. **Protected**  
   - Set “Bearer {{jwtToken}}” in Auth tab  
   - Test `/channels`, `/channels/public`, `/channels/:id/join`, `/channels/:id`, `/channels/:id/messages`

---

## 🗒️ 5. Learner Checklist

- [ ] Folder layout (`server/`, `client/`)  
- [ ] Backend models, routes & controllers  
- [ ] JWT middleware & protected routes  
- [ ] Frontend context, routing & components  
- [ ] Axios setup with token header  
- [ ] Postman flow for all endpoints  
- [ ] Polling or refresh for new messages  

Start each section, build one feature at a time, and verify before moving on. Happy coding!!!!!!!!!!!!!
