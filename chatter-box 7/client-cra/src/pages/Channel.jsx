/**
 * Channel Page Component
 * Displays channel details, messages, and messaging interface
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';
import MessageList from '../components/MessageList';
import SendMessageForm from '../components/SendMessageForm';
import '../styles/Channel.css';

export default function Channel() {
  const { id: channelId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [channelData, setChannelData] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [channelNotFound, setChannelNotFound] = useState(false);

  // Fetch channel information
  const loadChannelData = useCallback(async () => {
    setIsLoading(true);
    setChannelNotFound(false);

    try {
      const response = await apiClient.get(`/channels/${channelId}`);
      
      if (!response.data?.data) {
        setChannelNotFound(true);
        return;
      }

      const channel = response.data.data;
      setChannelData(channel);

      // Check if current user is subscribed
      const memberIds = (channel.members || []).map(m => m._id);
      setIsSubscribed(memberIds.includes(user.id));
    } catch (error) {
      if (error.response?.status === 404) {
        setChannelNotFound(true);
      } else {
        console.error('Failed to load channel:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [channelId, user.id]);

  // Fetch channel messages
  const loadMessages = useCallback(async () => {
    try {
      const response = await apiClient.get(`/channels/${channelId}/messages`);
      const messages = response.data?.data || [];
      
      if (Array.isArray(messages)) {
        setMessageList(messages);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }, [channelId]);

  // Initial data load
  useEffect(() => {
    loadChannelData();
  }, [loadChannelData]);

  // Poll for new messages when subscribed
  useEffect(() => {
    if (!isSubscribed) return;

    loadMessages();
    const pollInterval = setInterval(loadMessages, 3000);
    
    return () => clearInterval(pollInterval);
  }, [isSubscribed, loadMessages]);

  // Subscribe to channel
  const handleSubscribe = async () => {
    try {
      await apiClient.post(`/channels/${channelId}/subscription`);
      await loadChannelData();
      await loadMessages();
    } catch (error) {
      alert('Failed to subscribe to channel');
    }
  };

  // Unsubscribe from channel
  const handleUnsubscribe = async () => {
    try {
      await apiClient.delete(`/channels/${channelId}/subscription`);
      setIsSubscribed(false);
      setMessageList([]);
      await loadChannelData();
    } catch (error) {
      alert('Failed to unsubscribe from channel');
    }
  };

  // Handle new message sent
  const handleNewMessage = (message) => {
    setMessageList(prev => [...prev, message]);
  };

  // Navigate back to home
  const goBack = () => navigate('/');

  // Loading state
  if (isLoading) {
    return <p className="status-message">Loading channel...</p>;
  }

  // Not found state
  if (channelNotFound) {
    return <p className="status-message error">Channel not found</p>;
  }

  return (
    <div className="channel-page">
      <header className="channel-header">
        <div className="channel-info">
          <h2 className="channel-name">{channelData?.name}</h2>
          {channelData?.description && (
            <p className="channel-desc">{channelData.description}</p>
          )}
        </div>

        <div className="channel-actions">
          <button className="btn-secondary" onClick={goBack}>
            ← Back
          </button>
          {isSubscribed && (
            <button className="btn-danger" onClick={handleUnsubscribe}>
              Unsubscribe
            </button>
          )}
        </div>
      </header>

      {!isSubscribed ? (
        <div className="subscribe-prompt">
          <p>Subscribe to this channel to view and send messages</p>
          <button className="btn-primary" onClick={handleSubscribe}>
            Subscribe to Channel
          </button>
        </div>
      ) : (
        <div className="channel-content">
          <div className="message-area">
            <MessageList messages={messageList} />
          </div>
          <div className="input-area">
            <SendMessageForm
              channelId={channelId}
              onMessageSent={handleNewMessage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
