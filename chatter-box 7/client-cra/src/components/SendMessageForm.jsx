/**
 * Send Message Form Component
 * Input form for composing and sending messages
 */
import React, { useState } from 'react';
import apiClient from '../api/axios';
import '../styles/Components.css';

export default function SendMessageForm({ channelId, onMessageSent }) {
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedMessage = messageText.trim();
    if (!trimmedMessage) return;

    setIsSending(true);

    try {
      const response = await apiClient.post(`/channels/${channelId}/messages`, {
        content: trimmedMessage
      });

      const sentMessage = response.data?.data;
      
      if (sentMessage) {
        onMessageSent(sentMessage);
        setMessageText('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Could not send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // Handle Enter key to send
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="message-input"
        placeholder="Type your message..."
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSending}
        maxLength={2000}
      />
      <button
        type="submit"
        className="btn-send"
        disabled={isSending || !messageText.trim()}
      >
        {isSending ? '...' : 'Send'}
      </button>
    </form>
  );
}
