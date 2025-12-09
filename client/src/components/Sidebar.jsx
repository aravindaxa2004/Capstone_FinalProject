import { useState } from 'react';
import {
  Hash,
  Plus,
  ChevronDown,
  Settings,
  LogOut,
  Users,
  MessageSquare,
  Copy,
  Check,
} from 'lucide-react';
import useStore from '../store/useStore';
import { authApi, channelsApi, workspacesApi } from '../services/api';
import { disconnectSocket, broadcastNewChannel } from '../services/socket';
import CreateChannelModal from './modals/CreateChannelModal';
import CreateWorkspaceModal from './modals/CreateWorkspaceModal';
import JoinWorkspaceModal from './modals/JoinWorkspaceModal';

export default function Sidebar() {
  const {
    user,
    workspaces,
    currentWorkspace,
    channels,
    currentChannel,
    members,
    dmUser,
    setCurrentWorkspace,
    setCurrentChannel,
    setDmUser,
    logout,
  } = useStore();

  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [showJoinWorkspace, setShowJoinWorkspace] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    disconnectSocket();
    logout();
  };

  const handleCopyInviteCode = () => {
    if (currentWorkspace?.invite_code) {
      navigator.clipboard.writeText(currentWorkspace.invite_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCreateChannel = async (data) => {
    try {
      const { data: result } = await channelsApi.create({
        ...data,
        workspaceId: currentWorkspace.id,
      });
      broadcastNewChannel(currentWorkspace.id, result.channel);
      setShowCreateChannel(false);
    } catch (error) {
      console.error('Failed to create channel:', error);
    }
  };

  const handleSelectDM = (member) => {
    if (member.id !== user.id) {
      setDmUser(member);
    }
  };

  return (
    <div className="h-full w-64 bg-dark-800 flex flex-col">
      {/* Workspace selector */}
      <div className="relative">
        <button
          onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-dark-700 transition-colors border-b border-dark-700"
        >
          <span className="font-semibold text-white truncate">
            {currentWorkspace?.name || 'Select Workspace'}
          </span>
          <ChevronDown className={`w-4 h-4 text-dark-400 transition-transform ${showWorkspaceMenu ? 'rotate-180' : ''}`} />
        </button>

        {/* Workspace dropdown menu */}
        {showWorkspaceMenu && (
          <div className="absolute top-full left-0 right-0 z-50 bg-dark-900 border border-dark-700 rounded-lg shadow-xl m-2 overflow-hidden animate-fadeIn">
            <div className="p-2 border-b border-dark-700">
              <p className="text-xs text-dark-500 px-2 py-1">Your Workspaces</p>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    setCurrentWorkspace(ws);
                    setShowWorkspaceMenu(false);
                  }}
                  className={`w-full px-2 py-2 rounded-md text-left text-sm transition-colors ${
                    ws.id === currentWorkspace?.id
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-dark-300 hover:bg-dark-800'
                  }`}
                >
                  {ws.name}
                </button>
              ))}
            </div>
            <div className="p-2">
              <button
                onClick={() => {
                  setShowCreateWorkspace(true);
                  setShowWorkspaceMenu(false);
                }}
                className="w-full px-2 py-2 rounded-md text-left text-sm text-dark-300 hover:bg-dark-800 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create Workspace
              </button>
              <button
                onClick={() => {
                  setShowJoinWorkspace(true);
                  setShowWorkspaceMenu(false);
                }}
                className="w-full px-2 py-2 rounded-md text-left text-sm text-dark-300 hover:bg-dark-800 flex items-center gap-2"
              >
                <Users className="w-4 h-4" /> Join Workspace
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Invite code */}
      {currentWorkspace && (
        <button
          onClick={handleCopyInviteCode}
          className="mx-3 mt-3 px-3 py-2 bg-dark-700/50 rounded-lg flex items-center justify-between text-xs hover:bg-dark-700 transition-colors"
        >
          <span className="text-dark-400">
            Invite: <span className="text-dark-300 font-mono">{currentWorkspace.invite_code}</span>
          </span>
          {copiedCode ? (
            <Check className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-dark-500" />
          )}
        </button>
      )}

      {/* Channels */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-dark-400 uppercase tracking-wide">
              Channels
            </span>
            <button
              onClick={() => setShowCreateChannel(true)}
              className="p-1 hover:bg-dark-700 rounded transition-colors"
            >
              <Plus className="w-4 h-4 text-dark-400 hover:text-white" />
            </button>
          </div>
          <div className="space-y-0.5">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setCurrentChannel(channel)}
                className={`w-full px-2 py-1.5 rounded-md flex items-center gap-2 text-sm transition-colors ${
                  currentChannel?.id === channel.id && !dmUser
                    ? 'bg-dark-700 text-white'
                    : 'text-dark-400 hover:text-dark-200 hover:bg-dark-700/50'
                }`}
              >
                <Hash className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{channel.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Direct Messages */}
        <div className="px-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-dark-400 uppercase tracking-wide">
              Direct Messages
            </span>
          </div>
          <div className="space-y-0.5">
            {members
              .filter((m) => m.id !== user?.id)
              .map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleSelectDM(member)}
                  className={`w-full px-2 py-1.5 rounded-md flex items-center gap-2 text-sm transition-colors ${
                    dmUser?.id === member.id
                      ? 'bg-dark-700 text-white'
                      : 'text-dark-400 hover:text-dark-200 hover:bg-dark-700/50'
                  }`}
                >
                  <div className="relative">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-xs font-medium text-white">
                      {member.username.charAt(0).toUpperCase()}
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-dark-800 ${
                        member.status === 'online' ? 'bg-green-500' : 'bg-dark-500'
                      }`}
                    />
                  </div>
                  <span className="truncate">{member.username}</span>
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* User section */}
      <div className="p-3 border-t border-dark-700 bg-dark-850">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center font-medium text-white">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-850" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.username}</p>
            <p className="text-xs text-dark-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-dark-700 rounded-lg transition-colors group"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-dark-400 group-hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* Modals */}
      {showCreateChannel && (
        <CreateChannelModal
          onClose={() => setShowCreateChannel(false)}
          onCreate={handleCreateChannel}
        />
      )}
      {showCreateWorkspace && (
        <CreateWorkspaceModal
          onClose={() => setShowCreateWorkspace(false)}
        />
      )}
      {showJoinWorkspace && (
        <JoinWorkspaceModal
          onClose={() => setShowJoinWorkspace(false)}
        />
      )}
    </div>
  );
}
