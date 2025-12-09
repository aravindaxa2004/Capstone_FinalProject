import { io } from 'socket.io-client';
import useStore from '../store/useStore';

let socket = null;

export const connectSocket = (token) => {
  if (socket?.connected) return socket;

  socket = io('/', {
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('🟢 Connected to server');
  });

  socket.on('disconnect', () => {
    console.log('🔴 Disconnected from server');
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error.message);
  });

  // User status updates
  socket.on('user:status', ({ userId, status }) => {
    useStore.getState().updateMemberStatus(userId, status);
  });

  // New message
  socket.on('message:new', (message) => {
    const { currentChannel } = useStore.getState();
    if (currentChannel && message.channel_id === currentChannel.id) {
      useStore.getState().addMessage(message);
    }
  });

  // Message deleted
  socket.on('message:deleted', ({ messageId }) => {
    useStore.getState().removeMessage(messageId);
  });

  // Typing indicators
  socket.on('typing:start', ({ channelId, userId, username }) => {
    useStore.getState().setTypingUser(channelId, userId, username, true);
  });

  socket.on('typing:stop', ({ channelId, userId }) => {
    useStore.getState().setTypingUser(channelId, userId, '', false);
  });

  // New channel
  socket.on('channel:new', (channel) => {
    useStore.getState().addChannel(channel);
  });

  // Direct messages
  socket.on('dm:new', (message) => {
    const { dmUser } = useStore.getState();
    if (dmUser && (message.sender_id === dmUser.id || message.receiver_id === dmUser.id)) {
      useStore.getState().addDirectMessage(message);
    }
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

// Socket actions
export const joinWorkspace = (workspaceId) => {
  if (socket) {
    socket.emit('workspace:join', workspaceId);
  }
};

export const leaveWorkspace = (workspaceId) => {
  if (socket) {
    socket.emit('workspace:leave', workspaceId);
  }
};

export const joinChannel = (channelId) => {
  if (socket) {
    socket.emit('channel:join', channelId);
  }
};

export const leaveChannel = (channelId) => {
  if (socket) {
    socket.emit('channel:leave', channelId);
  }
};

export const sendMessage = (channelId, content) => {
  if (socket) {
    socket.emit('message:send', { channelId, content });
  }
};

export const deleteMessage = (messageId, channelId) => {
  if (socket) {
    socket.emit('message:delete', { messageId, channelId });
  }
};

export const startTyping = (channelId) => {
  if (socket) {
    socket.emit('typing:start', channelId);
  }
};

export const stopTyping = (channelId) => {
  if (socket) {
    socket.emit('typing:stop', channelId);
  }
};

export const sendDirectMessage = (receiverId, content) => {
  if (socket) {
    socket.emit('dm:send', { receiverId, content });
  }
};

export const broadcastNewChannel = (workspaceId, channel) => {
  if (socket) {
    socket.emit('channel:created', { workspaceId, channel });
  }
};
