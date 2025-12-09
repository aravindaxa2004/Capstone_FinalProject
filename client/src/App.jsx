import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import useStore from './store/useStore';
import { authApi } from './services/api';
import { connectSocket, disconnectSocket } from './services/socket';

import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';

function ProtectedRoute({ children }) {
  const { isAuthenticated, token } = useStore();
  
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  const { token, isAuthenticated, setUser, logout } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Verify token on app load
    const verifyAuth = async () => {
      if (token) {
        try {
          const { data } = await authApi.me();
          setUser(data.user);
          connectSocket(token);
        } catch (error) {
          console.error('Auth verification failed:', error);
          logout();
          disconnectSocket();
          navigate('/login');
        }
      }
    };

    verifyAuth();

    return () => {
      disconnectSocket();
    };
  }, [token]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-dark-900">
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} 
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
