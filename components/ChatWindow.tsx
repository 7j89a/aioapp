import React, { useEffect, useRef } from 'react';
import { Message, MessageRole } from '../types';
import { BotIcon, UserIcon, AlertTriangleIcon } from './Icons';

const getRoleStyles = (role: MessageRole) => {
    switch (role) {
        case MessageRole.USER:
            return {
                container: 'justify-end',
                bubble: 'bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-br-none',
                icon: <UserIcon className="w-8 h-8 p-1.5 text-white bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-md" />,
            };
        case MessageRole.MODEL:
            return {
                container: 'justify-start',
                bubble: 'bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 text-gray-200 rounded-bl-none',
                icon: <BotIcon className="w-8 h-8 p-1.5 text-white bg-gradient-to-br from-cyan-600 to-purple-600 rounded-full shadow-md" />,
            };
        case MessageRole.SYSTEM:
        default:
            return {
                container: 'justify-start',
                bubble: 'bg-red-500/20 text-red-200 border border-red-500/30 rounded-lg',
                icon: <AlertTriangleIcon className="w-8 h-8 p-1.5 bg-red-500 text-white rounded-full shadow-md" />,
            };
    }
};

function BlinkingCursor() {
    return <span className="inline-block w-2.5 h-6 ml-1 bg-cyan-400 animate-pulse" />;
};

function RenderedContent({ content }: { content: string }) {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return (
        <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-pre:bg-gray-800/70 prose-pre:p-0 prose-pre:rounded-lg">
            {parts.map((part, index) => {
                if (part.startsWith('```')) {
                    const codeBlock = part.replace(/```(\w*\n)?/g, '').replace(/```$/, '');
                    const langMatch = part.match(/```(\w+)/);
                    const lang = langMatch ? langMatch[1] : '';

                    return (
                        <div key={index} className="bg-gray-900/70 rounded-md my-4 text-sm font-mono border border-gray-700">
                           {lang && (
                               <div className="flex justify-between items-center px-4 py-1.5 bg-gray-900/50 rounded-t-md border-b border-gray-700">
                                   <span className="text-gray-400 text-xs">{lang}</span>
                               </div>
                           )}
                           <pre className="p-4 overflow-x-auto whitespace-pre-wrap break-words">
                               <code>{codeBlock.trim()}</code>
                           </pre>
                        </div>
                    );
                } else {
                    return <div key={index} className="whitespace-pre-wrap">{part}</div>;
                }
            })}
        </div>
    );
};

interface ChatWindowProps {
    messages: Message[];
    isLoading: boolean;
}

function ChatWindow({ messages, isLoading }: ChatWindowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <div ref={scrollRef} className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
            {messages.map((msg, index) => {
                const { container, bubble, icon } = getRoleStyles(msg.role);
                const isLastModelMessage = index === messages.length - 1 && msg.role === MessageRole.MODEL;

                return (
                    <div key={msg.id} className={`flex items-start gap-3 md:gap-4 ${container} animate-[fadeIn_0.5s_ease-out]`}>
                        {msg.role !== MessageRole.USER && <div className="shrink-0">{icon}</div>}
                        <div className={`max-w-xl lg:max-w-3xl p-4 rounded-xl shadow-lg ${bubble}`}>
                            <RenderedContent content={msg.content} />
                            {isLastModelMessage && isLoading && <BlinkingCursor />}
                        </div>
                        {msg.role === MessageRole.USER && <div className="shrink-0">{icon}</div>}
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatWindow;