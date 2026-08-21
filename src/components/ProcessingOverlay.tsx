import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Sliders, Pipette, Scale } from 'lucide-react';
import { RGBColor } from '../types';

interface ProcessingOverlayProps {
  scannedRgb: RGBColor;
  onComplete: () => void;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({
  scannedRgb,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    { title: 'Memproses hasil...', icon: Loader2, desc: 'Inisialisasi citra sensor' },
    { title: 'Mengekstraksi warna', icon: Pipette, desc: `R: ${scannedRgb.r} | G: ${scannedRgb.g} | B: ${scannedRgb.b}` },
    { title: 'Kalibrasi RGB', icon: Sliders, desc: 'Kompensasi pencahayaan & white-balance' },
    { title: 'Mencocokkan dengan threshold', icon: Scale, desc: 'Klasifikasi batas mutu antosianin' },
  ];

  useEffect(() => {
    // Step progression
    const timer1 = setTimeout(() => setCurrentStep(1), 400);
    const timer2 = setTimeout(() => setCurrentStep(2), 850);
    const timer3 = setTimeout(() => setCurrentStep(3), 1300);
    const timer4 = setTimeout(() => onComplete(), 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl flex flex-col items-center justify-center min-h-[400px] text-center">
      {/* Visual Colorimetric Sensor Swatch */}
      <div className="relative mb-6">
        <div
          className="w-20 h-20 rounded-2xl shadow-md border-2 border-white flex items-center justify-center relative overflow-hidden transition-all duration-300"
          style={{ backgroundColor: scannedRgb.hex }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
          <div className="w-8 h-8 rounded-full border border-white/60 flex items-center justify-center text-[10px] font-bold text-white">
            RGB
          </div>
        </div>
        <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white font-mono text-[9px] px-2 py-0.5 rounded-full border border-white/20 shadow-xs">
          {scannedRgb.hex}
        </div>
      </div>

      <h3 className="text-base font-bold text-slate-900 mb-1">
        Analisis Spektrum Indikator
      </h3>
      <p className="text-xs text-slate-500 mb-6 max-w-xs">
        Menganalisis nilai kromatisitas label antosianin rosela...
      </p>

      {/* Progress Steps List */}
      <div className="w-full max-w-xs space-y-3 text-left">
        {steps.map((step, idx) => {
          const isDone = currentStep > idx;
          const isCurrent = currentStep === idx;
          const StepIcon = step.icon;

          return (
            <div
              key={idx}
              className={`flex items-center space-x-3 p-2.5 rounded-xl border transition-all duration-200 ${
                isDone
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                  : isCurrent
                  ? 'bg-rose-50 border-rose-200 text-rose-900 shadow-xs'
                  : 'bg-slate-50/50 border-slate-100 text-slate-400'
              }`}
            >
              <div className="flex-shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : isCurrent ? (
                  <StepIcon className="w-5 h-5 text-rose-700 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    {idx + 1}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold leading-tight">
                  {step.title}
                </div>
                <div className="text-[10px] opacity-75 font-mono truncate">
                  {step.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-[11px] text-slate-400 font-mono">
        Alur: WARNA → RGB → KALIBRASI → THRESHOLD
      </div>
    </div>
  );
};
