/**
 * Main Application Component
 * Handles routing and protected route logic
 */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Channel from './pages/Channel';
import { useAuth } from './context/AuthContext';
import './App.css';

// Component to guard private routes
function PrivateRoute({ children }) {
  const { token } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Component to redirect authenticated users from public routes
function GuestRoute({ children }) {
  const { token } = useAuth();
  
  if (token) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Guest-only routes */}
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/channels/:id"
            element={
              <PrivateRoute>
                <Channel />
              </PrivateRoute>
            }
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
