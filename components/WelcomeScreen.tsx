import React from 'react';
import { Persona } from '../types';
import { BotMessageSquareIcon, UserIcon } from './Icons'; // Assuming UserIcon can be repurposed

interface WelcomeScreenProps {
  personas: Persona[];
  onSelectPersona: (persona: Persona) => void;
}

interface PersonaCardProps {
  persona: Persona;
  onClick: () => void;
}

function PersonaCard({ persona, onClick }: PersonaCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-left w-full max-w-sm
               hover:bg-gray-700/70 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1"
    >
      <h3 className="text-xl font-bold text-cyan-400 mb-2">{persona.name}</h3>
      <p className="text-gray-400">{persona.description}</p>
    </button>
  );
}

function WelcomeScreen({ personas, onSelectPersona }: WelcomeScreenProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-8 text-center">
      <div className="flex items-center gap-4 mb-4">
        <BotMessageSquareIcon className="w-16 h-16 text-cyan-400" />
      </div>
      <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
        Gemini AI Persona Chat
      </h1>
      <p className="text-xl text-gray-300 mb-12">
        Choose your AI companion and start a conversation.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {personas.map((p) => (
          <PersonaCard key={p.id} persona={p} onClick={() => onSelectPersona(p)} />
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;