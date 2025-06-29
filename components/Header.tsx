import React from 'react';
import { BotMessageSquareIcon, RefreshCwIcon, LogOutIcon } from './Icons';

interface HeaderProps {
  username: string | null;
  onNewChat: () => void;
  onLogout: () => void;
  isLoading: boolean;
}

function Header({ username, onNewChat, onLogout, isLoading }: HeaderProps) {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm p-4 border-b border-gray-700/50 flex justify-between items-center sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full">
            <BotMessageSquareIcon className="w-6 h-6 text-white" />
        </div>
        <div>
            <h1 className="text-lg font-bold text-gray-100">Gemini AI Chat</h1>
            <p className="text-sm text-cyan-400 truncate">{username || 'Loading...'}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
         <button
            onClick={onNewChat}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg shadow-lg
                       hover:bg-purple-700 transition-all duration-200 transform hover:scale-105
                       disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none"
            aria-label="Start a new chat"
          >
            <RefreshCwIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">New Chat</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 bg-red-600/80 text-white rounded-lg shadow-lg
                       hover:bg-red-700/80 transition-all duration-200 transform hover:scale-105"
            aria-label="Logout"
          >
            <LogOutIcon className="w-4 h-4" />
             <span className="hidden sm:inline">Logout</span>
          </button>
      </div>
    </header>
  );
};

export default Header;