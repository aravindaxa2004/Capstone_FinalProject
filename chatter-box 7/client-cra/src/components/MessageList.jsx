/**
 * Message List Component
 * Displays chat messages with auto-scroll
 */
import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Components.css';

export default function MessageList({ messages }) {
  const { user: currentUser } = useAuth();
  const containerRef = useRef(null);
  const scrollAnchorRef = useRef(null);
  const [previousCount, setPreviousCount] = useState(0);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isNearBottom = 
      container.scrollHeight - container.scrollTop <= container.clientHeight + 50;

    // Scroll if user is near bottom or new messages arrived
    if (messages.length > previousCount || isNearBottom) {
      scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    setPreviousCount(messages.length);
  }, [messages, previousCount]);

  // Format timestamp for display
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Empty state
  if (!messages || messages.length === 0) {
    return (
      <div className="empty-messages">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="message-list" ref={containerRef}>
      {messages.map((msg, index) => {
        const isOwnMessage = currentUser?.id === msg.sender?._id;
        const senderName = msg.sender?.username || 'Unknown';

        return (
          <div
            key={msg._id || index}
            className={`message-bubble ${isOwnMessage ? 'own' : 'other'}`}
          >
            <div className="message-header">
              <span className="sender-name">{senderName}</span>
              <span className="message-time">{formatTime(msg.timestamp)}</span>
            </div>
            <p className="message-text">{msg.content}</p>
          </div>
        );
      })}
      <div ref={scrollAnchorRef} />
    </div>
  );
}
