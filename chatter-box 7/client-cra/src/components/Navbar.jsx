/**
 * Navigation Bar Component
 * Top navigation with branding and user controls
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <span className="brand-icon">💬</span>
          <span className="brand-text">ChatterBox</span>
        </Link>
      </div>

      <button
        className="mobile-toggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation"
      >
        {mobileMenuOpen ? '✕' : '☰'}
      </button>

      <div className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
        {user ? (
          <>
            <span className="user-greeting">
              Hello, <strong>{user.username}</strong>
            </span>
            <button className="btn-logout" onClick={handleSignOut}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Sign In</Link>
            <Link to="/register" className="nav-link nav-link-primary">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
