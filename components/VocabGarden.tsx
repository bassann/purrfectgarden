
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CatCompanion } from './CatCompanion';
import { GrowingPlant } from './GrowingPlant';
import { fetchNewWord } from '../services/geminiService';
import { VocabularyWord, PlantStage, GameState } from '../types';

const calculatePlantStage = (points: number): PlantStage => {
  if (points >= 10) return PlantStage.BLOOM;
  if (points >= 7) return PlantStage.BUD;
  if (points >= 4) return PlantStage.SAPLING;
  if (points >= 2) return PlantStage.SPROUT;
  return PlantStage.SEED;
};

// Retro Sound Synthesizer
const playRetroSound = (type: 'success' | 'failure' | 'bloom') => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  const now = ctx.currentTime;

  if (type === 'failure') {
    // HISS Sound (White Noise + Highpass + Envelope)
    const bufferSize = ctx.sampleRate * 0.4; // 0.4 seconds
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;
    
    noise.connect(filter);
    filter.connect(gain);
    
    // Sharp attack, fast decay
    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    noise.start(now);
    noise.stop(now + 0.4);
  } else {
    const osc = ctx.createOscillator();
    osc.connect(gain);

    if (type === 'success') {
       // MEOW Sound (Triangle wave, pitch bend up then down)
       osc.type = 'triangle';
       osc.frequency.setValueAtTime(400, now);
       osc.frequency.linearRampToValueAtTime(800, now + 0.15); // Me-
       osc.frequency.linearRampToValueAtTime(300, now + 0.4);  // -ow
       
       gain.gain.setValueAtTime(0, now);
       gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
       gain.gain.linearRampToValueAtTime(0, now + 0.4);
       
       osc.start(now);
       osc.stop(now + 0.4);
    } else if (type === 'bloom') {
       // Magical Glissando
       osc.type = 'sine';
       osc.frequency.setValueAtTime(400, now);
       osc.frequency.linearRampToValueAtTime(1200, now + 0.5);
       gain.gain.setValueAtTime(0.1, now);
       gain.gain.linearRampToValueAtTime(0.001, now + 1.5);
       osc.start(now);
       osc.stop(now + 1.5);
    }
  }
};

export const VocabGarden: React.FC = () => {
  const [currentWord, setCurrentWord] = useState<VocabularyWord | null>(null);
  const [userGuess, setUserGuess] = useState('');
  const [gameState, setGameState] = useState<GameState>(GameState.LOADING);
  
  // Initialize from LocalStorage
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem('vocab_score');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [totalBlooms, setTotalBlooms] = useState(() => {
    const saved = localStorage.getItem('vocab_blooms');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isWrongGuess, setIsWrongGuess] = useState(false);
  
  // Animation States
  const [showWatering, setShowWatering] = useState(false);
  const [showScratch, setShowScratch] = useState(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('vocab_score', score.toString());
  }, [score]);

  useEffect(() => {
    localStorage.setItem('vocab_blooms', totalBlooms.toString());
  }, [totalBlooms]);

  const loadWord = useCallback(async () => {
    setGameState(GameState.LOADING);
    setFeedbackMessage('');
    setShowHint(false);
    setUserGuess('');
    setIsWrongGuess(false);
    setShowWatering(false);
    setShowScratch(false);
    
    try {
      const wordData = await fetchNewWord('medium');
      setCurrentWord(wordData);
      setGameState(GameState.PLAYING);
    } catch (error) {
      console.error(error);
      setGameState(GameState.ERROR);
    }
  }, []);

  useEffect(() => {
    loadWord();
  }, [loadWord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWord) return;

    const normalizedGuess = userGuess.trim().toLowerCase();
    const normalizedTarget = currentWord.word.trim().toLowerCase();

    if (normalizedGuess === normalizedTarget) {
      handleCorrectGuess();
    } else {
      handleIncorrectGuess();
    }
  };

  const handleCorrectGuess = () => {
    setGameState(GameState.SUCCESS);
    setFeedbackMessage(`Oikein! Vastaus oli "${currentWord?.word}".`);
    setIsWrongGuess(false);
    
    // Trigger Effects
    playRetroSound('success');
    setShowWatering(true);
    setTimeout(() => setShowWatering(false), 2000);
    
    const nextScore = score + (showHint ? 1 : 2);
    
    if (nextScore >= 10) { // Bloom at 10
      setTimeout(() => playRetroSound('bloom'), 500);
      setTotalBlooms(prev => prev + 1);
      setScore(0);
      setFeedbackMessage(`Mahtavaa! Kasvatit kokonaisen kukan! Aloitetaan uusi siemen...`);
    } else {
      setScore(nextScore);
    }
  };

  const handleIncorrectGuess = () => {
    setFeedbackMessage("Ei aivan! Lue vihje tai esimerkki uudelleen.");
    setScore(Math.max(0, score - 1));
    setIsWrongGuess(true);
    
    // Trigger Effects
    playRetroSound('failure');
    setShowScratch(true);
    setTimeout(() => setShowScratch(false), 500);
  };

  const handleReveal = () => {
      setGameState(GameState.SUCCESS);
      setFeedbackMessage(`Vastaus oli "${currentWord?.word}". Kokeillaan toista!`);
      setScore(Math.max(0, score - 2));
      setIsWrongGuess(false);
  };

  const plantStage = calculatePlantStage(score);
  
  // Determine Cat Mood
  let catMood: 'happy' | 'neutral' | 'curious' | 'judging' = 'neutral';
  if (gameState === GameState.SUCCESS) catMood = 'happy';
  else if (isWrongGuess) catMood = 'judging';
  else if (showHint) catMood = 'curious';
  else catMood = 'neutral';

  // Mask example word for display (Frontend safeguard)
  const getMaskedExample = () => {
    if (!currentWord) return "";
    const target = currentWord.word;
    const regex = new RegExp(target.substring(0, target.length - 1), 'gi'); // Simple stem matching
    return currentWord.example.replace(regex, "_______");
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Header Stats */}
        <div className="md:col-span-12 flex flex-col md:flex-row justify-between items-center mb-4 md:mb-0 gap-4">
          <div className="bg-white px-4 py-2 border-4 border-pink-300 shadow-[4px_4px_0px_0px_rgba(249,168,212,1)] flex items-center gap-2">
            <span className="text-2xl">🌸</span>
            <span className="text-2xl font-bold text-slate-700">{totalBlooms}</span>
          </div>
          <div className="bg-white px-4 py-2 border-4 border-green-300 shadow-[4px_4px_0px_0px_rgba(134,239,172,1)] flex items-center gap-2">
            <span className="text-2xl">💧</span>
            <span className="text-2xl font-bold text-slate-700">{score}/10</span>
          </div>
        </div>

        {/* Garden Visual */}
        <div className="md:col-span-4 flex flex-col items-center justify-end bg-white border-4 border-slate-800 shadow-[8px_8px_0px_0px_rgba(30,41,59,0.3)] min-h-[400px] relative overflow-hidden group">
           <div className="absolute inset-0 bg-blue-50 opacity-50 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#93C5FD 2px, transparent 2px)', backgroundSize: '16px 16px' }}></div>
           
           {/* Plant */}
           <div className="z-10 relative">
              <GrowingPlant stage={plantStage} />
              
              {/* Scratch Animation Overlay - Claw Marks */}
              {showScratch && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                      <svg width="200" height="200" viewBox="0 0 100 100" className="animate-pulse">
                          <g transform="rotate(-15, 50, 50)">
                              <path d="M30 10 Q 25 50 20 90" stroke="#DC2626" strokeWidth="6" strokeLinecap="round" fill="none" />
                              <path d="M55 5 Q 50 50 45 95" stroke="#DC2626" strokeWidth="6" strokeLinecap="round" fill="none" />
                              <path d="M80 10 Q 75 50 70 90" stroke="#DC2626" strokeWidth="6" strokeLinecap="round" fill="none" />
                          </g>
                      </svg>
                  </div>
              )}

              {/* Watering Can Animation Overlay */}
              {showWatering && (
                  <div className="absolute -top-16 -right-12 z-20 animate-bounce">
                      <svg width="100" height="100" viewBox="0 0 32 32" className="drop-shadow-lg pixel-art transform -rotate-12">
                          {/* Can Body */}
                          <path d="M6 12 h14 v10 h-14 z" fill="#60A5FA" />
                          <path d="M20 12 h4 v-2 h-4 z" fill="#60A5FA" /> {/* Spout base */}
                          <path d="M24 10 h2 v-1 h-2 z" fill="#60A5FA" /> {/* Spout tip */}
                          <path d="M4 14 h2 v6 h-2 z" fill="#2563EB" /> {/* Handle */}
                          <rect x="6" y="12" width="14" height="2" fill="#93C5FD" /> {/* Highlight */}
                          {/* Water Drops */}
                          <rect x="26" y="12" width="2" height="2" fill="#3B82F6" className="animate-ping" />
                          <rect x="24" y="16" width="2" height="2" fill="#3B82F6" className="animate-ping" style={{animationDelay: '0.1s'}} />
                          <rect x="22" y="20" width="2" height="2" fill="#3B82F6" className="animate-ping" style={{animationDelay: '0.2s'}} />
                      </svg>
                  </div>
              )}
           </div>

           <div className="mt-8 mb-6 text-center z-10 bg-white/90 px-4 py-2 border-2 border-slate-800 mx-4 shadow-sm">
             <h3 className="text-2xl text-green-800 uppercase mb-1">Puutarhasi</h3>
             <p className="text-slate-600 text-xl">
               {plantStage === PlantStage.SEED && "Vain yksinäinen siemen..."}
               {plantStage === PlantStage.SPROUT && "Se itää!"}
               {plantStage === PlantStage.SAPLING && "Se kasvaa!"}
               {plantStage === PlantStage.BUD && "Melkein valmis!"}
               {plantStage === PlantStage.BLOOM && "Katso tuota kukkaa!"}
             </p>
           </div>
        </div>

        {/* Game Area */}
        <div className="md:col-span-8 flex flex-col gap-6">
          <div className="flex justify-center md:justify-start pl-0 md:pl-10 mt-4 md:mt-0 h-48 relative z-20">
             <CatCompanion 
               mood={catMood} 
               hint={showHint && currentWord ? currentWord.hint : gameState === GameState.SUCCESS ? "Hienoa työtä!" : undefined} 
             />
          </div>

          <div className="bg-white border-4 border-slate-800 shadow-[8px_8px_0px_0px_rgba(30,41,59,0.3)] p-6 md:p-8 relative">
             {gameState === GameState.LOADING ? (
               <div className="h-64 flex flex-col items-center justify-center space-y-4">
                 <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 animate-spin"></div>
                 <p className="text-slate-400 text-2xl">Ladataan...</p>
               </div>
             ) : gameState === GameState.ERROR ? (
                <div className="h-64 flex flex-col items-center justify-center text-center">
                   <p className="text-red-500 mb-4 text-2xl">Hups! Virhe.</p>
                   <button onClick={loadWord} className="px-6 py-2 bg-indigo-600 text-white border-b-4 border-indigo-900 active:border-b-0 active:translate-y-1">Yritä uudelleen</button>
                </div>
             ) : (
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-2">
                        {currentWord?.category && (
                            <span className="inline-block px-3 py-1 bg-purple-200 border-2 border-purple-400 text-purple-800 text-lg uppercase">
                            {currentWord.category}
                            </span>
                        )}
                        <span className="inline-block px-3 py-1 bg-slate-200 border-2 border-slate-400 text-slate-600 text-lg uppercase">
                        {currentWord?.difficulty}
                        </span>
                    </div>
                  </div>

                  {/* Question/Definition */}
                  <h2 className="text-3xl md:text-4xl text-slate-800 mb-6 leading-relaxed">
                    {currentWord?.definition}
                  </h2>

                  {/* Context/Example Box */}
                  <div className="bg-yellow-50 p-4 border-2 border-yellow-200 border-dashed mb-8 relative">
                    <span className="absolute -top-3 left-4 bg-yellow-100 px-2 text-yellow-800 text-sm font-bold border border-yellow-200">ESIMERKKI</span>
                    <p className="text-slate-700 text-2xl">
                      "{getMaskedExample()}"
                    </p>
                  </div>

                  {gameState !== GameState.SUCCESS && (
                     <form onSubmit={handleSubmit} className="space-y-6">
                        <input 
                            type="text" 
                            value={userGuess}
                            onChange={(e) => {
                                setUserGuess(e.target.value);
                                if (isWrongGuess) setIsWrongGuess(false);
                            }}
                            placeholder="Kirjoita vastaus..."
                            className={`w-full px-6 py-4 text-4xl font-['VT323'] bg-white border-4 outline-none transition-all placeholder:text-slate-300 ${isWrongGuess ? 'border-red-400 bg-red-50 text-red-900' : 'border-indigo-200 focus:border-indigo-500'}`}
                            autoFocus
                          />
                        {feedbackMessage && (
                          <div className={`p-2 border-2 text-center text-xl ${feedbackMessage.includes('Oikein') ? 'bg-green-100 border-green-400 text-green-800' : 'bg-orange-100 border-orange-400 text-orange-800'}`}>
                            {feedbackMessage}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-3 justify-between items-center pt-2">
                           <button 
                             type="button"
                             onClick={() => setShowHint(true)}
                             disabled={showHint}
                             className={`px-4 py-2 text-xl transition-colors ${showHint ? 'text-slate-300 cursor-default' : 'text-indigo-500 hover:text-indigo-700 underline'}`}
                           >
                             [?] Vihje
                           </button>
                           <div className="flex gap-4">
                             <button type="button" onClick={handleReveal} className="px-6 py-3 text-slate-400 hover:text-slate-600 text-xl uppercase tracking-wide hover:underline">Luovutan</button>
                             <button type="submit" className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-2xl uppercase tracking-widest border-b-4 border-r-4 border-indigo-900 active:border-b-0 active:translate-y-1">Tarkista</button>
                           </div>
                        </div>
                     </form>
                  )}

                  {gameState === GameState.SUCCESS && (
                    <div className="text-center space-y-6">
                      <div className="p-6 bg-green-100 border-4 border-green-500">
                         <p className="text-4xl text-green-800 mb-2">{currentWord?.word}</p>
                         <p className="text-green-700 text-xl">{feedbackMessage}</p>
                      </div>
                      <button onClick={loadWord} className="w-full md:w-auto px-10 py-4 bg-green-500 hover:bg-green-600 text-white text-2xl uppercase tracking-widest border-b-4 border-r-4 border-green-800 active:border-b-0 active:translate-y-1 mx-auto flex items-center justify-center gap-3">
                        <span>Seuraava</span><span>&gt;</span>
                      </button>
                    </div>
                  )}
               </div>
             )}
          </div>
        </div>
    </div>
  );
};
