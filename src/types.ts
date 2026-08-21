export type StatusType = 'NORMAL' | 'WASPADA' | 'BERISIKO';

export interface RGBColor {
  r: number;
  g: number;
  b: number;
  hex: string;
}

export interface OfficerProfile {
  name: string;
  role: 'SPPG' | 'PENGAWAS' | 'PJ_SEKOLAH' | 'PETUGAS_GIZI';
  roleLabel: string;
  nip: string;
  organization: string;
  assignedLocation: string;
  contactNumber: string;
}

export interface CalibrationData {
  ambientLuxLevel: 'Optimal' | 'Cukup' | 'Rendah';
  illuminantCompensation: number; // e.g. 1.02
  deltaE: number; // calculated distance
  dominantWavelengthNm?: number;
}

export interface IndicatorPreset {
  id: string;
  name: string;
  menuItem: string;
  batchId: string;
  stageName: string;
  rgb: { r: number; g: number; b: number; hex: string };
  expectedStatus: StatusType;
  description: string;
  sensoryVisual: string;
}

export interface ScanRecord {
  id: string;
  timestamp: string; // ISO string or formatted
  displayTime: string; // "10:42 WIB"
  displayDate: string; // "15 Aug 2026"
  location: string;
  locationCode: string;
  batchId: string;
  menuName: string;
  rgb: RGBColor;
  status: StatusType;
  isReported: boolean;
  notes?: string;
  calibratedLux?: string;
  deltaEThreshold?: number;
  // Officer & Reporter Identification
  reportedBy?: string;
  reporterRole?: string;
  reporterNip?: string;
  reporterOrg?: string;
}

export interface MonitoringStats {
  total: number;
  normal: number;
  waspada: number;
  berisiko: number;
  lastScanTime?: string;
  lastLocation?: string;
  lastStatus?: StatusType;
}
