import React, { useState } from 'react';
import api from '../api/axios';
import '../styles/Components.css';

export default function SendMessageForm({ channelId, onNewMessage }) {
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  const send = async (e) => {
    e.preventDefault();
    if (!content.trim()) return; // Prevent empty messages
    setSending(true);

    try {
      const res = await api.post(`/channels/${channelId}/messages`, { content });
      const newMsg = res.data.data;
      if (newMsg) {
        onNewMessage(newMsg);
        setContent('');
      } else {
        console.warn('API returned empty message');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="send-form" onSubmit={send}>
      <input
        className="send-input"
        placeholder="Type a message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={sending}
        required
      />
      <button className="send-button" type="submit" disabled={sending || !content.trim()}>
        {sending ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
