import React from 'react';
import { Home, Scan, History, UserCheck } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'scan' | 'history' | 'profile';
  onSelectTab: (tab: 'home' | 'scan' | 'history' | 'profile') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav className="bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-3 py-2 sticky bottom-0 z-30 shadow-lg">
      <div className="flex items-center justify-between max-w-md mx-auto relative px-2">
        {/* Tab 1: Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 ${
            activeTab === 'home'
              ? 'text-rose-800 font-semibold scale-105'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Home className={`w-5 h-5 mb-0.5 ${activeTab === 'home' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[10px]">Beranda</span>
        </button>

        {/* Tab 2: Riwayat */}
        <button
          onClick={() => onSelectTab('history')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 ${
            activeTab === 'history'
              ? 'text-rose-800 font-semibold scale-105'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <History className={`w-5 h-5 mb-0.5 ${activeTab === 'history' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[10px]">Riwayat</span>
        </button>

        {/* Tab 3: Scan (Center Prominent Button) */}
        <div className="relative -top-5">
          <button
            onClick={() => onSelectTab('scan')}
            className={`w-13 h-13 rounded-full bg-gradient-to-tr from-rose-800 via-rose-700 to-rose-600 text-white flex flex-col items-center justify-center shadow-lg shadow-rose-900/30 hover:scale-105 active:scale-95 transition-all duration-150 border-4 border-white ${
              activeTab === 'scan' ? 'ring-2 ring-rose-600 ring-offset-2' : ''
            }`}
            aria-label="Scan Label Indikator"
          >
            <Scan className="w-5 h-5 stroke-[2.5px]" />
            <span className="text-[8px] font-black tracking-wider uppercase mt-0.5">SCAN</span>
          </button>
        </div>

        {/* Tab 4: Profil */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 ${
            activeTab === 'profile'
              ? 'text-rose-800 font-semibold scale-105'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <UserCheck className={`w-5 h-5 mb-0.5 ${activeTab === 'profile' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[10px]">Profil</span>
        </button>
      </div>
    </nav>
  );
};

