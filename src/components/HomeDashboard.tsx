import React from 'react';
import { Camera, ChevronRight, CheckCircle2, AlertTriangle, AlertOctagon, Sparkles, Clock, MapPin, Layers, ArrowRight, ShieldCheck } from 'lucide-react';
import { ScanRecord, StatusType } from '../types';

interface HomeDashboardProps {
  latestRecord: ScanRecord | null;
  records: ScanRecord[];
  onStartScan: () => void;
  onViewAllHistory: () => void;
  onOpenRecordDetail: (record: ScanRecord) => void;
  onOpenInfo: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  latestRecord,
  records,
  onStartScan,
  onViewAllHistory,
  onOpenRecordDetail,
  onOpenInfo,
}) => {
  const totalCount = records.length;
  const recentRecords = records.slice(0, 3);

  const getStatusBadge = (status: StatusType) => {
    switch (status) {
      case 'NORMAL':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Normal
          </span>
        );
      case 'WASPADA':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Waspada
          </span>
        );
      case 'BERISIKO':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertOctagon className="w-3.5 h-3.5 mr-1 text-rose-600" />
            Berisiko
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-6">
      {/* 1. BAGIAN STATUS TERKINI */}
      <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-rose-600"></div>
            <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              Status Terkini
            </h2>
          </div>
          {latestRecord && (
            <span className="text-[11px] text-slate-400 font-mono">
              {latestRecord.displayTime}
            </span>
          )}
        </div>

        {latestRecord ? (
          <div
            onClick={() => onOpenRecordDetail(latestRecord)}
            className="cursor-pointer bg-slate-50 hover:bg-slate-100/80 rounded-xl p-3.5 border border-slate-200/90 transition-all"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center space-x-3">
                {/* Real Roselle Anthocyanin Color Swatch */}
                <div
                  className="w-10 h-10 rounded-lg shadow-inner border border-black/10 flex-shrink-0 flex items-center justify-center relative"
                  style={{ backgroundColor: latestRecord.rgb.hex }}
                  title={`RGB: ${latestRecord.rgb.r}, ${latestRecord.rgb.g}, ${latestRecord.rgb.b}`}
                >
                  <div className="w-3 h-3 rounded-full bg-white/40 border border-white/60"></div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500">
                    {latestRecord.batchId}
                  </div>
                  <div className="text-sm font-bold text-slate-900 line-clamp-1">
                    {latestRecord.menuName || 'Kemasan MBG'}
                  </div>
                </div>
              </div>
              <div>{getStatusBadge(latestRecord.status)}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{latestRecord.locationCode}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end font-mono text-[11px] text-slate-500">
                <span>RGB: {latestRecord.rgb.r}|{latestRecord.rgb.g}|{latestRecord.rgb.b}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-200 text-center text-slate-500 text-sm">
            <p className="font-medium text-slate-600">Belum ada hasil pemindaian</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Silakan pindai label indikator antosianin pada kemasan pangan.
            </p>
          </div>
        )}

        {/* TOMBOL UTAMA BESAR: SCAN LABEL */}
        <div className="mt-4">
          <button
            onClick={onStartScan}
            className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-800 via-rose-700 to-rose-600 text-white font-bold py-3.5 px-4 shadow-md shadow-rose-900/20 hover:shadow-lg hover:shadow-rose-900/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <Camera className="w-5 h-5 stroke-[2.5px] group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-base tracking-wide uppercase">SCAN LABEL</span>
          </button>
          <p className="text-center text-[11px] text-slate-500 mt-2 font-normal">
            Gunakan kamera untuk membaca warna indikator pada kemasan.
          </p>
        </div>
      </section>

      {/* 2. BAGIAN RINGKASAN MONITORING */}
      <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-3 flex items-center justify-between">
          <span>Ringkasan Monitoring</span>
          <span className="text-[11px] font-normal text-slate-400">Hari ini</span>
        </h2>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] text-slate-500">Total Monitoring</div>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">
              {totalCount} <span className="text-xs font-normal text-slate-500">sampel</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] text-slate-500">Pembacaan Terakhir</div>
            <div className="text-sm font-bold text-slate-800 mt-1 font-mono">
              {latestRecord ? latestRecord.displayTime : '-'}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] text-slate-500">Status Terakhir</div>
            <div className="mt-1">
              {latestRecord ? getStatusBadge(latestRecord.status) : <span className="text-xs text-slate-400">-</span>}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] text-slate-500">Lokasi Terakhir</div>
            <div className="text-xs font-semibold text-slate-800 mt-1 truncate" title={latestRecord?.location || '-'}>
              {latestRecord ? latestRecord.locationCode : '-'}
            </div>
          </div>
        </div>
      </section>

      {/* 3. BAGIAN RIWAYAT TERAKHIR */}
      <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
            Riwayat Pemindaian
          </h2>
          <button
            onClick={onViewAllHistory}
            className="text-xs font-semibold text-rose-700 hover:text-rose-800 flex items-center gap-0.5"
          >
            Lihat Semua
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentRecords.length > 0 ? (
          <div className="space-y-2">
            {recentRecords.map((item) => (
              <div
                key={item.id}
                onClick={() => onOpenRecordDetail(item)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors cursor-pointer text-xs"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  {/* Miniature swatch */}
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0"
                    style={{ backgroundColor: item.rgb.hex }}
                  />
                  <div className="font-mono text-slate-600 flex-shrink-0">
                    {item.displayTime}
                  </div>
                  <div className="text-slate-400">|</div>
                  <div className="text-slate-800 font-medium truncate">
                    {item.locationCode}
                  </div>
                </div>
                <div className="flex-shrink-0 ml-2">
                  {getStatusBadge(item.status)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-2">Belum ada riwayat tercatat</p>
        )}

        <button
          onClick={onViewAllHistory}
          className="w-full mt-3 py-2 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
        >
          Lihat Semua Riwayat ({totalCount})
        </button>
      </section>

      {/* 4. PRINCIPLE BOX: WARNA -> RGB -> KALIBRASI -> THRESHOLD -> STATUS */}
      <section className="bg-gradient-to-br from-rose-50/70 via-slate-50 to-white rounded-2xl p-4 border border-rose-100 text-xs text-slate-600">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 font-bold text-rose-900">
            <ShieldCheck className="w-4 h-4 text-rose-700" />
            <span>Prinsip Kerja Indikator Antosianin</span>
          </div>
          <button
            onClick={onOpenInfo}
            className="text-[11px] text-rose-700 underline font-medium hover:text-rose-900"
          >
            Pelajari
          </button>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed mb-2.5">
          Label indikator berada pada headspace kemasan pangan (tidak kontak langsung). Senyawa volatil basa memicu pergeseran warna antosianin rosela.
        </p>
        <div className="flex items-center justify-between text-[10px] font-mono bg-white p-2 rounded-lg border border-rose-100/80 text-slate-700 overflow-x-auto">
          <span className="font-semibold text-rose-900">WARNA</span>
          <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0 mx-0.5" />
          <span>RGB</span>
          <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0 mx-0.5" />
          <span>KALIBRASI</span>
          <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0 mx-0.5" />
          <span>THRESHOLD</span>
          <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0 mx-0.5" />
          <span className="font-semibold text-slate-900">STATUS</span>
        </div>
      </section>
    </div>
  );
};
