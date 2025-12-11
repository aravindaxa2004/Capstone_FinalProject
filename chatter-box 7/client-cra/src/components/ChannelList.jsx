/**
 * Channel List Component
 * Displays available channels and creation form
 */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import '../styles/Components.css';

export default function ChannelList() {
  const [channelList, setChannelList] = useState([]);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const navigate = useNavigate();

  // Load channels on mount
  useEffect(() => {
    const authToken = localStorage.getItem('token');
    
    if (!authToken) {
      navigate('/login');
      return;
    }

    const fetchChannels = async () => {
      try {
        const response = await apiClient.get('/channels/public');
        setChannelList(response.data?.data || []);
      } catch (error) {
        console.error('Failed to fetch channels:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchChannels();
  }, [navigate]);

  // Create new channel
  const handleCreateChannel = async (event) => {
    event.preventDefault();
    
    if (!newChannelName.trim()) return;
    
    setIsCreating(true);

    try {
      const response = await apiClient.post('/channels', {
        name: newChannelName.trim(),
        description: newChannelDesc.trim()
      });

      const createdChannel = response.data?.data || response.data;
      setChannelList(prev => [createdChannel, ...prev]);
      setNewChannelName('');
      setNewChannelDesc('');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create channel';
      alert(message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="channel-list-container">
      <h2 className="section-title">Available Channels</h2>

      <form className="create-channel-form" onSubmit={handleCreateChannel}>
        <div className="form-row">
          <input
            type="text"
            className="form-input"
            placeholder="Channel name"
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            required
            disabled={isCreating}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Description (optional)"
            value={newChannelDesc}
            onChange={(e) => setNewChannelDesc(e.target.value)}
            disabled={isCreating}
          />
          <button type="submit" className="btn-create" disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>

      <ul className="channels-grid">
        {channelList.length > 0 ? (
          channelList.map((channel) => (
            <li key={channel._id} className="channel-card">
              <Link to={`/channels/${channel._id}`} className="channel-link">
                <span className="channel-icon">#</span>
                <span className="channel-name">{channel.name}</span>
                {channel.description && (
                  <span className="channel-description">{channel.description}</span>
                )}
              </Link>
            </li>
          ))
        ) : (
          <li className="empty-state">
            No channels available. Create the first one!
          </li>
        )}
      </ul>
    </div>
  );
}
