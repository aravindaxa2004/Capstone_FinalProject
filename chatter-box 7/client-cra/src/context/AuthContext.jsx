/**
 * Authentication Context
 * Manages user authentication state across the application
 */
import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize user state from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (parseError) {
      console.warn('Failed to parse stored user data');
      localStorage.removeItem('user');
      return null;
    }
  });
  
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || '';
  });

  // Handle user login
  const login = useCallback((userData, authToken) => {
    if (!userData || !authToken) {
      console.error('Invalid login credentials provided');
      return false;
    }
    
    setCurrentUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
    return true;
  }, []);

  // Handle user logout
  const logout = useCallback(() => {
    setCurrentUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const contextValue = {
    user: currentUser,
    token,
    login,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for accessing auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
}
