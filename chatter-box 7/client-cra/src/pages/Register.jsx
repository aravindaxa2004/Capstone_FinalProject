/**
 * Registration Page Component
 * Handles new user account creation
 */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axios';
import '../styles/AuthForm.css';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // Update form fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Process registration
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    // Basic validation
    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.post('/auth/register', formData);

      if (response.data.success) {
        alert('Account created! Please sign in.');
        navigate('/login');
      } else {
        setErrorMessage(response.data.message || 'Registration failed');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleFormSubmit}>
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join ChatterBox and start collaborating</p>
        </div>

        {errorMessage && (
          <div className="alert alert-error">{errorMessage}</div>
        )}

        <div className="form-field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleInputChange}
            disabled={isLoading}
            minLength={3}
          />
        </div>

        <div className="form-field">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            value={formData.email}
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
            placeholder="Minimum 6 characters"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
            minLength={6}
          />
        </div>

        <button type="submit" className="btn-submit" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
