import React, { useState, useMemo } from 'react';
import { TrendingUp, Info, Activity, Layers, Calendar, ChevronRight } from 'lucide-react';
import { ScanRecord } from '../types';

interface RgbTrendChartProps {
  records: ScanRecord[];
  onSelectRecord: (record: ScanRecord) => void;
}

export const RgbTrendChart: React.FC<RgbTrendChartProps> = ({ records, onSelectRecord }) => {
  const [selectedChannel, setSelectedChannel] = useState<'ALL' | 'R' | 'G' | 'B' | 'RATIO'>('ALL');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Sort records chronologically (oldest to newest) for accurate time-series trend
  const chronologicalRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime() || 0;
      const timeB = new Date(b.timestamp).getTime() || 0;
      return timeA - timeB;
    });
  }, [records]);

  if (chronologicalRecords.length === 0) {
    return null;
  }

  // Chart dimensions & layout
  const width = 360;
  const height = 180;
  const padding = { top: 24, right: 18, bottom: 32, left: 34 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const count = chronologicalRecords.length;

  // Calculate coordinates
  const getX = (index: number) => {
    if (count === 1) return padding.left + chartWidth / 2;
    return padding.left + (index / (count - 1)) * chartWidth;
  };

  // Channel R/G/B (0 - 255) to Y
  const getY = (val: number, maxVal = 255) => {
    const clamped = Math.max(0, Math.min(maxVal, val));
    return padding.top + chartHeight - (clamped / maxVal) * chartHeight;
  };

  // Ratio R/B (typically 0.4 to 4.0) to Y
  const maxRatio = 4.0;
  const getRatioY = (r: number, b: number) => {
    const ratio = b > 0 ? r / b : 0;
    const clamped = Math.max(0, Math.min(maxRatio, ratio));
    return padding.top + chartHeight - (clamped / maxRatio) * chartHeight;
  };

  // Generate SVG path for a channel
  const makePath = (channel: 'r' | 'g' | 'b') => {
    if (count === 0) return '';
    return chronologicalRecords
      .map((rec, i) => {
        const x = getX(i);
        const y = getY(rec.rgb[channel]);
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  // Generate SVG path for R/B Ratio
  const makeRatioPath = () => {
    if (count === 0) return '';
    return chronologicalRecords
      .map((rec, i) => {
        const x = getX(i);
        const y = getRatioY(rec.rgb.r, rec.rgb.b);
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const activeRecord = hoveredIndex !== null ? chronologicalRecords[hoveredIndex] : null;

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800">Tren Perubahan Warna (RGB)</h3>
            <p className="text-[10px] text-slate-500">Dinamika kromatisitas antosianin dari waktu ke waktu</p>
          </div>
        </div>
      </div>

      {/* Channel Switcher */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px]">
        {[
          { id: 'ALL', label: 'Semua (RGB)', color: 'text-slate-800' },
          { id: 'R', label: 'R (Merah)', color: 'text-rose-600' },
          { id: 'G', label: 'G (Hijau)', color: 'text-emerald-600' },
          { id: 'B', label: 'B (Biru)', color: 'text-sky-600' },
          { id: 'RATIO', label: 'Rasio R/B', color: 'text-amber-700' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setSelectedChannel(btn.id as any)}
            className={`flex-1 py-1 px-1.5 rounded-lg font-semibold transition-all text-center truncate ${
              selectedChannel === btn.id
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className={selectedChannel === btn.id ? btn.color : ''}>{btn.label}</span>
          </button>
        ))}
      </div>

      {/* SVG Chart Container */}
      <div className="relative bg-slate-50/80 rounded-xl p-2 border border-slate-100">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Y-Axis Grid Lines & Labels */}
          {selectedChannel !== 'RATIO' ? (
            <>
              {[255, 192, 128, 64, 0].map((val) => {
                const y = getY(val);
                return (
                  <g key={val}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={width - padding.right}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      strokeDasharray={val === 0 || val === 255 ? '0' : '2,2'}
                    />
                    <text
                      x={padding.left - 6}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="9"
                      fill="#94a3b8"
                      fontFamily="monospace"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}
            </>
          ) : (
            <>
              {[4, 3, 2, 1, 0].map((val) => {
                const y = getRatioY(val, 1);
                return (
                  <g key={val}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={width - padding.right}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      strokeDasharray={val === 0 || val === 4 ? '0' : '2,2'}
                    />
                    <text
                      x={padding.left - 6}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="9"
                      fill="#94a3b8"
                      fontFamily="monospace"
                    >
                      {val}x
                    </text>
                  </g>
                );
              })}
            </>
          )}

          {/* Quality Threshold Background Zone for R/B Ratio */}
          {selectedChannel === 'RATIO' && (
            <>
              {/* Safe zone: Ratio > 2.0 */}
              <rect
                x={padding.left}
                y={getY(255)}
                width={chartWidth}
                height={getRatioY(2.0, 1) - getY(255)}
                fill="#10b981"
                fillOpacity="0.06"
              />
              {/* Caution zone: 1.2 - 2.0 */}
              <rect
                x={padding.left}
                y={getRatioY(2.0, 1)}
                width={chartWidth}
                height={getRatioY(1.2, 1) - getRatioY(2.0, 1)}
                fill="#f59e0b"
                fillOpacity="0.08"
              />
              {/* Risk zone: < 1.2 */}
              <rect
                x={padding.left}
                y={getRatioY(1.2, 1)}
                width={chartWidth}
                height={getY(0) - getRatioY(1.2, 1)}
                fill="#e11d48"
                fillOpacity="0.08"
              />
            </>
          )}

          {/* Channels Lines */}
          {selectedChannel !== 'RATIO' && (
            <>
              {/* R (Red Channel Line) */}
              {(selectedChannel === 'ALL' || selectedChannel === 'R') && (
                <path
                  d={makePath('r')}
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* G (Green Channel Line) */}
              {(selectedChannel === 'ALL' || selectedChannel === 'G') && (
                <path
                  d={makePath('g')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray={selectedChannel === 'ALL' ? '3,2' : '0'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* B (Blue Channel Line) */}
              {(selectedChannel === 'ALL' || selectedChannel === 'B') && (
                <path
                  d={makePath('b')}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </>
          )}

          {/* R/B Ratio Line */}
          {selectedChannel === 'RATIO' && (
            <path
              d={makeRatioPath()}
              fill="none"
              stroke="#b45309"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points on Nodes */}
          {chronologicalRecords.map((rec, i) => {
            const x = getX(i);
            const isHovered = hoveredIndex === i;
            const statusColor =
              rec.status === 'NORMAL'
                ? '#10b981'
                : rec.status === 'WASPADA'
                ? '#f59e0b'
                : '#e11d48';

            let dotY = getY(rec.rgb.r);
            if (selectedChannel === 'G') dotY = getY(rec.rgb.g);
            if (selectedChannel === 'B') dotY = getY(rec.rgb.b);
            if (selectedChannel === 'RATIO') dotY = getRatioY(rec.rgb.r, rec.rgb.b);

            return (
              <g
                key={rec.id}
                className="cursor-pointer transition-transform"
                onClick={() => onSelectRecord(rec)}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Vertical indicator line when active */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={height - padding.bottom}
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                )}

                {/* Outer Status Ring */}
                <circle
                  cx={x}
                  cy={dotY}
                  r={isHovered ? 7 : 5}
                  fill={rec.rgb.hex}
                  stroke={statusColor}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                />

                {/* X-axis Label: Time & Date */}
                <text
                  x={x}
                  y={height - 12}
                  textAnchor="middle"
                  fontSize="8"
                  fill={isHovered ? '#0f172a' : '#64748b'}
                  fontWeight={isHovered ? '700' : '500'}
                  fontFamily="sans-serif"
                >
                  {rec.displayTime.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip if point is clicked / hovered */}
        {activeRecord && (
          <div
            onClick={() => onSelectRecord(activeRecord)}
            className="mt-2 p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center space-x-2.5">
              <div
                className="w-5 h-5 rounded-full border border-black/15 shadow-2xs flex-shrink-0"
                style={{ backgroundColor: activeRecord.rgb.hex }}
              />
              <div className="text-left">
                <div className="flex items-center space-x-1.5">
                  <span className="font-mono text-[11px] font-bold text-slate-900">
                    {activeRecord.batchId}
                  </span>
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {activeRecord.displayTime}
                  </span>
                </div>
                <div className="text-[10px] text-slate-600 font-mono">
                  R:{activeRecord.rgb.r} G:{activeRecord.rgb.g} B:{activeRecord.rgb.b} | Rasio R/B:{' '}
                  {(activeRecord.rgb.r / Math.max(1, activeRecord.rgb.b)).toFixed(2)}x
                </div>
              </div>
            </div>

            <div className="flex items-center text-[11px] font-semibold text-rose-700">
              <span>Buka Detail</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Legend & Scientific Insights */}
      <div className="space-y-2 pt-1 border-t border-slate-100">
        <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-600">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"></span>
              Kanal R (Merah)
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              Kanal G (Hijau)
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block"></span>
              Kanal B (Biru)
            </span>
          </div>
          <span className="text-slate-400 font-mono text-[9px]">{chronologicalRecords.length} titik data</span>
        </div>

        {/* Bio-chemical explanation */}
        <div className="p-2 bg-amber-50/70 border border-amber-200/80 rounded-lg text-[10px] text-amber-900 leading-tight flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Wawasan Tren Mutu:</strong> Penurunan nilai kanal <strong>R (Merah)</strong> dan peningkatan relatif kanal <strong>B (Biru)</strong> menandakan kenaikan senyawa volatil basa (TVB-N) yang memicu degradasi antosianin rosela.
          </span>
        </div>
      </div>
    </div>
  );
};
