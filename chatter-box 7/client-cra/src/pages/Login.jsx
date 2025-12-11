/**
 * Login Page Component
 * Handles user authentication
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthForm.css';

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, token } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate('/', { replace: true });
    }
  }, [token, navigate]);

  // Update form fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  // Process login submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/login', credentials);

      if (response.data.success) {
        const { user, token: authToken } = response.data.data;
        login(user, authToken);
        navigate('/', { replace: true });
      } else {
        setErrorMessage(response.data.message || 'Login failed');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Connection error. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-clear error after delay
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleFormSubmit}>
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue to ChatterBox</p>
        </div>

        {errorMessage && (
          <div className="alert alert-error">{errorMessage}</div>
        )}

        <div className="form-field">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            value={credentials.email}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Enter your password"
            value={credentials.password}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        <button type="submit" className="btn-submit" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </div>
  );
}
