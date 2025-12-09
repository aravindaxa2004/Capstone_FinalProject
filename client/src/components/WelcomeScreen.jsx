import { MessageSquare, Hash, Users, Zap } from 'lucide-react';

export default function WelcomeScreen() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-lg text-center animate-fadeIn">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 mb-6">
          <MessageSquare className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          Welcome to ChatHub
        </h1>
        
        <p className="text-dark-400 mb-8">
          Select a channel from the sidebar to start chatting, or send a direct message to a team member.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-dark-800 rounded-xl border border-dark-700">
            <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center mb-3 mx-auto">
              <Hash className="w-5 h-5 text-primary-400" />
            </div>
            <h3 className="font-medium text-white mb-1">Channels</h3>
            <p className="text-sm text-dark-500">
              Organize conversations by topic
            </p>
          </div>

          <div className="p-4 bg-dark-800 rounded-xl border border-dark-700">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-3 mx-auto">
              <Users className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="font-medium text-white mb-1">Direct Messages</h3>
            <p className="text-sm text-dark-500">
              Chat privately with teammates
            </p>
          </div>

          <div className="p-4 bg-dark-800 rounded-xl border border-dark-700">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center mb-3 mx-auto">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="font-medium text-white mb-1">Real-time</h3>
            <p className="text-sm text-dark-500">
              Instant message delivery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
