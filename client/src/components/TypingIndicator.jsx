export default function TypingIndicator({ users }) {
  if (!users || users.length === 0) return null;

  const formatUsers = () => {
    if (users.length === 1) {
      return <span className="font-medium">{users[0]}</span>;
    } else if (users.length === 2) {
      return (
        <>
          <span className="font-medium">{users[0]}</span> and{' '}
          <span className="font-medium">{users[1]}</span>
        </>
      );
    } else if (users.length === 3) {
      return (
        <>
          <span className="font-medium">{users[0]}</span>,{' '}
          <span className="font-medium">{users[1]}</span>, and{' '}
          <span className="font-medium">{users[2]}</span>
        </>
      );
    } else {
      return <span className="font-medium">Several people</span>;
    }
  };

  return (
    <div className="flex items-center gap-2 px-2 py-2 text-sm text-dark-400 animate-fadeIn">
      <div className="flex gap-1">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
      <span>
        {formatUsers()} {users.length === 1 ? 'is' : 'are'} typing...
      </span>
    </div>
  );
}
