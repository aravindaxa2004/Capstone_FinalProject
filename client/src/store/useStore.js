import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      // Auth state
      user: null,
      token: null,
      isAuthenticated: false,

      // Workspace state
      workspaces: [],
      currentWorkspace: null,

      // Channel state
      channels: [],
      currentChannel: null,

      // Members state
      members: [],
      onlineUsers: new Set(),

      // Messages state
      messages: [],
      typingUsers: {},

      // Direct messages state
      dmUser: null,
      directMessages: [],

      // UI state
      sidebarOpen: true,
      membersOpen: true,

      // Auth actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        workspaces: [],
        currentWorkspace: null,
        channels: [],
        currentChannel: null,
        members: [],
        messages: [],
        directMessages: [],
        dmUser: null,
      }),

      // Workspace actions
      setWorkspaces: (workspaces) => set({ workspaces }),
      setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
      addWorkspace: (workspace) => set((state) => ({
        workspaces: [...state.workspaces, workspace]
      })),

      // Channel actions
      setChannels: (channels) => set({ channels }),
      setCurrentChannel: (channel) => set({ currentChannel: channel, dmUser: null }),
      addChannel: (channel) => set((state) => ({
        channels: [...state.channels, channel]
      })),

      // Members actions
      setMembers: (members) => set({ members }),
      updateMemberStatus: (userId, status) => set((state) => ({
        members: state.members.map((m) =>
          m.id === userId ? { ...m, status } : m
        ),
        onlineUsers: status === 'online'
          ? new Set([...state.onlineUsers, userId])
          : new Set([...state.onlineUsers].filter(id => id !== userId))
      })),

      // Messages actions
      setMessages: (messages) => set({ messages }),
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
      })),
      removeMessage: (messageId) => set((state) => ({
        messages: state.messages.filter((m) => m.id !== messageId)
      })),

      // Typing actions
      setTypingUser: (channelId, userId, username, isTyping) => set((state) => {
        const channelTyping = state.typingUsers[channelId] || {};
        if (isTyping) {
          return {
            typingUsers: {
              ...state.typingUsers,
              [channelId]: { ...channelTyping, [userId]: username }
            }
          };
        } else {
          // eslint-disable-next-line no-unused-vars
          const { [userId]: _, ...rest } = channelTyping;
          return {
            typingUsers: {
              ...state.typingUsers,
              [channelId]: rest
            }
          };
        }
      }),

      // Direct messages actions
      setDmUser: (user) => set({ dmUser: user, currentChannel: null }),
      setDirectMessages: (messages) => set({ directMessages: messages }),
      addDirectMessage: (message) => set((state) => ({
        directMessages: [...state.directMessages, message]
      })),

      // UI actions
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleMembers: () => set((state) => ({ membersOpen: !state.membersOpen })),
    }),
    {
      name: 'chathub-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useStore;
