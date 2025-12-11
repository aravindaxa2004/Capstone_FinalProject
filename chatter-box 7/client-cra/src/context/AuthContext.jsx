import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Safe function to get user from localStorage
  const getUserFromStorage = () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch (err) {
      console.warn('Failed to parse user from localStorage:', err);
      localStorage.removeItem('user'); // remove invalid data
      return null;
    }
  };

  const [user, setUser] = useState(getUserFromStorage());
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Login function saves user and token in state and localStorage
  const login = (userData, jwt) => {
    if (!userData || !jwt) {
      console.warn('login called with invalid user or token:', userData, jwt);
      return;
    }
    setUser(userData);
    setToken(jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', jwt);
  };

  // Logout clears user and token from state and localStorage
  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access auth context easily
export function useAuth() {
  return useContext(AuthContext);
}
