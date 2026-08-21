import React from 'react';
import { Info, User, ChevronDown, ShieldCheck } from 'lucide-react';
import { BgnLogo } from './BgnLogo';
import { OfficerProfile } from '../types';

interface HeaderProps {
  onOpenInfo: () => void;
  onOpenProfile?: () => void;
  officerProfile?: OfficerProfile;
  selectedLocation: string;
  onChangeLocation: (loc: string) => void;
  locations: { id: string; code: string; name: string }[];
}

export const Header: React.FC<HeaderProps> = ({
  onOpenInfo,
  onOpenProfile,
  officerProfile,
  selectedLocation,
  onChangeLocation,
  locations,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 px-4 py-3 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center justify-between">
        {/* App Title & Badan Gizi Nasional Logo */}
        <div className="flex items-center space-x-2.5">
          <BgnLogo size="md" />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black text-slate-900 tracking-tight leading-tight">
                LARAS
              </h1>
              <span className="text-[9px] font-extrabold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded border border-rose-200 uppercase">
                BGN • MBG
              </span>
            </div>
            <p className="text-[9.5px] font-medium text-slate-500 tracking-tight flex items-center gap-1">
              <span>Sistem Mutu Pangan</span>
              <span className="text-slate-300">•</span>
              <span className="text-rose-800 font-semibold">Tim Kipas Kopdes 1,8 Triliun</span>
            </p>
          </div>
        </div>

        {/* Action Controls: Info & Profile */}
        <div className="flex items-center space-x-1">
          {officerProfile && onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 pl-2 pr-2.5 py-1 bg-slate-100 hover:bg-rose-50 border border-slate-200 rounded-full transition-colors text-left"
              title="Profil Petugas"
            >
              <div className="w-5 h-5 rounded-full bg-rose-800 text-white flex items-center justify-center text-[10px] font-bold">
                {officerProfile.name.charAt(0)}
              </div>
              <div className="hidden xs:block text-left">
                <div className="text-[10px] font-bold text-slate-800 leading-none truncate max-w-[80px]">
                  {officerProfile.name.split(' ')[0]}
                </div>
                <div className="text-[8px] font-mono text-slate-500 leading-none">
                  {officerProfile.role}
                </div>
              </div>
            </button>
          )}

          <button
            onClick={onOpenInfo}
            className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
            title="Informasi Indikator Antosianin"
            aria-label="Informasi Ilmiah"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Location selector strip */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] text-slate-400 font-medium">Titik Distribusi:</span>
        </div>
        <select
          value={selectedLocation}
          onChange={(e) => onChangeLocation(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-800 font-medium text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-rose-500 max-w-[210px] truncate"
        >
          {locations.map((loc) => (
            <option key={loc.id} value={loc.code}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
};

