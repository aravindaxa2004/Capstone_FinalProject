import { useState, useRef, useEffect } from 'react';
import { Send, Smile, PlusCircle } from 'lucide-react';
import useStore from '../store/useStore';
import { sendMessage, startTyping, stopTyping, sendDirectMessage } from '../services/socket';

export default function MessageInput() {
  const [content, setContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { currentChannel, dmUser } = useStore();

  // Focus input on channel/dm change
  useEffect(() => {
    inputRef.current?.focus();
  }, [currentChannel?.id, dmUser?.id]);

  const handleTyping = () => {
    if (currentChannel && !dmUser) {
      if (!isTyping) {
        setIsTyping(true);
        startTyping(currentChannel.id);
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        stopTyping(currentChannel.id);
      }, 2000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedContent = content.trim();

    if (!trimmedContent) return;

    if (dmUser) {
      sendDirectMessage(dmUser.id, trimmedContent);
    } else if (currentChannel) {
      sendMessage(currentChannel.id, trimmedContent);
      
      // Stop typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      setIsTyping(false);
      stopTyping(currentChannel.id);
    }

    setContent('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const placeholder = dmUser
    ? `Message @${dmUser.username}`
    : currentChannel
    ? `Message #${currentChannel.name}`
    : 'Select a channel to start chatting';

  return (
    <form onSubmit={handleSubmit} className="px-4 pb-6">
      <div className="relative bg-dark-700 rounded-lg">
        <div className="flex items-end">
          <button
            type="button"
            className="p-3 hover:text-dark-200 transition-colors text-dark-400"
          >
            <PlusCircle className="w-5 h-5" />
          </button>

          <textarea
            ref={inputRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={!currentChannel && !dmUser}
            rows={1}
            className="flex-1 bg-transparent py-3 px-1 text-dark-100 placeholder-dark-500 resize-none focus:outline-none max-h-40 overflow-y-auto"
            style={{ minHeight: '48px' }}
          />

          <div className="flex items-center gap-1 pr-2">
            <button
              type="button"
              className="p-2 hover:text-dark-200 transition-colors text-dark-400"
            >
              <Smile className="w-5 h-5" />
            </button>

            <button
              type="submit"
              disabled={!content.trim() || (!currentChannel && !dmUser)}
              className="p-2 bg-primary-500 hover:bg-primary-600 disabled:bg-dark-600 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
