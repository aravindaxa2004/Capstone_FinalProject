import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  // Form state for email and password, and error message state
  const [form, setForm] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      nav('/', { replace: true });
    }
  }, [nav]);

  // Update form state on input change
  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle form submission: authenticate and redirect on success
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);

      if (res.data.success) {
        // Access user and token from data
        const { user, token } = res.data.data;
        login(user, token);
        nav('/', { replace: true });
      } else {
        // Backend returned success: false
        setErrorMsg(res.data.message || 'Login failed');
      }
    } catch (err) {
      // Network or server error
      setErrorMsg(err.response?.data?.message || 'Server error');
    }
  };


  // Clear error message after 5 seconds
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  return (
    <form className="auth-form" onSubmit={submit}>
      <h2>Login</h2>
      {errorMsg && <div className="error-message">{errorMsg}</div>}
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        value={form.email}
        onChange={handle}
      />
      <input
        name="password"
        type="password"
        required
        placeholder="Password"
        value={form.password}
        onChange={handle}
      />
      <button type="submit">Login</button>
    </form>
  );
}
