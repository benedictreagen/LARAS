import React, { useState, useMemo } from 'react';
import {
  Filter,
  Calendar,
  MapPin,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Download,
  ChevronRight,
  FileSpreadsheet,
  TrendingUp,
  X,
  SlidersHorizontal,
  Sparkles,
  Info
} from 'lucide-react';
import { ScanRecord, StatusType } from '../types';
import { RgbTrendChart } from './RgbTrendChart';

interface HistoryViewProps {
  records: ScanRecord[];
  onOpenRecordDetail: (record: ScanRecord) => void;
  onStartScan: () => void;
  locations: { id: string; code: string; name: string }[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  records,
  onOpenRecordDetail,
  onStartScan,
  locations,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterLocation, setFilterLocation] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showChart, setShowChart] = useState<boolean>(true);

  // Compute stats for M&E Summary
  const stats = useMemo(() => {
    const total = records.length;
    const normal = records.filter((r) => r.status === 'NORMAL').length;
    const waspada = records.filter((r) => r.status === 'WASPADA').length;
    const berisiko = records.filter((r) => r.status === 'BERISIKO').length;

    return { total, normal, waspada, berisiko };
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
      const matchLocation = filterLocation === 'ALL' || r.locationCode === filterLocation;
      const matchQuery =
        searchQuery.trim() === '' ||
        r.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.menuName && r.menuName.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchStatus && matchLocation && matchQuery;
    });
  }, [records, filterStatus, filterLocation, searchQuery]);

  const getStatusBadge = (status: StatusType) => {
    switch (status) {
      case 'NORMAL':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
            Normal
          </span>
        );
      case 'WASPADA':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
            Waspada
          </span>
        );
      case 'BERISIKO':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertOctagon className="w-3 h-3 mr-1 text-rose-600" />
            Berisiko
          </span>
        );
    }
  };

  const handleExportCSV = () => {
    const header = 'Timestamp,Waktu,Tanggal,Lokasi,Batch ID,Menu,Status,RGB_R,RGB_G,RGB_B,Hex,Status Lapor,Pelapor,Jabatan_PJ,NIP_ID\n';
    const rows = records
      .map(
        (r) =>
          `"${r.timestamp}","${r.displayTime}","${r.displayDate}","${r.location}","${r.batchId}","${r.menuName}","${r.status}",${r.rgb.r},${r.rgb.g},${r.rgb.b},"${r.rgb.hex}","${r.isReported ? 'Sudah Dilaporkan' : 'Terekam Lokal'}","${r.reportedBy || '-'}","${r.reporterRole || '-'}","${r.reporterNip || '-'}"`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `laras_mbg_monitor_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* 1. BAGIAN MONITORING & EVALUASI (M&E) STATS */}
      <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
            Ringkasan Monitoring Mutu
          </h2>
          <button
            onClick={handleExportCSV}
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md border border-slate-200 transition-colors"
            title="Ekspor CSV untuk evaluasi"
          >
            <Download className="w-3 h-3" />
            <span>Ekspor CSV</span>
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-center">
            <div className="text-[10px] text-slate-500 font-medium">Total</div>
            <div className="text-lg font-black text-slate-900 mt-0.5">{stats.total}</div>
          </div>

          <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/70 text-center">
            <div className="text-[10px] text-emerald-700 font-medium">Normal</div>
            <div className="text-lg font-black text-emerald-800 mt-0.5">{stats.normal}</div>
          </div>

          <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/70 text-center">
            <div className="text-[10px] text-amber-700 font-medium">Waspada</div>
            <div className="text-lg font-black text-amber-800 mt-0.5">{stats.waspada}</div>
          </div>

          <div className="bg-rose-50/70 p-2.5 rounded-xl border border-rose-200/70 text-center">
            <div className="text-[10px] text-rose-700 font-medium">Berisiko</div>
            <div className="text-lg font-black text-rose-800 mt-0.5">{stats.berisiko}</div>
          </div>
        </div>

        {/* M&E Scientific Statement */}
        <p className="text-[11px] text-slate-500 mt-3 pt-2.5 border-t border-slate-100 leading-relaxed">
          "Data monitoring digunakan untuk evaluasi pola perubahan mutu dan kinerja sistem indikator selama distribusi."
        </p>
      </section>

      {/* 2. GRAFIK TREN PERUBAHAN WARNA (RGB) DARI WAKTU KE WAKTU */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
            <span>Grafik Tren Warna (RGB)</span>
          </span>
          <button
            onClick={() => setShowChart(!showChart)}
            className="text-[11px] font-semibold text-rose-800 hover:text-rose-950"
          >
            {showChart ? 'Sembunyikan Grafik' : 'Tampilkan Grafik'}
          </button>
        </div>

        {showChart && (
          <RgbTrendChart
            records={filteredRecords.length > 0 ? filteredRecords : records}
            onSelectRecord={onOpenRecordDetail}
          />
        )}
      </section>

      {/* 3. FILTER & PENCARIAN */}
      <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter Riwayat</span>
          </div>

          {(filterStatus !== 'ALL' || filterLocation !== 'ALL' || searchQuery !== '') && (
            <button
              onClick={() => {
                setFilterStatus('ALL');
                setFilterLocation('ALL');
                setSearchQuery('');
              }}
              className="text-[11px] text-rose-700 hover:text-rose-900 font-medium flex items-center gap-0.5"
            >
              <X className="w-3 h-3" />
              Reset Filter
            </button>
          )}
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari ID batch, menu, atau lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'ALL', label: 'Semua Status' },
            { id: 'NORMAL', label: 'Normal' },
            { id: 'WASPADA', label: 'Waspada' },
            { id: 'BERISIKO', label: 'Berisiko' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterStatus(item.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                filterStatus === item.id
                  ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Location Dropdown Filter */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">Filter Lokasi:</span>
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500 max-w-[200px] truncate"
          >
            <option value="ALL">Semua Titik Distribusi</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.code}>
                {loc.code}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* 4. DAFTAR RIWAYAT DENGAN KLIK INTERAKTIF KE DETAIL POP-UP */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Daftar Pemindaian ({filteredRecords.length})
          </span>
          <span className="text-[11px] text-slate-400">Klik entri untuk info lengkap</span>
        </div>

        {filteredRecords.length > 0 ? (
          <div className="space-y-2">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                id={`record-card-${record.id}`}
                onClick={() => onOpenRecordDetail(record)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onOpenRecordDetail(record);
                  }
                }}
                className="group bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:border-rose-300 hover:shadow-md active:scale-[0.99] transition-all cursor-pointer text-xs"
              >
                {/* Header row: Date & Time, Status Badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 text-slate-600 font-mono text-[11px]">
                    <span className="font-semibold text-slate-800">{record.displayDate}</span>
                    <span className="text-slate-300">•</span>
                    <span>{record.displayTime}</span>
                  </div>
                  <div>{getStatusBadge(record.status)}</div>
                </div>

                {/* Main row: Location, Batch ID, Menu & Reporter */}
                <div className="flex items-center justify-between mb-2">
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="font-bold text-slate-900 group-hover:text-rose-900 transition-colors truncate">
                      {record.locationCode}
                    </div>
                    {record.menuName && (
                      <div className="text-[11px] text-slate-500 truncate">
                        {record.menuName}
                      </div>
                    )}
                    {record.reportedBy && (
                      <div className="text-[10px] text-slate-400 truncate mt-0.5 flex items-center gap-1">
                        <span className="text-slate-500 font-medium">PJ:</span>
                        <span>{record.reportedBy}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-mono text-[11px] bg-slate-100 group-hover:bg-rose-50 group-hover:text-rose-900 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200/80 transition-colors">
                      {record.batchId}
                    </span>
                  </div>
                </div>

                {/* Footer row: Color Swatch + RGB Values + Detail Action Callout */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center space-x-2">
                    {/* Real Anthocyanin Color Swatch */}
                    <div
                      className="w-4 h-4 rounded-full border border-black/15 shadow-2xs flex-shrink-0"
                      style={{ backgroundColor: record.rgb.hex }}
                      title={`Hex: ${record.rgb.hex}`}
                    />
                    <span className="font-mono text-slate-700">
                      RGB {record.rgb.r} | {record.rgb.g} | {record.rgb.b}
                    </span>
                  </div>

                  <div className="flex items-center font-semibold text-rose-700 group-hover:text-rose-900 group-hover:translate-x-0.5 transition-all">
                    <span>Lihat Detail</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500">
            <p className="font-medium text-sm text-slate-700">Tidak ada data yang cocok</p>
            <p className="text-xs text-slate-400 mt-1">
              Coba sesuaikan filter atau lakukan pemindaian baru.
            </p>
            <button
              onClick={onStartScan}
              className="mt-4 px-4 py-2 rounded-xl bg-rose-800 text-white font-bold text-xs shadow-sm hover:bg-rose-900"
            >
              Scan Label Sekarang
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
