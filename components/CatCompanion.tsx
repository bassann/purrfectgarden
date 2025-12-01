import React from 'react';

interface CatCompanionProps {
  mood: 'happy' | 'neutral' | 'curious' | 'judging';
  hint?: string;
}

export const CatCompanion: React.FC<CatCompanionProps> = ({ mood, hint }) => {
  // 32x32 Pixel Art Grid helper
  // We use simple rects to draw pixels.
  
  const getEyes = () => {
    switch (mood) {
      case 'happy':
        return (
          <g fill="#374151">
            {/* Left ^ */}
            <rect x="11" y="14" width="1" height="1" />
            <rect x="10" y="15" width="1" height="1" />
            <rect x="12" y="15" width="1" height="1" />
            {/* Right ^ */}
            <rect x="20" y="14" width="1" height="1" />
            <rect x="19" y="15" width="1" height="1" />
            <rect x="21" y="15" width="1" height="1" />
            {/* Blush */}
            <rect x="9" y="17" width="2" height="1" fill="#FDA4AF" />
            <rect x="21" y="17" width="2" height="1" fill="#FDA4AF" />
          </g>
        );
      case 'judging': // Flat lines -_-
        return (
          <g fill="#374151">
            <rect x="10" y="15" width="4" height="1" />
            <rect x="18" y="15" width="4" height="1" />
            {/* Angry vein/symbol */}
            <path d="M24 10 h1 v1 h1 v-1 h-1 v-1 h-1 z" fill="#EF4444" />
          </g>
        );
      case 'curious': // O o
        return (
          <g fill="#374151">
            {/* Left Big */}
            <rect x="10" y="14" width="2" height="3" />
            <rect x="12" y="15" width="1" height="1" fill="white" />
            {/* Right Small */}
            <rect x="20" y="15" width="1" height="1" />
          </g>
        );
      default: // Neutral dots
        return (
          <g fill="#374151">
            <rect x="10" y="15" width="2" height="2" />
            <rect x="20" y="15" width="2" height="2" />
          </g>
        );
    }
  };

  const getPaws = () => {
     if (mood === 'happy') {
         return (
             <g fill="white">
                 {/* Hands up */}
                 <rect x="8" y="22" width="3" height="3" />
                 <rect x="21" y="22" width="3" height="3" />
             </g>
         )
     }
     return (
        <g fill="white">
            <rect x="12" y="28" width="3" height="2" />
            <rect x="17" y="28" width="3" height="2" />
        </g>
     );
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Pixel Speech Bubble */}
      {hint && (
        <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 w-64 z-50 animate-bounce-pixel">
          <div className="bg-white border-4 border-slate-800 p-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
             <p className="text-xl text-slate-800 leading-tight text-center font-medium">
               {hint}
             </p>
             {/* Bubble arrow */}
             <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-4 border-b-4 border-slate-800 transform rotate-45"></div>
          </div>
        </div>
      )}

      {/* 32x32 SVG scaled up */}
      <svg 
        width="192" 
        height="192" 
        viewBox="0 0 32 32" 
        className={`transition-transform duration-200 ${mood === 'happy' ? 'animate-bounce-pixel' : ''}`}
      >
        <g transform={mood === 'curious' ? 'rotate(-5, 16, 16)' : ''}>
          
          {/* Tail */}
          <path d="M22 24 h2 v-2 h2 v-4 h-2 v-2 h-2" fill="none" stroke="#F97316" strokeWidth="2" />
          
          {/* Main Body Color (Orange) */}
          <path d="
            M10 20 
            h12 v9 
            h-12 v-9 
            z" 
            fill="#FB923C" 
          />
          
          {/* Head Main */}
          <path d="
            M6 10 
            h20 v12 
            h-20 v-12 
            z" 
            fill="#FB923C" 
          />
          
          {/* Ears */}
          <rect x="6" y="7" width="4" height="3" fill="#FB923C" />
          <rect x="22" y="7" width="4" height="3" fill="#FB923C" />
          <rect x="7" y="8" width="2" height="2" fill="#FCA5A5" />
          <rect x="23" y="8" width="2" height="2" fill="#FCA5A5" />

          {/* Stripes/Details */}
          <rect x="15" y="10" width="2" height="2" fill="#EA580C" />
          <rect x="6" y="15" width="2" height="1" fill="#EA580C" />
          <rect x="24" y="15" width="2" height="1" fill="#EA580C" />

          {/* White Snout/Belly */}
          <rect x="13" y="18" width="6" height="3" fill="#FFF7ED" />
          <rect x="12" y="22" width="8" height="6" fill="#FFF7ED" />

          {/* Face */}
          {getEyes()}
          
          {/* Nose */}
          <rect x="15" y="18" width="2" height="1" fill="#F43F5E" />

          {/* Paws */}
          {getPaws()}

          {/* Whiskers */}
          <g fill="#9CA3AF">
             <rect x="4" y="17" width="3" height="1" />
             <rect x="4" y="19" width="3" height="1" />
             <rect x="25" y="17" width="3" height="1" />
             <rect x="25" y="19" width="3" height="1" />
          </g>

        </g>
      </svg>
      
      {/* Nameplate Pixel */}
      <div className="mt-2 bg-orange-100 border-2 border-orange-500 px-4 py-1 shadow-[2px_2px_0px_0px_rgba(249,115,22,1)]">
        <span className="text-xl text-orange-700">Prof. Tassu</span>
      </div>
    </div>
  );
};