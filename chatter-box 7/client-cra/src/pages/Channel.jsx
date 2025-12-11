import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import MessageList from '../components/MessageList';
import SendMessageForm from '../components/SendMessageForm';
import '../styles/Channel.css';

export default function Channel() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [messages, setMessages] = useState([]);
  const [isMember, setIsMember] = useState(false);

  // Fetch channel details (with members) and set membership flag
  const fetchChannel = async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const res = await api.get(`/channels/${id}`);
      if (!res.data?.data) {
        setNotFound(true);
        setChannel(null);
        return;
      }
      setChannel(res.data.data);
      const members = res.data.data.members || [];
      const memberIds = members.map(m => m._id);
      setIsMember(memberIds.includes(user.id));
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
        setChannel(null);
      } else {
        console.error(err);
        alert('Failed to load channel. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannel();
  }, [id, user.id]);

  // Load messages safely
  const loadMessages = async () => {
    try {
      const res = await api.get(`/channels/${id}/messages`);
      const msgs = res.data?.data || [];
      if (Array.isArray(msgs)) {
        setMessages(msgs);
      } else {
        console.warn('API returned invalid messages, skipping update');
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  // Join / subscribe channel
  const handleJoin = async () => {
    try {
      await api.post(`/channels/${id}/subscription`);
      await fetchChannel();
      await loadMessages();
    } catch (err) {
      console.error(err);
      alert('Failed to join the channel.');
    }
  };

  // Leave / unsubscribe from channel
  const handleLeave = async () => {
    try {
      await api.delete(`/channels/${id}/subscription`);
      setIsMember(false);
      setMessages([]);
      await fetchChannel();
    } catch (err) {
      console.error(err);
      alert('Failed to leave the channel.');
    }
  };

  // Poll messages if member
  useEffect(() => {
    if (!isMember) return;
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [isMember, id]);

  if (loading) return <p className="loading-text">Loading…</p>;
  if (notFound) return <p className="text-muted">Channel not found.</p>;

  return (
    <div className="channel-container">
      <div className="channel-header">
        <h2 className="channel-title">{channel?.name}</h2>
        <p className="channel-description">{channel?.description}</p>

        <div className="header-buttons">
          <button className="back-button" onClick={() => navigate('/')}>
            Back
          </button>

          {isMember && (
            <button className="exit-button" onClick={handleLeave}>
              Unsubscribe
            </button>
          )}
        </div>
      </div>

      {!isMember ? (
        <button className="join-button" onClick={handleJoin}>
          Subscribe
        </button>
      ) : (
        <>
          <div className="messages-wrapper">
            <MessageList messages={messages || []} />
          </div>
          <div className="send-form">
            <SendMessageForm
              channelId={id}
              onNewMessage={msg => setMessages(prev => [...prev, msg])}
            />
          </div>
        </>
      )}
    </div>

  );
}
