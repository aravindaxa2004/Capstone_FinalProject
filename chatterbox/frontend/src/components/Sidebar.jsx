import { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({
  channels,
  myChannels,
  selectedChannel,
  onSelectChannel,
  onJoinChannel,
  onLeaveChannel,
  onCreateChannel,
  onLogout,
  user,
  loading,
  isOpen,
  onToggle
}) => {
  const [activeTab, setActiveTab] = useState('my');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter channels based on search
  const filteredChannels = (activeTab === 'my' ? myChannels : channels).filter(
    channel => channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if user is member of a channel
  const isMember = (channel) => {
    return channel.members?.some(member => 
      member._id === user?._id || member === user?._id
    );
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <svg viewBox="0 0 100 100" className="brand-icon">
              <rect width="100" height="100" rx="20" fill="#5865F2"/>
              <path d="M30 35 L50 25 L70 35 L70 65 L50 75 L30 65 Z" fill="white" opacity="0.9"/>
              <circle cx="50" cy="50" r="10" fill="#5865F2"/>
            </svg>
            <span className="brand-name">ChatterBox</span>
          </div>
          <button className="sidebar-close" onClick={onToggle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="sidebar-search">
          <input
            type="text"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="sidebar-tabs">
          <button
            className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
            onClick={() => setActiveTab('my')}
          >
            My Channels
          </button>
          <button
            className={`tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            Browse All
          </button>
        </div>

        <div className="sidebar-channels">
          {loading ? (
            <div className="channels-loading">
              <div className="spinner"></div>
              <span>Loading channels...</span>
            </div>
          ) : filteredChannels.length === 0 ? (
            <div className="channels-empty">
              {activeTab === 'my' ? (
                <>
                  <p>You haven't joined any channels yet.</p>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => setActiveTab('browse')}
                  >
                    Browse Channels
                  </button>
                </>
              ) : (
                <p>No channels found.</p>
              )}
            </div>
          ) : (
            <ul className="channel-list">
              {filteredChannels.map(channel => (
                <li
                  key={channel._id}
                  className={`channel-item ${selectedChannel?._id === channel._id ? 'active' : ''}`}
                >
                  <div 
                    className="channel-info"
                    onClick={() => isMember(channel) && onSelectChannel(channel)}
                    style={{ cursor: isMember(channel) ? 'pointer' : 'default' }}
                  >
                    <span className="channel-icon">#</span>
                    <div className="channel-details">
                      <span className="channel-name">{channel.name}</span>
                      <span className="channel-members">
                        {channel.members?.length || 0} members
                      </span>
                    </div>
                  </div>
                  <div className="channel-actions">
                    {isMember(channel) ? (
                      activeTab === 'browse' && (
                        <button
                          className="btn btn-sm btn-outline joined-btn"
                          onClick={() => onLeaveChannel(channel._id)}
                          title="Leave channel"
                        >
                          Joined
                        </button>
                      )
                    ) : (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => onJoinChannel(channel._id)}
                      >
                        Join
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="sidebar-create">
          <button 
            className="btn btn-primary btn-full"
            onClick={onCreateChannel}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create Channel
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-info">
            <div className="avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.username}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout} title="Logout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onToggle}></div>}
    </>
  );
};

export default Sidebar;
