import React, { useRef, useEffect,useState } from 'react';
import '../styles/Components.css';
import { useAuth } from '../context/AuthContext';

export default function MessageList({ messages }) {
  const { user: currentUser } = useAuth();
  const messagesEndRef = useRef(null);
  const wrapperRef = useRef(null);

  const [prevLength, setPrevLength] = useState(messages.length);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return; 
    const isAtBottom = wrapper.scrollHeight - wrapper.scrollTop === wrapper.clientHeight;

    // Only scroll if user is at bottom or new messages are added
    if (messages.length > prevLength || isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    setPrevLength(messages.length);
  }, [messages, prevLength]);

  if (!messages?.length) {
    return <p className="text-muted">No messages yet.</p>;
  }

  return (
    <div className="messages-wrapper" ref={wrapperRef}>
      {messages.map((msg, idx) => {
        const isSelf = currentUser?.id === msg.sender?._id;
        return (
          <div key={msg._id || idx} className={`message-row ${isSelf ? 'self-row' : 'other-row'}`}>
            <div className={`message-item ${isSelf ? 'self' : 'other'}`}>
              <span className="message-sender">{msg.sender?.username ?? 'Unknown'}</span>
              : <span className="message-content">{msg.content}</span>
              <div className="message-timestamp">
                {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
