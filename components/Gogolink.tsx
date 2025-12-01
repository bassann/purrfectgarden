
import React, { useState, useEffect, useRef } from 'react';
import { WordPair, GameState } from '../types';
import { fetchGogolinkPairs } from '../services/geminiService';
import { GOGOLINK_LEVELS } from '../services/staticData';

export const Gogolink: React.FC = () => {
    const [level, setLevel] = useState(1);
    const [unlockedLevel, setUnlockedLevel] = useState(1);
    const [pairs, setPairs] = useState<WordPair[]>([]);
    const [gameState, setGameState] = useState<GameState>(GameState.MENU);
    
    // Game Logic
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<'text' | 'emoji' | null>(null);
    const [solvedIds, setSolvedIds] = useState<string[]>([]);
    const [gridCards, setGridCards] = useState<Array<{id: string, content: string, type: 'text' | 'emoji'}>>([]);
    
    // Tools
    const [hintsRemaining, setHintsRemaining] = useState(3);
    const [timeLeft, setTimeLeft] = useState(60);
    const timerRef = useRef<number | null>(null);

    // Initial Load
    useEffect(() => {
        // Start in Menu
        setGameState(GameState.MENU);
    }, []);

    // Timer Logic
    useEffect(() => {
        if (gameState === GameState.PLAYING) {
            timerRef.current = window.setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleGameOver();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) window.clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) window.clearInterval(timerRef.current);
        };
    }, [gameState]);

    const handleGameOver = () => {
        setGameState(GameState.GAMEOVER);
        if (timerRef.current) window.clearInterval(timerRef.current);
    };

    const startGame = async (lvl: number) => {
        setLevel(lvl);
        setGameState(GameState.LOADING);
        setSolvedIds([]);
        setSelectedId(null);
        setSelectedType(null);
        
        try {
            const data = await fetchGogolinkPairs(lvl);
            setPairs(data);
            
            // Set Time Limit from static data
            const lvlData = GOGOLINK_LEVELS.find(l => l.level === lvl);
            setTimeLeft(lvlData ? lvlData.timeLimit : 60);

            // Create cards
            const cards: Array<{id: string, content: string, type: 'text' | 'emoji'}> = [];
            data.forEach(p => {
                cards.push({ id: p.id, content: p.finnish, type: 'text' });
                cards.push({ id: p.id, content: p.match, type: 'emoji' });
            });
            
            setGridCards(cards.sort(() => Math.random() - 0.5));
            setGameState(GameState.PLAYING);
        } catch (error) {
            console.error(error);
            setGameState(GameState.ERROR);
        }
    };

    const handleCardClick = (id: string, type: 'text' | 'emoji') => {
        if (gameState !== GameState.PLAYING) return;
        if (solvedIds.includes(id)) return; 
        
        // If nothing selected, select this
        if (!selectedId) {
            setSelectedId(id);
            setSelectedType(type);
            return;
        }

        // Deselect if same card
        if (selectedId === id && selectedType === type) {
            setSelectedId(null);
            setSelectedType(null);
            return;
        }

        // Switch selection if same type
        if (selectedType === type) {
            setSelectedId(id);
            setSelectedType(type);
            return;
        }

        // Check match
        if (selectedId === id) {
            // Match!
            const newSolved = [...solvedIds, id];
            setSolvedIds(newSolved);
            setSelectedId(null);
            setSelectedType(null);

            // Check Win
            if (newSolved.length === pairs.length) {
                handleLevelComplete();
            }
        } else {
            // Mismatch
            // Briefly show red? For now just reset
            setSelectedId(null);
            setSelectedType(null);
        }
    };

    const handleLevelComplete = () => {
        setGameState(GameState.SUCCESS);
        if (level === unlockedLevel && level < 8) {
            setUnlockedLevel(l => l + 1);
        }
        // Bonus hint for completing a level
        setHintsRemaining(h => h + 1);
    };

    const handleShuffle = () => {
        setGridCards(prev => [...prev].sort(() => Math.random() - 0.5));
    };

    const handleHint = () => {
        if (hintsRemaining <= 0 || solvedIds.length === pairs.length) return;
        
        // Find an unsolved pair
        const unsolvedPair = pairs.find(p => !solvedIds.includes(p.id));
        if (unsolvedPair) {
            setSelectedId(unsolvedPair.id);
            setSelectedType('text'); // Select the text part
            setHintsRemaining(h => h - 1);
        }
    };

    const handlePause = () => {
        if (gameState === GameState.PLAYING) setGameState(GameState.PAUSED);
        else if (gameState === GameState.PAUSED) setGameState(GameState.PLAYING);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 select-none">
            {/* Header / HUD */}
            <div className="flex justify-between items-center mb-8 bg-white/50 backdrop-blur-sm p-4 rounded-3xl shadow-sm border border-stone-200">
                <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-stone-600">TASO {level}</span>
                    <span className="text-stone-300">|</span>
                    <span className={`text-3xl font-mono ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-stone-800'}`}>
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                </div>
                <div className="flex gap-3">
                    <button 
                         onClick={handleHint}
                         disabled={hintsRemaining === 0 || gameState !== GameState.PLAYING}
                         className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 disabled:opacity-50 transition-all font-bold shadow-sm"
                    >
                        <span>💡</span>
                        <span>{hintsRemaining}</span>
                    </button>
                    <button 
                        onClick={handlePause}
                        disabled={gameState !== GameState.PLAYING && gameState !== GameState.PAUSED}
                        className="w-10 h-10 flex items-center justify-center bg-stone-200 text-stone-600 rounded-full hover:bg-stone-300 transition-all shadow-sm"
                    >
                        {gameState === GameState.PAUSED ? '▶' : '⏸'}
                    </button>
                </div>
            </div>

            {/* Menu View */}
            {gameState === GameState.MENU && (
                <div className="text-center py-12">
                    <h2 className="text-4xl text-stone-700 font-bold mb-10 tracking-wide">VALITSE TASO</h2>
                    <div className="grid grid-cols-4 gap-6 max-w-lg mx-auto">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(l => (
                            <button
                                key={l}
                                onClick={() => startGame(l)}
                                disabled={l > unlockedLevel}
                                className={`h-20 text-2xl font-bold rounded-2xl shadow-sm transition-all transform hover:scale-105 active:scale-95
                                    ${l <= unlockedLevel 
                                        ? 'bg-white text-stone-800 ring-2 ring-stone-200 hover:ring-cyan-300' 
                                        : 'bg-stone-100 text-stone-300 cursor-not-allowed'}
                                `}
                            >
                                {l}
                                {l > unlockedLevel && <span className="block text-sm text-stone-300">🔒</span>}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Loading / Error Views */}
            {gameState === GameState.LOADING && (
                <div className="h-64 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-500 animate-spin rounded-full"></div>
                    <p className="mt-4 text-stone-400">Valmistellaan kortteja...</p>
                </div>
            )}
            
            {gameState === GameState.ERROR && (
                <div className="text-center py-12">
                     <p className="text-red-500 text-2xl mb-4">Virhe ladattaessa tasoa.</p>
                     <button onClick={() => setGameState(GameState.MENU)} className="px-6 py-2 bg-stone-200 rounded-lg">Takaisin</button>
                </div>
            )}

            {/* Game Over Modal */}
            {gameState === GameState.GAMEOVER && (
                 <div className="absolute inset-0 bg-stone-900/40 flex flex-col items-center justify-center z-50 animate-in fade-in backdrop-blur-sm rounded-3xl">
                    <div className="bg-white p-12 rounded-3xl shadow-2xl text-center transform scale-110">
                        <h2 className="text-5xl text-rose-500 font-bold mb-4">AIKA LOPPUI!</h2>
                        <p className="text-stone-500 text-2xl mb-8">Voi ei! Kello voitti tällä kertaa.</p>
                        <div className="flex gap-4 justify-center">
                            <button onClick={() => setGameState(GameState.MENU)} className="px-8 py-3 bg-stone-200 text-stone-700 rounded-xl hover:bg-stone-300 transition-colors">Valikko</button>
                            <button onClick={() => startGame(level)} className="px-8 py-3 bg-cyan-500 text-white rounded-xl shadow-lg shadow-cyan-200 hover:bg-cyan-600 transition-all">Yritä Uudelleen</button>
                        </div>
                    </div>
                 </div>
            )}

            {/* Paused Modal */}
            {gameState === GameState.PAUSED && (
                 <div className="absolute inset-0 bg-stone-900/20 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
                    <button onClick={handlePause} className="px-12 py-6 bg-white text-stone-800 text-3xl font-bold rounded-full shadow-xl hover:scale-105 transition-transform">
                        Jatka Peliä ▶
                    </button>
                 </div>
            )}

            {/* Success View */}
            {gameState === GameState.SUCCESS && (
                 <div className="text-center py-16 bg-white rounded-3xl shadow-xl animate-in zoom-in duration-300">
                    <p className="text-6xl mb-2">🎉</p>
                    <p className="text-4xl mb-8 text-stone-800 font-bold">Taso {level} Läpäisty!</p>
                    <div className="flex justify-center gap-6">
                        <button onClick={() => setGameState(GameState.MENU)} className="px-6 py-3 bg-stone-100 text-stone-600 rounded-xl hover:bg-stone-200 transition-colors">Valikko</button>
                        {level < 8 ? (
                            <button onClick={() => startGame(level + 1)} className="px-10 py-4 bg-green-500 hover:bg-green-600 text-white text-2xl rounded-xl shadow-lg shadow-green-200 transition-all transform hover:-translate-y-1">
                                Seuraava Taso ({level + 1})
                            </button>
                        ) : (
                            <p className="text-2xl text-green-600 font-bold px-8 py-3 bg-green-50 rounded-xl">🏆 Olet mestari! 🏆</p>
                        )}
                    </div>
                 </div>
            )}

            {/* Game Grid */}
            {(gameState === GameState.PLAYING || gameState === GameState.PAUSED) && (
                <>
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        {gridCards.map((card, idx) => {
                            const isSolved = solvedIds.includes(card.id);
                            const isSelected = selectedId === card.id && selectedType === card.type;
                            
                            // Visual Styles
                            let baseClass = "aspect-[4/3] flex flex-col items-center justify-center rounded-2xl transition-all duration-200 relative cursor-pointer shadow-sm";
                            let colorClass = "bg-white border-2 border-stone-200 hover:border-cyan-200 hover:shadow-md";
                            let contentClass = "text-stone-700 font-bold";
                            
                            if (isSolved) {
                                baseClass = "aspect-[4/3] flex flex-col items-center justify-center rounded-2xl opacity-0 scale-75 transition-all duration-500"; // Fade out
                            } else if (isSelected) {
                                colorClass = "bg-amber-50 border-2 border-amber-300 shadow-md transform -translate-y-1";
                            }

                            if (card.type === 'emoji') {
                                contentClass = "text-5xl drop-shadow-sm";
                            } else {
                                contentClass = "text-xl md:text-2xl leading-none text-stone-600 font-medium tracking-wide";
                            }

                            return (
                                <button
                                    key={`${card.id}-${card.type}-${idx}`}
                                    onClick={() => handleCardClick(card.id, card.type)}
                                    disabled={isSolved || gameState === GameState.PAUSED}
                                    className={`${baseClass} ${colorClass}`}
                                >
                                    <span className={contentClass}>
                                        {card.content}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    
                    {/* Shuffle Button */}
                    <div className="flex justify-center">
                        <button 
                            onClick={handleShuffle}
                            className="px-8 py-3 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-full font-bold shadow-sm transition-colors flex items-center gap-2"
                        >
                           <span>🔀</span> Sekoita
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
