import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, BookmarkCheck, Send, RotateCcw, ShieldCheck, MapPin, Clock, Tag, FileText, Check, ChevronRight, Info, UserCheck } from 'lucide-react';
import { RGBColor, StatusType, ScanRecord, OfficerProfile } from '../types';
import { classifyAnthocyaninColor, formatIndoDate, formatWIBTime } from '../utils/colorimetric';

interface ResultViewProps {
  scannedRgb: RGBColor;
  batchId: string;
  menuName: string;
  location: string;
  locationCode: string;
  luxLevel?: 'Optimal' | 'Cukup' | 'Rendah';
  officerProfile?: OfficerProfile;
  onSaveRecord: (record: ScanRecord) => void;
  onReportRecord: (record: ScanRecord) => void;
  onScanAgain: () => void;
  onGoHome: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  scannedRgb,
  batchId,
  menuName,
  location,
  locationCode,
  luxLevel = 'Optimal',
  officerProfile,
  onSaveRecord,
  onReportRecord,
  onScanAgain,
  onGoHome,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [customNotes, setCustomNotes] = useState('');
  const [activeBatchId, setActiveBatchId] = useState(batchId || 'MBG-JWN-001');

  // Perform classification
  const classification = classifyAnthocyaninColor(scannedRgb);
  const currentTime = formatWIBTime();
  const currentDate = formatIndoDate();

  const handleSave = () => {
    const record: ScanRecord = {
      id: `rec-${Date.now()}`,
      timestamp: new Date().toISOString(),
      displayTime: currentTime,
      displayDate: currentDate,
      location,
      locationCode,
      batchId: activeBatchId,
      menuName,
      rgb: scannedRgb,
      status: classification.status,
      isReported,
      notes: customNotes || `Pembacaan di ${locationCode}`,
      calibratedLux: `${luxLevel} (${classification.deltaE} ΔE)`,
      deltaEThreshold: classification.deltaE,
      reportedBy: officerProfile?.name || 'Dr. Alvindra Salsabian Lifanto, S.T.P., M.T., M.Gz., Ph.D.',
      reporterRole: officerProfile?.roleLabel || 'Koordinator Pengawas Mutu & Sensor Pangan MBG',
      reporterNip: officerProfile?.nip || '19900315 201503 1 002',
      reporterOrg: officerProfile?.organization || 'Badan Gizi Nasional (BGN) • Tim Kipas Kopdes 1,8 Triliun',
    };
    onSaveRecord(record);
    setIsSaved(true);
  };

  const handleReport = () => {
    const record: ScanRecord = {
      id: `rec-${Date.now()}`,
      timestamp: new Date().toISOString(),
      displayTime: currentTime,
      displayDate: currentDate,
      location,
      locationCode,
      batchId: activeBatchId,
      menuName,
      rgb: scannedRgb,
      status: classification.status,
      isReported: true,
      notes: customNotes || `Laporan pengawasan mutu di ${locationCode}`,
      calibratedLux: `${luxLevel} (${classification.deltaE} ΔE)`,
      deltaEThreshold: classification.deltaE,
      reportedBy: officerProfile?.name || 'Dr. Alvindra Salsabian Lifanto, S.T.P., M.T., M.Gz., Ph.D.',
      reporterRole: officerProfile?.roleLabel || 'Koordinator Pengawas Mutu & Sensor Pangan MBG',
      reporterNip: officerProfile?.nip || '19900315 201503 1 002',
      reporterOrg: officerProfile?.organization || 'Badan Gizi Nasional (BGN) • Tim Kipas Kopdes 1,8 Triliun',
    };
    onReportRecord(record);
    setIsReported(true);
    if (!isSaved) setIsSaved(true);
  };

  // Status visual styles
  const getStatusDisplay = () => {
    switch (classification.status) {
      case 'NORMAL':
        return {
          title: 'NORMAL',
          subtext: 'Mutu Kemasan Stabil',
          cardBg: 'bg-emerald-50/70 border-emerald-300',
          textColor: 'text-emerald-800',
          badgeBg: 'bg-emerald-600 text-white',
          icon: CheckCircle2,
          borderAccent: 'border-emerald-500',
          recommendation: 'Pangan dalam kemasan dapat didistribusikan dan dikonsumsi sesuai SOP waktu santap MBG.',
        };
      case 'WASPADA':
        return {
          title: 'WASPADA',
          subtext: 'Terdeteksi Pergeseran Mutu Headspace',
          cardBg: 'bg-amber-50/80 border-amber-300',
          textColor: 'text-amber-900',
          badgeBg: 'bg-amber-600 text-white',
          icon: AlertTriangle,
          borderAccent: 'border-amber-500',
          recommendation: 'Prioritaskan konsumsi segera atau lakukan verifikasi organoleptik fisik sebelum disajikan ke siswa.',
        };
      case 'BERISIKO':
        return {
          title: 'BERISIKO',
          subtext: 'Perubahan Spektrum Melebihi Ambang Aman',
          cardBg: 'bg-rose-50/80 border-rose-300',
          textColor: 'text-rose-950',
          badgeBg: 'bg-rose-700 text-white',
          icon: AlertOctagon,
          borderAccent: 'border-rose-600',
          recommendation: 'Jangan bagikan batch kemasan ini ke siswa. Segera laporkan untuk penarikan dan penggantian menu.',
        };
    }
  };

  const statusInfo = getStatusDisplay();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-4 pb-8">
      {/* 1. BAGIAN PALING BESAR: STATUS TERKINI */}
      <section className={`rounded-2xl p-5 border-2 ${statusInfo.cardBg} shadow-xs text-center relative overflow-hidden`}>
        {/* Tim Kipas Kopdes Watermark Tag */}
        <div className="absolute top-2 right-3">
          <span className="text-[8.5px] font-bold text-slate-500 bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded-full border border-slate-200 uppercase">
            Tim Kipas Kopdes 1,8 Triliun
          </span>
        </div>

        <div className="text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-1">
          STATUS TERKINI
        </div>

        <div className="flex items-center justify-center gap-2 mb-1">
          <StatusIcon className={`w-8 h-8 ${statusInfo.textColor}`} />
          <h2 className={`text-3xl font-black tracking-tight ${statusInfo.textColor}`}>
            {statusInfo.title}
          </h2>
        </div>

        <p className="text-xs font-semibold text-slate-600 max-w-xs mx-auto">
          {statusInfo.subtext}
        </p>

        {/* 2. WARNA AKTUAL LABEL ANTHOCYANIN & RGB DATA */}
        <div className="mt-4 pt-4 border-t border-slate-200/80 grid grid-cols-1 gap-3 text-left">
          <div className="bg-white/90 rounded-xl p-3.5 border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              {/* Actual Anthocyanin Color Swatch */}
              <div className="flex flex-col items-center">
                <div
                  className="w-14 h-14 rounded-xl shadow-md border-2 border-white ring-1 ring-slate-200 flex items-center justify-center relative"
                  style={{ backgroundColor: scannedRgb.hex }}
                  title={`Warna Aktual: ${scannedRgb.hex}`}
                >
                  <div className="w-4 h-4 rounded-full bg-white/30 border border-white/50" />
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-1 font-semibold">
                  {scannedRgb.hex}
                </span>
              </div>

              <div>
                <div className="text-[11px] font-medium text-slate-500">
                  Warna Aktual Label Indikator:
                </div>
                <div className="text-sm font-bold text-slate-800">
                  {classification.dominantTone}
                </div>
                <div className="text-[11px] font-mono text-slate-600 mt-0.5">
                  R <strong className="text-slate-900">{scannedRgb.r}</strong> | G <strong className="text-slate-900">{scannedRgb.g}</strong> | B <strong className="text-slate-900">{scannedRgb.b}</strong>
                </div>
              </div>
            </div>

            <div className="text-right text-[10px] text-slate-400 font-mono hidden sm:block">
              <div>R/G: {classification.ratioRG}</div>
              <div>ΔE: {classification.deltaE}</div>
            </div>
          </div>

          {/* METADATA PEMERIKSAAN (Waktu, Lokasi, ID/Batch) */}
          <div className="bg-white/90 rounded-xl p-3 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-slate-500 gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Waktu Pembacaan:</span>
              </div>
              <span className="font-bold text-slate-800 font-mono">{currentTime}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-slate-500 gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Lokasi Pemeriksaan:</span>
              </div>
              <span className="font-semibold text-slate-800 truncate max-w-[190px]">
                {locationCode}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-slate-500 gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>ID / BATCH Kemasan:</span>
              </div>
              <span className="font-mono font-bold text-rose-900 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                {activeBatchId}
              </span>
            </div>

            {menuName && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                <span className="text-slate-400">Menu MBG:</span>
                <span className="text-slate-700 font-medium truncate max-w-[180px]">
                  {menuName}
                </span>
              </div>
            )}

            {officerProfile && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-rose-700" />
                  <span>Petugas Verifikator:</span>
                </span>
                <span className="text-slate-800 font-semibold truncate max-w-[170px]">
                  {officerProfile.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. KOTAK INFORMASI INTERPRETASI */}
      <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Info className="w-4 h-4 text-rose-700" />
          <span>Interpretasi Ilmiah Sistem</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700 text-[12px] leading-relaxed">
          <p className="font-medium text-slate-900 mb-1">
            "Hasil pembacaan berada pada kategori <span className="font-bold underline">{classification.status}</span> berdasarkan threshold yang telah divalidasi terhadap parameter mutu pangan."
          </p>
          <p className="text-[11px] text-slate-500">
            {statusInfo.recommendation}
          </p>
        </div>

        {/* Disclaimer on Concept */}
        <div className="text-[11px] text-slate-500 bg-rose-50/50 p-2.5 rounded-lg border border-rose-100 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-rose-700 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800">Prinsip Pengukuran:</strong> Smartphone membaca warna optik film antosianin rosela pada headspace kemasan pangan.
            <div className="font-mono text-[10px] text-slate-600 mt-0.5">
              WARNA → RGB → KALIBRASI → THRESHOLD → STATUS
            </div>
          </div>
        </div>
      </section>

      {/* 4. ACTIONS: REKAM HASIL & LAPORKAN HASIL */}
      <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
          Aksi Monitoring Distribusi
        </div>

        {/* REKAM HASIL BUTTON */}
        <div>
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              isSaved
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-[0.99]'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-emerald-700 stroke-[3px]" />
                <span>✓ Hasil Berhasil Direkam</span>
              </>
            ) : (
              <>
                <BookmarkCheck className="w-4 h-4" />
                <span>REKAM HASIL</span>
              </>
            )}
          </button>
          {isSaved && (
            <p className="text-center text-[11px] text-emerald-700 mt-1 font-medium">
              ✓ Data tersimpan ke riwayat monitoring dan evaluasi.
            </p>
          )}
        </div>

        {/* LAPORKAN HASIL BUTTON */}
        <div>
          <button
            onClick={handleReport}
            disabled={isReported}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              isReported
                ? 'bg-blue-100 text-blue-900 border border-blue-300 cursor-default'
                : classification.status !== 'NORMAL'
                ? 'bg-gradient-to-r from-rose-800 to-rose-700 hover:from-rose-700 hover:to-rose-600 text-white shadow-md shadow-rose-900/20 active:scale-[0.99]'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 active:scale-[0.99]'
            }`}
          >
            {isReported ? (
              <>
                <Check className="w-4 h-4 text-blue-700 stroke-[3px]" />
                <span>✓ Hasil Berhasil Dilaporkan</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>LAPORKAN HASIL</span>
              </>
            )}
          </button>
          <p className="text-center text-[10px] text-slate-400 mt-1">
            Data digunakan untuk monitoring dan evaluasi distribusi.
          </p>
        </div>

        {/* Secondary navigation */}
        <div className="pt-2 grid grid-cols-2 gap-2">
          <button
            onClick={onScanAgain}
            className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Scan Label Lain</span>
          </button>

          <button
            onClick={onGoHome}
            className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Kembali ke Beranda</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </section>
    </div>
  );
};
