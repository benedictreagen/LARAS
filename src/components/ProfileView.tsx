import React from 'react';
import {
  User,
  ShieldCheck,
  Building2,
  MapPin,
  Phone,
  Tag,
  Check,
  Edit3,
  Award,
  Sparkles,
  ChevronRight,
  FileSpreadsheet
} from 'lucide-react';
import { OfficerProfile, ScanRecord } from '../types';
import { BgnLogo } from './BgnLogo';

interface ProfileViewProps {
  profile: OfficerProfile;
  records: ScanRecord[];
  onOpenEditModal: () => void;
  onViewHistory: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  records,
  onOpenEditModal,
  onViewHistory,
}) => {
  const officerRecords = records.filter(
    (r) => r.reportedBy === profile.name || r.locationCode === profile.assignedLocation
  );

  return (
    <div className="space-y-4 pb-8">
      {/* Officer ID Card (Lencana Resmi BGN, LARAS & SPPG) */}
      <section className="bg-gradient-to-br from-rose-900 via-rose-800 to-rose-950 text-white rounded-2xl p-5 shadow-lg border border-rose-700/60 relative overflow-hidden">
        {/* Background decorative watermark */}
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
          <BgnLogo size="xl" />
        </div>

        {/* Tim Kipas Kopdes Watermark Tag */}
        <div className="absolute top-2 right-3 z-10">
          <span className="text-[9px] font-extrabold uppercase tracking-wider bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 text-rose-200">
            Tim Kipas Kopdes 1,8 Triliun
          </span>
        </div>

        <div className="flex items-start justify-between relative z-10 mb-4 mt-3">
          <div className="flex items-center space-x-3">
            <div className="p-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex-shrink-0">
              <BgnLogo size="lg" />
            </div>
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-200">
                  BADAN GIZI NASIONAL
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <h2 className="text-sm sm:text-base font-black tracking-tight text-white leading-snug">
                {profile.name}
              </h2>
              <p className="text-[10.5px] text-rose-100 font-medium line-clamp-1">
                {profile.roleLabel}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenEditModal}
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 transition-all active:scale-95 flex-shrink-0"
            title="Edit Profil"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-rose-700/80 text-[11px] text-rose-100 relative z-10">
          <div>
            <div className="text-[10px] text-rose-300">NIP / ID Petugas:</div>
            <div className="font-mono font-bold text-white truncate">{profile.nip || '-'}</div>
          </div>
          <div>
            <div className="text-[10px] text-rose-300">Unit Satuan Pelayanan:</div>
            <div className="font-semibold text-white truncate">{profile.organization}</div>
          </div>
          <div className="col-span-2 pt-1">
            <div className="text-[10px] text-rose-300">Titik Penugasan MBG:</div>
            <div className="font-semibold text-white truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-300 flex-shrink-0" />
              <span>{profile.assignedLocation}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Monitoring Performance & Activity by This Officer */}
      <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Aktivitas Monitoring Petugas
          </h3>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            ✓ Terverifikasi Aktif
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-500">Total Scan</div>
            <div className="text-lg font-black text-slate-900 mt-0.5">{officerRecords.length}</div>
          </div>
          <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
            <div className="text-[10px] text-emerald-700">Lolos Mutu</div>
            <div className="text-lg font-black text-emerald-900 mt-0.5">
              {officerRecords.filter((r) => r.status === 'NORMAL').length}
            </div>
          </div>
          <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200">
            <div className="text-[10px] text-rose-700">Tercatat Lapor</div>
            <div className="text-lg font-black text-rose-900 mt-0.5">
              {officerRecords.filter((r) => r.isReported).length}
            </div>
          </div>
        </div>

        <button
          onClick={onViewHistory}
          className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
        >
          <span>Lihat Log Verifikasi di Database</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </section>

      {/* Instansi & Program Details */}
      <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5 text-xs text-slate-700">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Informasi Program & Pengawasan
        </h3>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Program:</span>
            <span className="font-semibold text-slate-900">Makan Bergizi Gratis (MBG)</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
            <span className="text-slate-500">Lembaga Penyelenggara:</span>
            <span className="font-semibold text-slate-900">Badan Gizi Nasional (BGN)</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
            <span className="text-slate-500">Inisiator Pengawas:</span>
            <span className="font-bold text-rose-800">Tim Kipas Kopdes 1,8 Triliun</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
            <span className="text-slate-500">Aplikasi Pengawasan:</span>
            <span className="font-bold text-rose-800">LARAS v1.2</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
            <span className="text-slate-500">Teknologi Sensor:</span>
            <span className="font-medium text-slate-800">Colorimetric Roselle Anthocyanin Film</span>
          </div>
        </div>
      </section>

      {/* Tombol Ubah / Ganti Profil */}
      <button
        onClick={onOpenEditModal}
        className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
      >
        <Edit3 className="w-4 h-4" />
        <span>Ganti / Sesuaikan Data Profil</span>
      </button>
    </div>
  );
};
