
import React, { useState } from 'react';
import { VocabGarden } from './components/VocabGarden';
import { Gogolink } from './components/Gogolink';
import { Suomicast } from './components/Suomicast';

type View = 'garden' | 'gogolink' | 'suomicast';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('garden');

  return (
    <div className="min-h-screen p-4 md:p-8 font-['VT323']">
      <div className="max-w-6xl mx-auto">
        {/* Main Title / Nav Area */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
           {/* Logo */}
           <div className="bg-white px-6 py-2 rounded-2xl shadow-sm border border-stone-100 transform -rotate-1 hover:rotate-0 transition-transform cursor-default">
               <h1 className="text-4xl text-stone-800 tracking-wide font-bold">
                   <span className="text-orange-500">KISSAN</span> KOULU
               </h1>
           </div>
           
           {/* Navigation Menu */}
           <div className="flex bg-white p-1.5 rounded-xl shadow-sm border border-stone-200 gap-1">
              <button 
                onClick={() => setCurrentView('garden')}
                className={`px-5 py-2 text-xl rounded-lg transition-all font-bold ${currentView === 'garden' ? 'bg-orange-100 text-orange-800 shadow-sm' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'}`}
              >
                PUUTARHA
              </button>
              <button 
                onClick={() => setCurrentView('gogolink')}
                className={`px-5 py-2 text-xl rounded-lg transition-all font-bold ${currentView === 'gogolink' ? 'bg-cyan-100 text-cyan-800 shadow-sm' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'}`}
              >
                GOGOLINK
              </button>
              <button 
                onClick={() => setCurrentView('suomicast')}
                className={`px-5 py-2 text-xl rounded-lg transition-all font-bold ${currentView === 'suomicast' ? 'bg-purple-100 text-purple-800 shadow-sm' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'}`}
              >
                SUOMICAST
              </button>
           </div>
        </div>

        {/* Content Area */}
        <div className="transition-all duration-300">
           {currentView === 'garden' && <VocabGarden />}
           {currentView === 'gogolink' && <Gogolink />}
           {currentView === 'suomicast' && <Suomicast />}
        </div>

      </div>
    </div>
  );
};

export default App;
