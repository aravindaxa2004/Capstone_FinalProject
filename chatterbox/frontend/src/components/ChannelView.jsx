import { useState, useEffect, useRef, useCallback } from 'react';
import { messagesAPI } from '../services/api';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import './ChannelView.css';

const ChannelView = ({ channel, user, onLeaveChannel, onToggleSidebar }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      const response = await messagesAPI.getByChannel(channel._id);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [channel._id]);

  // Initial fetch and auto-refresh
  useEffect(() => {
    setLoading(true);
    setMessages([]);
    fetchMessages();

    // Auto-refresh messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);

    return () => clearInterval(interval);
  }, [channel._id, fetchMessages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    setSending(true);
    try {
      const response = await messagesAPI.send(channel._id, content);
      setMessages(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="channel-view">
      <header className="channel-header">
        <button className="menu-btn" onClick={onToggleSidebar}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        
        <div className="channel-header-info">
          <h2>
            <span className="hash">#</span>
            {channel.name}
          </h2>
          {channel.description && (
            <p className="channel-description">{channel.description}</p>
          )}
        </div>

        <div className="channel-header-actions">
          <button 
            className="header-btn"
            onClick={() => setShowMembers(!showMembers)}
            title="Show members"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span className="member-count">{channel.members?.length || 0}</span>
          </button>
          
          <button 
            className="header-btn leave-btn"
            onClick={() => onLeaveChannel(channel._id)}
            title="Leave channel"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </header>

      <div className="channel-content">
        <div className="messages-container">
          {loading ? (
            <div className="messages-loading">
              <div className="spinner"></div>
              <span>Loading messages...</span>
            </div>
          ) : (
            <>
              <MessageList messages={messages} currentUser={user} />
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {showMembers && (
          <aside className="members-panel">
            <h3>Members — {channel.members?.length || 0}</h3>
            <ul className="members-list">
              {channel.members?.map(member => (
                <li key={member._id} className="member-item">
                  <div className="avatar avatar-sm">
                    {member.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="member-name">
                    {member.username}
                    {member._id === user?._id && <span className="you-badge">(you)</span>}
                    {member._id === channel.createdBy?._id && (
                      <span className="owner-badge">Owner</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>

      <MessageInput onSend={handleSendMessage} disabled={sending} channelName={channel.name} />
    </div>
  );
};

export default ChannelView;
