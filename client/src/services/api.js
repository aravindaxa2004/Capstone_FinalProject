import axios from 'axios';
import useStore from '../store/useStore';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = useStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      useStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Workspaces API
export const workspacesApi = {
  getAll: () => api.get('/workspaces'),
  getOne: (id) => api.get(`/workspaces/${id}`),
  create: (data) => api.post('/workspaces', data),
  join: (inviteCode) => api.post('/workspaces/join', { inviteCode }),
  getMembers: (id) => api.get(`/workspaces/${id}/members`),
};

// Channels API
export const channelsApi = {
  getByWorkspace: (workspaceId) => api.get(`/channels/workspace/${workspaceId}`),
  getOne: (id) => api.get(`/channels/${id}`),
  create: (data) => api.post('/channels', data),
  delete: (id) => api.delete(`/channels/${id}`),
};

// Messages API
export const messagesApi = {
  getByChannel: (channelId, params) => api.get(`/messages/channel/${channelId}`, { params }),
  send: (data) => api.post('/messages', data),
  delete: (id) => api.delete(`/messages/${id}`),
  getDirect: (userId, params) => api.get(`/messages/direct/${userId}`, { params }),
  sendDirect: (data) => api.post('/messages/direct', data),
};

export default api;
