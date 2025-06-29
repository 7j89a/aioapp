import React from 'react';

function AuroraBackground() {
    return (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900 -z-10 overflow-hidden">
            <div className="absolute top-[-20%] left-[10%] w-[40rem] h-[40rem] bg-purple-500/20 rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-[-20%] right-[10%] w-[40rem] h-[40rem] bg-cyan-500/20 rounded-full blur-3xl animate-[pulse_12s_ease-in-out_infinite_2s]"></div>
        </div>
    );
}

export default AuroraBackground;