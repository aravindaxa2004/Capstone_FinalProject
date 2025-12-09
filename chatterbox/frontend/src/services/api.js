import axios from 'axios';

const API_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me')
};

// Channels API
export const channelsAPI = {
  create: (channelData) => api.post('/channels', channelData),
  getPublic: () => api.get('/channels/public'),
  getMyChannels: () => api.get('/channels/my-channels'),
  getById: (id) => api.get(`/channels/${id}`),
  join: (id) => api.post(`/channels/${id}/join`),
  leave: (id) => api.post(`/channels/${id}/leave`)
};

// Messages API
export const messagesAPI = {
  getByChannel: (channelId, params = {}) => 
    api.get(`/channels/${channelId}/messages`, { params }),
  send: (channelId, content) => 
    api.post(`/channels/${channelId}/messages`, { content })
};

export default api;
