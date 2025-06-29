import React, { useState, useCallback, useEffect } from 'react';
import { Message, MessageRole } from './types';
import { chatService } from './services/geminiService';
import { supabase } from './services/supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import Auth from './auth/Auth';
import AuroraBackground from './components/AuroraBackground';

function App() {
    const [session, setSession] = useState<Session | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const manageProfile = async (user: User | null) => {
        if (!user) return;

        // Check if a profile already exists.
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();

        if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means no rows found
             console.error("Error fetching profile:", profileError);
             setError("Could not fetch your user profile. Please try refreshing.");
             return;
        }

        if (profile) {
            setUsername(profile.username);
        } else {
            // If no profile, create one.
            const newUsername = user.user_metadata.username;
            if (newUsername) {
                const { data: newProfile, error: insertError } = await supabase
                    .from('profiles')
                    .insert({ id: user.id, username: newUsername })
                    .select('username')
                    .single();

                if (insertError) {
                    console.error("Error creating profile:", insertError);
                    setError(`Failed to create your profile. Error: ${insertError.message}`);
                } else if (newProfile) {
                    setUsername(newProfile.username);
                }
            } else {
                setError("Could not find a username to create a profile. Please contact support.");
            }
        }
    };


    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session);
            if (session) {
                await manageProfile(session.user);
                initializeChat();
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
             if (_event === 'SIGNED_IN' && session) {
                await manageProfile(session.user);
                initializeChat();
            }
            if (_event === 'SIGNED_OUT') {
                setMessages([]);
                setUsername(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const initializeChat = () => {
        chatService.startNewChat();
        setMessages([
            {
                id: `welcome-${Date.now()}`,
                role: MessageRole.MODEL,
                content: "Hello! I am Gemini, your helpful AI assistant. How can I assist you today?",
            },
        ]);
        setError(null);
    };
    
    const handleNewChat = useCallback(() => {
        initializeChat();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const handleSendMessage = useCallback(async (text: string) => {
        setIsLoading(true);
        setError(null);

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: MessageRole.USER,
            content: text,
        };
        
        const modelMessagePlaceholder: Message = {
            id: `model-${Date.now()}`,
            role: MessageRole.MODEL,
            content: '',
        };
        
        setMessages(prev => [...prev, userMessage, modelMessagePlaceholder]);

        try {
            const stream = chatService.sendMessageStream(text);
            
            for await (const chunk of stream) {
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage && lastMessage.role === MessageRole.MODEL) {
                        lastMessage.content += chunk;
                    }
                    return newMessages;
                });
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Error: ${errorMessage}`);
            setMessages(prev => {
                 const newMessages = [...prev];
                 const lastMessage = newMessages[newMessages.length - 1];
                 if (lastMessage && lastMessage.role === MessageRole.MODEL && lastMessage.content === '') {
                    lastMessage.role = MessageRole.SYSTEM;
                    lastMessage.content = `Sorry, something went wrong. ${errorMessage}`;
                 }
                 return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="h-screen w-screen bg-transparent text-gray-200 flex flex-col font-sans overflow-hidden">
            <AuroraBackground />
            {!session ? (
                <Auth />
            ) : (
                <>
                    <Header username={username} onNewChat={handleNewChat} onLogout={handleLogout} isLoading={isLoading} />
                    <main className="flex-1 flex flex-col overflow-hidden">
                        <ChatWindow messages={messages} isLoading={isLoading} />
                        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                    </main>
                </>
            )}
        </div>
    );
};

export default App;