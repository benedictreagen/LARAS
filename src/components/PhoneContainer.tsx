import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Smartphone, Maximize2, Minimize2 } from 'lucide-react';
import { formatWIBTime } from '../utils/colorimetric';

interface PhoneContainerProps {
  children: React.ReactNode;
}

export const PhoneContainer: React.FC<PhoneContainerProps> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState(formatWIBTime().replace(' WIB', ''));
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 transition-all duration-300">
      {/* Frame / Responsive Controller on Desktop */}
      <div className="w-full max-w-md hidden sm:flex items-center justify-between text-xs text-slate-500 mb-2 px-2">
        <div className="flex items-center gap-1.5 font-medium">
          <Smartphone className="w-3.5 h-3.5 text-rose-700" />
          <span className="font-semibold text-slate-700">LARAS</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 text-[11px]">Tim Kipas Kopdes 1,8 Triliun</span>
        </div>
        <button
          onClick={() => setDeviceFrameMode(!deviceFrameMode)}
          className="flex items-center gap-1 hover:text-slate-900 bg-white/70 hover:bg-white px-2 py-1 rounded-md border border-slate-300 shadow-2xs transition-colors"
          title="Ubah Tampilan Frame"
        >
          {deviceFrameMode ? (
            <>
              <Maximize2 className="w-3 h-3" />
              <span>Layar Penuh</span>
            </>
          ) : (
            <>
              <Minimize2 className="w-3 h-3" />
              <span>Frame HP</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container */}
      <div
        className={`w-full bg-slate-100 flex flex-col transition-all duration-300 overflow-hidden shadow-2xl relative ${
          deviceFrameMode
            ? 'max-w-[430px] sm:rounded-[36px] sm:border-[8px] sm:border-slate-800 sm:ring-1 sm:ring-black/10 min-h-[780px] max-h-[92vh]'
            : 'max-w-xl rounded-2xl border border-slate-300 min-h-[85vh]'
        }`}
      >
        {/* Smartphone Status Bar on Mobile / Frame */}
        <div className="bg-white px-5 pt-3 pb-1.5 flex items-center justify-between text-xs font-semibold text-slate-800 select-none z-40 border-b border-slate-100/50">
          <span className="font-mono text-[11px] tracking-tight">{currentTime}</span>

          {/* Dynamic Notch/Pill Indicator */}
          <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center space-x-1.5 px-2">
            <div className="w-2 h-2 rounded-full bg-slate-950 border border-slate-800" />
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500/80 animate-pulse" />
          </div>

          <div className="flex items-center space-x-1.5 text-slate-700">
            <span className="text-[9px] font-bold text-slate-500">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-current text-slate-800" />
          </div>
        </div>

        {/* Scrollable App Viewport */}
        <div className="flex-1 flex flex-col overflow-y-auto relative bg-slate-50">
          {children}

          {/* Official Watermark Bar */}
          <div className="text-center py-2 px-3 bg-slate-100/90 border-t border-slate-200/60 text-[10px] text-slate-400 font-medium select-none flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            <span className="font-bold text-slate-600 uppercase tracking-wider">LARAS</span>
            <span>•</span>
            <span className="text-slate-500">Tim Kipas Kopdes 1,8 Triliun</span>
          </div>
        </div>
      </div>
    </div>
  );
};
