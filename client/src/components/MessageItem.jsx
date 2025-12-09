import { useState } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { Trash2, MoreHorizontal } from 'lucide-react';
import useStore from '../store/useStore';
import { deleteMessage } from '../services/socket';

export default function MessageItem({ message, showAvatar, isDM }) {
  const [showActions, setShowActions] = useState(false);
  const { user, currentChannel } = useStore();

  const messageUser = isDM
    ? { id: message.sender_id, username: message.sender_username, avatar: message.sender_avatar }
    : { id: message.user_id, username: message.username, avatar: message.avatar };

  const isOwnMessage = messageUser.id === user?.id;
  const messageDate = new Date(message.created_at);

  const formatMessageTime = (date) => {
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    }
    return format(date, 'MMM d, yyyy h:mm a');
  };

  const handleDelete = () => {
    if (isOwnMessage && currentChannel) {
      deleteMessage(message.id, currentChannel.id);
    }
  };

  return (
    <div
      className={`group relative flex gap-3 py-1 px-2 -mx-2 rounded-lg hover:bg-dark-800/50 transition-colors ${
        showAvatar ? 'mt-4' : ''
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar or spacer */}
      <div className="w-10 flex-shrink-0">
        {showAvatar && (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center font-medium text-white">
            {messageUser.username?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {showAvatar && (
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="font-medium text-white hover:underline cursor-pointer">
              {messageUser.username}
            </span>
            <span className="text-xs text-dark-500">
              {formatMessageTime(messageDate)}
            </span>
          </div>
        )}
        <div className="text-dark-200 break-words whitespace-pre-wrap">
          {message.content}
        </div>
      </div>

      {/* Actions */}
      {showActions && isOwnMessage && !isDM && (
        <div className="absolute right-2 top-0 -translate-y-1/2 flex items-center gap-1 bg-dark-800 border border-dark-600 rounded-lg shadow-lg p-1 animate-fadeIn">
          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-red-500/20 rounded transition-colors group/btn"
            title="Delete message"
          >
            <Trash2 className="w-4 h-4 text-dark-400 group-hover/btn:text-red-400" />
          </button>
        </div>
      )}
    </div>
  );
}
