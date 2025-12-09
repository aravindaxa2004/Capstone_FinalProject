import { useRef, useEffect } from 'react';
import { Hash, Users, Menu, AtSign } from 'lucide-react';
import useStore from '../store/useStore';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

export default function ChatArea() {
  const {
    currentChannel,
    dmUser,
    user,
    messages,
    directMessages,
    typingUsers,
    toggleSidebar,
    toggleMembers,
  } = useStore();

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const displayMessages = dmUser ? directMessages : messages;
  const channelTypingUsers = currentChannel ? typingUsers[currentChannel.id] || {} : {};
  const typingUsersList = Object.entries(channelTypingUsers)
    .filter(([userId]) => userId !== user?.id)
    .map(([, username]) => username);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayMessages]);

  return (
    <div className="flex-1 flex flex-col h-full bg-dark-900">
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-dark-700 bg-dark-900 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-1.5 hover:bg-dark-800 rounded-lg transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5 text-dark-400" />
          </button>
          
          {dmUser ? (
            <>
              <AtSign className="w-5 h-5 text-dark-400" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{dmUser.username}</span>
                <div
                  className={`w-2 h-2 rounded-full ${
                    dmUser.status === 'online' ? 'bg-green-500' : 'bg-dark-500'
                  }`}
                />
              </div>
            </>
          ) : (
            <>
              <Hash className="w-5 h-5 text-dark-400" />
              <div>
                <span className="font-semibold text-white">{currentChannel?.name}</span>
                {currentChannel?.description && (
                  <span className="ml-3 text-sm text-dark-500 hidden sm:inline">
                    {currentChannel.description}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
        
        <button
          onClick={toggleMembers}
          className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
          title="Toggle members"
        >
          <Users className="w-5 h-5 text-dark-400" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto messages-container px-4 py-4"
      >
        {/* Welcome message */}
        <div className="mb-8 pb-8 border-b border-dark-700">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mb-4">
            {dmUser ? (
              <span className="text-2xl font-bold text-white">
                {dmUser.username.charAt(0).toUpperCase()}
              </span>
            ) : (
              <Hash className="w-8 h-8 text-white" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {dmUser ? dmUser.username : `Welcome to #${currentChannel?.name}`}
          </h2>
          <p className="text-dark-400">
            {dmUser
              ? `This is the beginning of your direct message history with ${dmUser.username}`
              : `This is the start of the #${currentChannel?.name} channel. ${currentChannel?.description || ''}`}
          </p>
        </div>

        {/* Messages list */}
        <div className="space-y-1">
          {displayMessages.map((message, index) => {
            const prevMessage = displayMessages[index - 1];
            const showAvatar =
              !prevMessage ||
              (dmUser
                ? prevMessage.sender_id !== message.sender_id
                : prevMessage.user_id !== message.user_id) ||
              new Date(message.created_at) - new Date(prevMessage?.created_at) > 5 * 60 * 1000;

            return (
              <MessageItem
                key={message.id}
                message={message}
                showAvatar={showAvatar}
                isDM={!!dmUser}
              />
            );
          })}
        </div>

        {/* Typing indicator */}
        {typingUsersList.length > 0 && (
          <TypingIndicator users={typingUsersList} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <MessageInput />
    </div>
  );
}
