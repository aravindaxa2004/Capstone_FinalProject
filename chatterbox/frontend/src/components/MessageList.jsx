import './MessageList.css';

const MessageList = ({ messages, currentUser }) => {
  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if messages should be grouped (same sender, within 5 minutes)
  const shouldGroup = (current, previous) => {
    if (!previous) return false;
    
    const sameUser = current.sender?._id === previous.sender?._id;
    const timeDiff = new Date(current.timestamp) - new Date(previous.timestamp);
    const withinTimeWindow = timeDiff < 5 * 60 * 1000; // 5 minutes
    
    return sameUser && withinTimeWindow;
  };

  if (messages.length === 0) {
    return (
      <div className="messages-empty">
        <div className="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <h3>No messages yet</h3>
        <p>Be the first to start the conversation!</p>
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="message-list">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="message-group">
          <div className="date-divider">
            <span>{date}</span>
          </div>
          
          {dateMessages.map((message, index) => {
            const isGrouped = shouldGroup(message, dateMessages[index - 1]);
            const isCurrentUser = message.sender?._id === currentUser?._id;
            
            return (
              <div 
                key={message._id} 
                className={`message ${isGrouped ? 'grouped' : ''} ${isCurrentUser ? 'own-message' : ''}`}
              >
                {!isGrouped && (
                  <div className="message-avatar">
                    <div className="avatar">
                      {message.sender?.username?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
                
                <div className="message-content">
                  {!isGrouped && (
                    <div className="message-header">
                      <span className="message-author">
                        {message.sender?.username}
                        {isCurrentUser && <span className="you-indicator">(you)</span>}
                      </span>
                      <span className="message-time">{formatTime(message.timestamp)}</span>
                    </div>
                  )}
                  <p className="message-text">{message.content}</p>
                </div>
                
                {isGrouped && (
                  <span className="hover-time">{formatTime(message.timestamp)}</span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
