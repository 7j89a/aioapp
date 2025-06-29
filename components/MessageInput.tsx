import React, { useState } from 'react';
import { SendIcon, LoaderCircleIcon } from './Icons';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [input, setInput] = useState('');

  const doSubmit = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSubmit();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        doSubmit();
    }
  };

  return (
    <div className="p-4 bg-gray-900/50 backdrop-blur-sm border-t border-gray-700/50 shrink-0">
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className="flex-1 p-3 bg-gray-800/70 text-gray-200 rounded-lg border border-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
          disabled={isLoading}
          aria-label="Chat message input"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-gradient-to-br from-purple-600 to-cyan-600 text-white p-3 rounded-full 
                     hover:opacity-90 transition-all duration-200 transform hover:scale-110
                     disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:transform-none
                     flex items-center justify-center w-12 h-12 shrink-0"
          aria-label={isLoading ? "Sending message" : "Send message"}
        >
          {isLoading ? (
            <LoaderCircleIcon className="w-6 h-6 animate-spin" />
          ) : (
            <SendIcon className="w-6 h-6" />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;