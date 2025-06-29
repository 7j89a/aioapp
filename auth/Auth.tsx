import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { LoaderCircleIcon, BotMessageSquareIcon } from '../components/Icons';

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) setError(error.message);
        } else {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username,
                    }
                }
            });
            if (error) {
                 setError(error.message);
            } else {
                 setMessage("Success! Please check your email for a verification link.");
            }
        }
        setLoading(false);
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <BotMessageSquareIcon className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
                        Welcome to Gemini Chat
                    </h1>
                    <p className="text-gray-400 mt-2">{isLogin ? "Sign in to continue" : "Create an account to begin"}</p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleAuthAction} className="space-y-6">
                         {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="w-full p-3 bg-gray-900/70 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    required
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full p-3 bg-gray-900/70 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full p-3 bg-gray-900/70 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 p-3 bg-gradient-to-br from-purple-600 to-cyan-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity duration-200 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
                        >
                            {loading && <LoaderCircleIcon className="animate-spin w-5 h-5" />}
                            {isLogin ? 'Sign In' : 'Sign Up'}
                        </button>
                    </form>

                    {error && <p className="mt-4 text-center text-red-400">{error}</p>}
                    {message && <p className="mt-4 text-center text-green-400">{message}</p>}

                    <p className="mt-6 text-center text-sm text-gray-400">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null); }} className="font-semibold text-cyan-400 hover:text-cyan-300 ml-2">
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;