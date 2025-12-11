import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/AuthForm.css';

export default function Register() {
  // Form state for username, email, and password
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const nav = useNavigate();

  // Update form state on input change
  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle form submission: send data to register endpoint and navigate to login
  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/auth/register', form);

      // Backend sends: { success: true, message: "...", data: {...} }
      alert(res.data.message || "Registered successfully");
      nav('/login');
    } catch (err) {
      // Backend sends: { success: false, message: "..." }
      const errorMessage = err.response?.data?.message || "Registration failed";
      alert(errorMessage);

      setForm({
        username: "",
        email: "",
        password: ""
      });
    }
  };

  return (
    <form className="auth-form" onSubmit={submit}>
      <h2>Register</h2>
      <input
        name="username"
        required
        placeholder="Username"
        value={form.username}
        onChange={handle}
      />
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
      <button type="submit">Register</button>
    </form>
  );
}
