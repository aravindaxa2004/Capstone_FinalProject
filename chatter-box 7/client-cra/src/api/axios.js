// This file sets up a reusable Axios instance configured for the API backend

import axios from 'axios';

// Create an Axios instance with the base URL of the API
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust as needed for your backend URL
});

// Attach a request interceptor to include the JWT token automatically in headers
api.interceptors.request.use((config) => {
  // Get the JWT token from localStorage
  const token = localStorage.getItem('token');

  // If token exists, add it as a Bearer token in the Authorization header
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default api;
