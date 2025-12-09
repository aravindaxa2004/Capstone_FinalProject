import useStore from '../store/useStore';

export default function MembersSidebar() {
  const { members, user, setDmUser } = useStore();

  const onlineMembers = members.filter((m) => m.status === 'online');
  const offlineMembers = members.filter((m) => m.status !== 'online');

  const handleMemberClick = (member) => {
    if (member.id !== user?.id) {
      setDmUser(member);
    }
  };

  const MemberItem = ({ member }) => (
    <button
      onClick={() => handleMemberClick(member)}
      className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors ${
        member.id === user?.id
          ? 'cursor-default'
          : 'hover:bg-dark-700/50 cursor-pointer'
      }`}
    >
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-sm font-medium text-white">
          {member.username.charAt(0).toUpperCase()}
        </div>
        <div
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-dark-800 ${
            member.status === 'online' ? 'bg-green-500' : 'bg-dark-500'
          }`}
        />
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className="text-sm text-dark-200 truncate">
          {member.username}
          {member.id === user?.id && (
            <span className="text-dark-500 ml-1">(you)</span>
          )}
        </p>
        {member.role === 'admin' && (
          <p className="text-xs text-primary-400">Admin</p>
        )}
      </div>
    </button>
  );

  return (
    <div className="h-full w-60 bg-dark-800 overflow-y-auto py-4">
      {/* Online members */}
      {onlineMembers.length > 0 && (
        <div className="px-3 mb-4">
          <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wide mb-2">
            Online — {onlineMembers.length}
          </h3>
          <div className="space-y-0.5">
            {onlineMembers.map((member) => (
              <MemberItem key={member.id} member={member} />
            ))}
          </div>
        </div>
      )}

      {/* Offline members */}
      {offlineMembers.length > 0 && (
        <div className="px-3">
          <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wide mb-2">
            Offline — {offlineMembers.length}
          </h3>
          <div className="space-y-0.5">
            {offlineMembers.map((member) => (
              <MemberItem key={member.id} member={member} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
