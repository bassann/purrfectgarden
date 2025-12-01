
import React, { useState, useEffect, useRef } from 'react';
import { PodcastEpisode } from '../types';
import { fetchPodcastScript, fetchPodcastAudio } from '../services/geminiService';

export const Suomicast: React.FC = () => {
    const [episode, setEpisode] = useState<PodcastEpisode | null>(null);
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioReady, setAudioReady] = useState(false);
    
    // Audio Context Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const startTimeRef = useRef<number>(0);
    const pausedAtRef = useRef<number>(0);
    const audioBufferRef = useRef<AudioBuffer | null>(null);

    // Instant load of text
    useEffect(() => {
        const loadDailyScript = async () => {
            const ep = await fetchPodcastScript();
            setEpisode(ep);
        };
        loadDailyScript();
    }, []);

    // Clean up
    useEffect(() => {
        return () => {
            if (sourceNodeRef.current) sourceNodeRef.current.stop();
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, []);

    const initAudioContext = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
    };

    const handlePlayPause = async () => {
        initAudioContext();
        
        if (isPlaying) {
            // Pause
            if (audioContextRef.current && sourceNodeRef.current) {
                sourceNodeRef.current.stop();
                pausedAtRef.current += audioContextRef.current.currentTime - startTimeRef.current;
                sourceNodeRef.current = null;
                setIsPlaying(false);
            }
            return;
        }

        // Play
        if (!episode) return;

        // If buffer not ready
        if (!audioBufferRef.current) {
            setIsAudioLoading(true);
            try {
                const pcmData = await fetchPodcastAudio(episode.transcript);
                const ctx = audioContextRef.current!;
                const int16Array = new Int16Array(pcmData);
                const float32Array = new Float32Array(int16Array.length);
                for (let i = 0; i < int16Array.length; i++) {
                    float32Array[i] = int16Array[i] / 32768.0;
                }
                const buffer = ctx.createBuffer(1, float32Array.length, 24000);
                buffer.getChannelData(0).set(float32Array);
                audioBufferRef.current = buffer;
                setAudioReady(true);
            } catch (e) {
                console.error("Audio failed", e);
                setIsAudioLoading(false);
                return;
            } finally {
                setIsAudioLoading(false);
            }
        }

        playBuffer(audioBufferRef.current, pausedAtRef.current);
    };

    const playBuffer = (buffer: AudioBuffer | null, offset: number) => {
        if (!buffer || !audioContextRef.current) return;

        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.start(0, offset);
        
        startTimeRef.current = audioContextRef.current.currentTime;
        sourceNodeRef.current = source;
        setIsPlaying(true);

        source.onended = () => {
             if (audioContextRef.current && (audioContextRef.current.currentTime - startTimeRef.current >= buffer.duration - 0.1)) {
                 setIsPlaying(false);
                 pausedAtRef.current = 0;
             }
        };
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center p-4">
            <div className="text-center mb-8">
                <h2 className="text-3xl text-purple-900 font-bold tracking-wide mb-1">SUOMICAST</h2>
                <p className="text-purple-400 text-sm tracking-widest uppercase">Päivän jakso • {episode ? episode.title : "Ladataan..."}</p>
            </div>

            {/* Retro Pop Cassette Design */}
            <div className="relative w-full max-w-md h-72 bg-teal-500 rounded-[32px] p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)] mx-auto mb-12 select-none transform transition-transform hover:scale-[1.02]">
                
                {/* Inner Plastic Body */}
                <div className="w-full h-full bg-teal-50 rounded-[24px] border-4 border-teal-600 relative overflow-hidden shadow-inner flex flex-col items-center">
                    
                    {/* Screws */}
                    <div className="absolute top-3 left-3 w-4 h-4 bg-stone-300 rounded-full border border-stone-400 flex items-center justify-center"><div className="w-2 h-0.5 bg-stone-500 rotate-45"></div></div>
                    <div className="absolute top-3 right-3 w-4 h-4 bg-stone-300 rounded-full border border-stone-400 flex items-center justify-center"><div className="w-2 h-0.5 bg-stone-500 rotate-45"></div></div>
                    <div className="absolute bottom-3 left-3 w-4 h-4 bg-stone-300 rounded-full border border-stone-400 flex items-center justify-center"><div className="w-2 h-0.5 bg-stone-500 rotate-45"></div></div>
                    <div className="absolute bottom-3 right-3 w-4 h-4 bg-stone-300 rounded-full border border-stone-400 flex items-center justify-center"><div className="w-2 h-0.5 bg-stone-500 rotate-45"></div></div>

                    {/* Sticker Label Area */}
                    <div className="mt-8 w-[90%] h-[75%] bg-white rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center relative overflow-hidden">
                        
                        {/* Pink Decorative Stripe */}
                        <div className="w-full h-8 bg-pink-400 absolute top-4 left-0 right-0 flex items-center px-4 justify-between">
                            <span className="text-white text-xs font-bold tracking-widest">A-PUOLI</span>
                            <span className="text-white text-xs font-bold tracking-widest">90 MIN</span>
                        </div>
                        <div className="w-full h-1 bg-pink-300 absolute top-14 left-0 right-0"></div>

                        {/* Title Display */}
                        <div className="mt-16 text-center px-4 w-full truncate">
                             <span className="font-['VT323'] text-2xl text-stone-700">{episode?.topic || "..."}</span>
                        </div>
                        
                        {/* Tape Window */}
                        <div className="mt-3 w-[75%] h-20 bg-stone-200 rounded-full border-2 border-stone-300 relative flex items-center justify-center gap-6 shadow-inner overflow-hidden">
                            {/* Left Reel */}
                            <div className={`w-14 h-14 rounded-full border-4 border-white bg-stone-800 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{animationDuration: '3s'}}>
                                <div className="w-2 h-2 bg-stone-500 rounded-full z-10"></div>
                                <div className="absolute w-full h-1 bg-stone-600"></div>
                                <div className="absolute h-full w-1 bg-stone-600"></div>
                            </div>
                            {/* Right Reel */}
                            <div className={`w-14 h-14 rounded-full border-4 border-white bg-stone-800 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{animationDuration: '3s'}}>
                                <div className="w-2 h-2 bg-stone-500 rounded-full z-10"></div>
                                <div className="absolute w-full h-1 bg-stone-600"></div>
                                <div className="absolute h-full w-1 bg-stone-600"></div>
                            </div>
                            {/* Tape connecting reels */}
                            <div className="absolute bottom-3 left-[25%] right-[25%] h-8 bg-stone-800 opacity-20 skew-x-12"></div>
                        </div>
                    </div>
                    
                    {/* Bottom Trapezoid (Head area) */}
                    <div className="absolute bottom-0 w-[60%] h-6 bg-teal-200 border-t-2 border-l-2 border-r-2 border-teal-600 rounded-t-xl opacity-80"></div>
                </div>

                {/* Floating Play Button */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                     <button 
                        onClick={handlePlayPause}
                        disabled={isAudioLoading}
                        className={`w-16 h-16 rounded-full shadow-lg border-4 border-white flex items-center justify-center transition-all hover:scale-105 active:scale-95
                        ${isPlaying ? 'bg-pink-500' : 'bg-teal-600'}
                        `}
                     >
                        {isAudioLoading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                        ) : (
                            <span className="text-white text-3xl ml-1 leading-none">{isPlaying ? '⏸' : '▶'}</span>
                        )}
                     </button>
                </div>
            </div>

            {/* Transcript Card */}
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] border border-stone-100 overflow-hidden mt-8">
                <div className="bg-stone-50 p-4 border-b border-stone-100 flex justify-between items-center">
                    <h3 className="text-stone-500 font-bold uppercase tracking-wider text-sm">Transkriptio</h3>
                    <div className="h-2 w-24 bg-stone-200 rounded-full overflow-hidden">
                        <div className={`h-full bg-pink-400 transition-all duration-500 ${isPlaying ? 'w-full animate-pulse' : 'w-0'}`}></div>
                    </div>
                </div>
                <div className="p-6 max-h-[400px] overflow-y-auto space-y-6">
                    {episode ? (
                        episode.transcript.map((line, idx) => (
                            <div key={idx} className="flex gap-4 group">
                                <div className="font-bold text-teal-600 min-w-[80px] text-right uppercase text-xs pt-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                    {line.speaker}
                                </div>
                                <div className="text-lg text-stone-700 leading-relaxed font-sans">
                                    {line.text}
                                </div>
                            </div>
                        ))
                    ) : (
                         <div className="flex flex-col items-center justify-center h-32">
                            <p className="text-stone-400">Valmistellaan päivän jaksoa...</p>
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};
