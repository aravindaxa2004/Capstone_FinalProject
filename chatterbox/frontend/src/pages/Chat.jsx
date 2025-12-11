import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import ChannelView from '../components/ChannelView';
import CreateChannelModal from '../components/CreateChannelModal';
import { channelsAPI } from '../services/api';
import './Chat.css';

const Chat = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [channels, setChannels] = useState([]);
  const [myChannels, setMyChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch channels
  const fetchChannels = async () => {
    try {
      const [publicRes, myRes] = await Promise.all([
        channelsAPI.getPublic(),
        channelsAPI.getMyChannels()
      ]);
      setChannels(publicRes.data);
      setMyChannels(myRes.data);
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  // Handle channel selection from URL
  useEffect(() => {
    if (channelId && myChannels.length > 0) {
      const channel = myChannels.find(c => c._id === channelId);
      if (channel) {
        setSelectedChannel(channel);
      }
    }
  }, [channelId, myChannels]);

  const handleSelectChannel = (channel) => {
    setSelectedChannel(channel);
    navigate(`/chat/${channel._id}`);
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const handleJoinChannel = async (channelId) => {
    try {
      await channelsAPI.join(channelId);
      await fetchChannels();
      const channel = channels.find(c => c._id === channelId);
      if (channel) {
        handleSelectChannel(channel);
      }
    } catch (error) {
      console.error('Error joining channel:', error);
    }
  };

  const handleLeaveChannel = async (channelId) => {
    try {
      await channelsAPI.leave(channelId);
      if (selectedChannel?._id === channelId) {
        setSelectedChannel(null);
        navigate('/chat');
      }
      await fetchChannels();
    } catch (error) {
      console.error('Error leaving channel:', error);
    }
  };

  const handleCreateChannel = async (channelData) => {
    try {
      const response = await channelsAPI.create(channelData);
      await fetchChannels();
      handleSelectChannel(response.data);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating channel:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="chat-layout">
      <Sidebar
        channels={channels}
        myChannels={myChannels}
        selectedChannel={selectedChannel}
        onSelectChannel={handleSelectChannel}
        onJoinChannel={handleJoinChannel}
        onLeaveChannel={handleLeaveChannel}
        onCreateChannel={() => setShowCreateModal(true)}
        onLogout={handleLogout}
        user={user}
        loading={loading}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />

      <main className={`chat-main ${sidebarOpen ? '' : 'sidebar-closed'}`}>
        {selectedChannel ? (
          <ChannelView
            channel={selectedChannel}
            user={user}
            onLeaveChannel={handleLeaveChannel}
            onToggleSidebar={toggleSidebar}
          />
        ) : (
          <div className="no-channel-selected">
            <div className="no-channel-content">
              <svg viewBox="0 0 100 100" className="no-channel-icon">
                <rect width="100" height="100" rx="20" fill="var(--surface-light)"/>
                <path d="M30 35 L50 25 L70 35 L70 65 L50 75 L30 65 Z" fill="var(--primary)" opacity="0.5"/>
                <circle cx="50" cy="50" r="10" fill="var(--primary)"/>
              </svg>
              <h2>Welcome to ChatterBox!</h2>
              <p>Select a channel from the sidebar or create a new one to start chatting.</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                Create a Channel
              </button>
            </div>
          </div>
        )}
      </main>

      {showCreateModal && (
        <CreateChannelModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateChannel}
        />
      )}
    </div>
  );
};

export default Chat;
