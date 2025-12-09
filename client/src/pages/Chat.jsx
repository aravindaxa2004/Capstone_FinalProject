import { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import { workspacesApi, channelsApi, messagesApi } from '../services/api';
import { joinWorkspace, joinChannel, leaveChannel } from '../services/socket';

import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import MembersSidebar from '../components/MembersSidebar';
import WelcomeScreen from '../components/WelcomeScreen';

export default function Chat() {
  const {
    currentWorkspace,
    currentChannel,
    dmUser,
    setWorkspaces,
    setCurrentWorkspace,
    setChannels,
    setCurrentChannel,
    setMessages,
    setMembers,
    setDirectMessages,
    sidebarOpen,
    membersOpen,
  } = useStore();

  const [loading, setLoading] = useState(true);
  const [previousChannelId, setPreviousChannelId] = useState(null);

  // Load workspaces on mount
  useEffect(() => {
    const loadWorkspaces = async () => {
      try {
        const { data } = await workspacesApi.getAll();
        setWorkspaces(data.workspaces);
        
        // Auto-select first workspace
        if (data.workspaces.length > 0) {
          setCurrentWorkspace(data.workspaces[0]);
        }
      } catch (error) {
        console.error('Failed to load workspaces:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkspaces();
  }, []);

  // Load channels and members when workspace changes
  useEffect(() => {
    if (!currentWorkspace) return;

    const loadWorkspaceData = async () => {
      try {
        // Join workspace room
        joinWorkspace(currentWorkspace.id);

        // Load channels
        const channelsRes = await channelsApi.getByWorkspace(currentWorkspace.id);
        setChannels(channelsRes.data.channels);

        // Load members
        const membersRes = await workspacesApi.getMembers(currentWorkspace.id);
        setMembers(membersRes.data.members);

        // Auto-select first channel
        if (channelsRes.data.channels.length > 0) {
          setCurrentChannel(channelsRes.data.channels[0]);
        }
      } catch (error) {
        console.error('Failed to load workspace data:', error);
      }
    };

    loadWorkspaceData();
  }, [currentWorkspace?.id]);

  // Load messages when channel changes
  useEffect(() => {
    if (!currentChannel) return;

    // Leave previous channel
    if (previousChannelId && previousChannelId !== currentChannel.id) {
      leaveChannel(previousChannelId);
    }

    const loadMessages = async () => {
      try {
        joinChannel(currentChannel.id);
        const { data } = await messagesApi.getByChannel(currentChannel.id);
        setMessages(data.messages);
        setPreviousChannelId(currentChannel.id);
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    loadMessages();
  }, [currentChannel?.id]);

  // Load direct messages when DM user changes
  useEffect(() => {
    if (!dmUser) return;

    // Leave current channel if any
    if (previousChannelId) {
      leaveChannel(previousChannelId);
      setPreviousChannelId(null);
    }

    const loadDMs = async () => {
      try {
        const { data } = await messagesApi.getDirect(dmUser.id);
        setDirectMessages(data.messages);
      } catch (error) {
        console.error('Failed to load direct messages:', error);
      }
    };

    loadDMs();
  }, [dmUser?.id]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-dark-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-dark-400">Loading ChatHub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-dark-900">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}>
        <Sidebar />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {currentChannel || dmUser ? (
          <ChatArea />
        ) : (
          <WelcomeScreen />
        )}
      </div>

      {/* Members sidebar */}
      {(currentChannel || dmUser) && (
        <div className={`${membersOpen ? 'w-60' : 'w-0'} transition-all duration-300 overflow-hidden border-l border-dark-700`}>
          <MembersSidebar />
        </div>
      )}
    </div>
  );
}
