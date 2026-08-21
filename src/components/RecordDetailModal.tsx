import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Send,
  MapPin,
  Clock,
  Tag,
  ShieldCheck,
  Check,
  Copy,
  Layers,
  Sparkles,
  Calendar,
  Thermometer,
  Eye,
  FileSpreadsheet
} from 'lucide-react';
import { ScanRecord, StatusType } from '../types';

interface RecordDetailModalProps {
  record: ScanRecord;
  onClose: () => void;
  onReport: (record: ScanRecord) => void;
}

export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({
  record,
  onClose,
  onReport,
}) => {
  const [copiedHex, setCopiedHex] = useState(false);

  const getStatusBadge = (status: StatusType) => {
    switch (status) {
      case 'NORMAL':
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: CheckCircle2,
          text: 'NORMAL (SEGAR)',
          desc: 'Mutu pangan terjamin. Struktur kation flavilium antosianin stabil dalam lingkungan asam headspace.',
          actionGuidance: 'Aman untuk didistribusikan dan dikonsumsi siswa.',
        };
      case 'WASPADA':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-950',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: AlertTriangle,
          text: 'WASPADA (MENDEKATI BATAS)',
          desc: 'Terdeteksi akumulasi awal senyawa volatil basa (TVB-N) menyebabkan pergeseran warna menuju magenta keunguan.',
          actionGuidance: 'Prioritaskan konsumsi segera atau periksa suhu box pendingin.',
        };
      case 'BERISIKO':
        return {
          bg: 'bg-rose-50 border-rose-300 text-rose-950',
          badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: AlertOctagon,
          text: 'BERISIKO (TIDAK LAYAK)',
          desc: 'Pergeseran kromatisitas antosianin ke bentuk basa kuinoloidal (warna ungu kebiruan). Mutu pangan telah rusak.',
          actionGuidance: 'Karantina batch segera! Jangan dibagikan kepada penerima manfaat.',
        };
    }
  };

  const statusObj = getStatusBadge(record.status);
  const StatusIcon = statusObj.icon;

  const handleCopyHex = () => {
    navigator.clipboard.writeText(record.rgb.hex);
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 2000);
  };

  // Colorimetric calculations
  const totalRgb = Math.max(1, record.rgb.r + record.rgb.g + record.rgb.b);
  const rPct = Math.round((record.rgb.r / totalRgb) * 100);
  const gPct = Math.round((record.rgb.g / totalRgb) * 100);
  const bPct = Math.round((record.rgb.b / totalRgb) * 100);
  const rbRatio = (record.rgb.r / Math.max(1, record.rgb.b)).toFixed(2);

  return (
    <div
      id="record-detail-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Detail Pemindaian
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">ID: {record.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
          {/* Status Alert Banner */}
          <div className={`p-3.5 rounded-xl border ${statusObj.bg} space-y-1.5`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <StatusIcon className="w-5 h-5 flex-shrink-0" />
                <span className="text-xs font-black tracking-tight">{statusObj.text}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusObj.badgeBg}`}>
                {record.status}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">{statusObj.desc}</p>
            <div className="pt-1 text-[10px] font-semibold border-t border-black/10 flex items-center gap-1">
              <span>👉 Tindakan:</span>
              <span>{statusObj.actionGuidance}</span>
            </div>
          </div>

          {/* 1. Nilai RGB & Spektrofotometri Visual */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                Nilai Warna & RGB Sensor
              </span>
              <button
                onClick={handleCopyHex}
                className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs font-mono"
              >
                {copiedHex ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{record.rgb.hex}</span>
              </button>
            </div>

            {/* Swatch & Numerical Values */}
            <div className="flex items-center space-x-3.5 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
              <div
                className="w-14 h-14 rounded-xl shadow-inner border border-black/15 flex items-center justify-center relative flex-shrink-0"
                style={{ backgroundColor: record.rgb.hex }}
              >
                <div className="w-4 h-4 rounded-full bg-white/30 border border-white/50" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="grid grid-cols-3 gap-1 text-center font-mono">
                  <div className="bg-rose-50 border border-rose-200 rounded p-1">
                    <div className="text-[9px] text-rose-700 font-bold">R (Red)</div>
                    <div className="text-xs font-black text-rose-900">{record.rgb.r}</div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded p-1">
                    <div className="text-[9px] text-emerald-700 font-bold">G (Grn)</div>
                    <div className="text-xs font-black text-emerald-900">{record.rgb.g}</div>
                  </div>
                  <div className="bg-sky-50 border border-sky-200 rounded p-1">
                    <div className="text-[9px] text-sky-700 font-bold">B (Blue)</div>
                    <div className="text-xs font-black text-sky-900">{record.rgb.b}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                  <span>Rasio R/B: <strong className="text-slate-800">{rbRatio}x</strong></span>
                  {record.deltaEThreshold && (
                    <span>ΔE: <strong className="text-slate-800">{record.deltaEThreshold}</strong></span>
                  )}
                </div>
              </div>
            </div>

            {/* Visual Color Distribution Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Distribusi Kanal Warna:</span>
                <span>R: {rPct}% | G: {gPct}% | B: {bPct}%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-200">
                <div style={{ width: `${rPct}%` }} className="bg-rose-600 h-full" />
                <div style={{ width: `${gPct}%` }} className="bg-emerald-500 h-full" />
                <div style={{ width: `${bPct}%` }} className="bg-sky-600 h-full" />
              </div>
            </div>
          </div>

          {/* 2. Informasi Batch & Kemasan */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
              Informasi Kemasan & Lokasi
            </span>

            <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200/80 text-xs">
              {/* Batch ID */}
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span>ID / Batch:</span>
                </span>
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {record.batchId}
                </span>
              </div>

              {/* Menu */}
              {record.menuName && (
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>Menu Kemasan:</span>
                  </span>
                  <span className="font-semibold text-slate-800 text-right truncate max-w-[170px]">
                    {record.menuName}
                  </span>
                </div>
              )}

              {/* Lokasi */}
              <div className="flex justify-between items-start text-slate-600 pt-1 border-t border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Lokasi:</span>
                </span>
                <div className="text-right max-w-[180px]">
                  <div className="font-semibold text-slate-900">{record.locationCode}</div>
                  <div className="text-[10px] text-slate-500 leading-tight">{record.location}</div>
                </div>
              </div>

              {/* Waktu & Tanggal */}
              <div className="flex justify-between items-center text-slate-600 pt-1 border-t border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Waktu Pindai:</span>
                </span>
                <span className="font-mono font-semibold text-slate-800">
                  {record.displayDate}, {record.displayTime}
                </span>
              </div>

              {/* Pencahayaan Ambient */}
              {record.calibratedLux && (
                <div className="flex justify-between items-center text-slate-600 pt-1 border-t border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>Kalibrasi Lux:</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-700">
                    {record.calibratedLux}
                  </span>
                </div>
              )}

              {/* Status Pelaporan & Identitas Petugas */}
              <div className="flex justify-between items-center text-slate-600 pt-1 border-t border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Status Database M&E:</span>
                </span>
                <span
                  className={`font-bold text-[10px] px-2 py-0.5 rounded-full border ${
                    record.isReported
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {record.isReported ? '✓ Terverifikasi M&E' : 'Terekam Lokal'}
                </span>
              </div>
            </div>
          </div>

          {/* 3. IDENTITAS PENANGGUNG JAWAB / PELAPOR */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
              <span>Identitas Pelapor & Penanggung Jawab</span>
              <span className="text-[9px] font-mono text-rose-800 font-bold bg-rose-50 px-1.5 py-0.5 rounded">Tim Kipas Kopdes 1,8 Triliun</span>
            </span>

            <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Nama Penanggung Jawab:</span>
                <span className="font-bold text-slate-900 text-right text-[11px]">
                  {record.reportedBy || 'Dr. Alvindra Salsabian Lifanto, S.T.P., M.T., M.Gz., Ph.D.'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                <span className="text-slate-500">Peran / Jabatan:</span>
                <span className="font-semibold text-rose-800 text-[11px] bg-rose-50 px-2 py-0.5 rounded text-right">
                  {record.reporterRole || 'Koordinator Pengawas Mutu & Sensor Pangan MBG'}
                </span>
              </div>
              {record.reporterNip && (
                <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                  <span className="text-slate-500">NIP / ID Petugas:</span>
                  <span className="font-mono text-slate-700 text-[11px]">
                    {record.reporterNip}
                  </span>
                </div>
              )}
              {record.reporterOrg && (
                <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                  <span className="text-slate-500">Instansi / Unit:</span>
                  <span className="text-slate-700 text-[11px]">
                    {record.reporterOrg}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Catatan Tambahan Petugas jika ada */}
          {record.notes && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <span className="font-bold text-slate-700 block">Catatan Petugas Lapangan:</span>
              <p className="italic text-slate-700 bg-white p-2 rounded-lg border border-slate-200/60">
                "{record.notes}"
              </p>
            </div>
          )}

          {/* Validasi Ilmiah */}
          <div className="p-2.5 bg-rose-50/70 rounded-xl border border-rose-200/70 text-[10px] text-slate-600 leading-relaxed">
            <span className="font-bold text-rose-900">Landasan Ilmiah Antosianin Rosela: </span>
            Sistem colorimetric mendeteksi pelepasan gas amin volatil akibat proteolisis mikroba, mengubah antosianin rosela merah (pH &lt; 4.5) menjadi warna ungu/kebiruan (pH &gt; 6.5).
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex gap-2">
          {!record.isReported && (
            <button
              onClick={() => onReport(record)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-rose-800 hover:bg-rose-900 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Laporkan ke M&E</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-[0.98] font-semibold text-xs transition-all text-center"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
