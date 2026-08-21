import React from 'react';
import { X, ShieldCheck, ArrowRight, BookOpen, AlertCircle, CheckCircle, Info, Sparkles } from 'lucide-react';
import { ANTHOCYANIN_REFERENCES } from '../utils/colorimetric';
import { BgnLogo } from './BgnLogo';

interface ScienceInfoModalProps {
  onClose: () => void;
}

export const ScienceInfoModal: React.FC<ScienceInfoModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center space-x-2.5">
            <BgnLogo size="sm" variant="badge" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Sistem LARAS • Indikator Mutu MBG
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">
                Badan Gizi Nasional • Tim Kipas Kopdes 1,8 Triliun
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          {/* Konsep Dasar */}
          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-700" />
              <span>1. Prinsip Kerja Non-Destruktif</span>
            </h4>
            <p className="text-slate-600 text-[11px]">
              Label indikator kolorimetrik dipasang pada <strong>headspace</strong> kemasan pangan dan <strong>tidak bersentuhan langsung</strong> dengan makanan. Label ini berfungsi sebagai sistem peringatan dini cepat pada rantai distribusi.
            </p>
          </section>

          {/* Respon Kimia Antosianin */}
          <section className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-rose-700" />
              <span>2. Mekanisme Perubahan Warna Rosela</span>
            </h4>
            <p className="text-slate-600 text-[11px]">
              Penurunan mutu pangan menghasilkan senyawa volatil basa (misalnya amonia, trimetilamin/TVB-N) yang berdifusi ke headspace kemasan. Kenaikan pH mikro di sekitar film memicu pergeseran struktur antosianin:
            </p>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center space-x-2 p-2 bg-emerald-50/60 rounded-lg border border-emerald-200">
                <div
                  className="w-4 h-4 rounded-full border border-black/20 flex-shrink-0"
                  style={{ backgroundColor: ANTHOCYANIN_REFERENCES.NORMAL.typicalRgb.hex }}
                />
                <div>
                  <strong className="text-emerald-900 text-[11px]">NORMAL (Merah Segar):</strong>
                  <span className="text-[10px] text-emerald-800 ml-1">Kation flavylium stabil pada pH asam.</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-2 bg-amber-50/60 rounded-lg border border-amber-200">
                <div
                  className="w-4 h-4 rounded-full border border-black/20 flex-shrink-0"
                  style={{ backgroundColor: ANTHOCYANIN_REFERENCES.WASPADA.typicalRgb.hex }}
                />
                <div>
                  <strong className="text-amber-900 text-[11px]">WASPADA (Magenta Keunguan):</strong>
                  <span className="text-[10px] text-amber-800 ml-1">Mulai terjadi transisi ke quinonoidal base.</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-2 bg-rose-50/60 rounded-lg border border-rose-200">
                <div
                  className="w-4 h-4 rounded-full border border-black/20 flex-shrink-0"
                  style={{ backgroundColor: ANTHOCYANIN_REFERENCES.BERISIKO.typicalRgb.hex }}
                />
                <div>
                  <strong className="text-rose-900 text-[11px]">BERISIKO (Ungu Kebiruan):</strong>
                  <span className="text-[10px] text-rose-800 ml-1">Transformasi lanjutan ke chalcone / deprotonated form.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Konsep Sistem Aplikasi */}
          <section className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs">
              3. Alur Pengolahan Citra Smartphone
            </h4>
            <div className="flex items-center justify-between text-[10px] font-mono bg-white p-2 rounded-lg border border-slate-200 text-slate-800">
              <span className="font-bold text-rose-900">WARNA</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span>RGB</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span>KALIBRASI</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span>THRESHOLD</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="font-bold text-slate-900">STATUS</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Kamera mengekstraksi nilai RGB dari ROI label, melakukan kalibrasi white-balance pencahayaan lingkungan, dan membandingkan jarak kromatisitas dengan threshold yang telah divalidasi.
            </p>
          </section>

          {/* Batasan Ilmiah */}
          <section className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>Batasan & Pedoman Penggunaan:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[10px] text-amber-800">
              <li>Smartphone membaca warna aktual indikator, bukan mengukur TVB-N atau mikroba secara langsung.</li>
              <li>Status "Normal" tidak menggantikan inspeksi fisik & aroma standar pangan.</li>
              <li>Data rekaman digunakan untuk monitoring & evaluasi pola rantai pasok MBG.</li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
