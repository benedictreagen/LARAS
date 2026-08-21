import React, { useState, useEffect } from 'react';
import { PhoneContainer } from './components/PhoneContainer';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { CameraScanner } from './components/CameraScanner';
import { ProcessingOverlay } from './components/ProcessingOverlay';
import { ResultView } from './components/ResultView';
import { HistoryView } from './components/HistoryView';
import { ProfileView } from './components/ProfileView';
import { RecordDetailModal } from './components/RecordDetailModal';
import { OfficerProfileModal } from './components/OfficerProfileModal';
import { ScienceInfoModal } from './components/ScienceInfoModal';
import { ScanRecord, RGBColor, IndicatorPreset, OfficerProfile } from './types';
import {
  INITIAL_RECORDS,
  DISTRIBUTION_POINTS,
  DEFAULT_OFFICER_PROFILE,
  SAMPLE_INDICATOR_PRESETS,
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'scan' | 'history' | 'profile'>('home');
  const [scanStep, setScanStep] = useState<'camera' | 'processing' | 'result'>('camera');

  // Officer / Reporter Profile State
  const [officerProfile, setOfficerProfile] = useState<OfficerProfile>(() => {
    const saved = localStorage.getItem('laras_officer_profile_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_OFFICER_PROFILE;
      }
    }
    return DEFAULT_OFFICER_PROFILE;
  });

  // Scan Records State
  const [records, setRecords] = useState<ScanRecord[]>(() => {
    const saved = localStorage.getItem('laras_mbg_records_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_RECORDS;
      }
    }
    return INITIAL_RECORDS;
  });

  const [selectedLocationCode, setSelectedLocationCode] = useState<string>('SMPN 1 Juwana');
  const [currentScannedRgb, setCurrentScannedRgb] = useState<RGBColor>({
    r: 188,
    g: 52,
    b: 74,
    hex: '#BC344A',
  });
  const [currentPreset, setCurrentPreset] = useState<IndicatorPreset | undefined>(undefined);
  const [currentLuxLevel, setCurrentLuxLevel] = useState<'Optimal' | 'Cukup' | 'Rendah'>('Optimal');

  // Modals & Toasts
  const [selectedDetailRecord, setSelectedDetailRecord] = useState<ScanRecord | null>(null);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync records to localStorage
  useEffect(() => {
    localStorage.setItem('laras_mbg_records_v3', JSON.stringify(records));
  }, [records]);

  // Sync profile to localStorage
  useEffect(() => {
    localStorage.setItem('laras_officer_profile_v3', JSON.stringify(officerProfile));
  }, [officerProfile]);

  // Find latest record
  const latestRecord = records.length > 0 ? records[0] : null;

  // Selected location object
  const currentLocationObj =
    DISTRIBUTION_POINTS.find((l) => l.code === selectedLocationCode) ||
    DISTRIBUTION_POINTS[1];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleStartScan = () => {
    setScanStep('camera');
    setActiveTab('scan');
  };

  const handleCaptureImage = (data: {
    rgb: RGBColor;
    preset?: IndicatorPreset;
    luxLevel: 'Optimal' | 'Cukup' | 'Rendah';
  }) => {
    setCurrentScannedRgb(data.rgb);
    setCurrentPreset(data.preset);
    setCurrentLuxLevel(data.luxLevel);
    setScanStep('processing');
  };

  const handleProcessingComplete = () => {
    setScanStep('result');
  };

  const handleSaveRecord = (record: ScanRecord) => {
    setRecords((prev) => [record, ...prev]);
    triggerToast('✓ Hasil berhasil direkam ke database');
  };

  const handleReportRecord = (record: ScanRecord) => {
    setRecords((prev) => {
      const existingIdx = prev.findIndex((r) => r.id === record.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], isReported: true };
        return updated;
      } else {
        return [record, ...prev];
      }
    });
    triggerToast('✓ Hasil berhasil dilaporkan ke sistem M&E BGN');
  };

  return (
    <PhoneContainer>
      {/* GLOBAL TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-xl border border-white/20 flex items-center gap-2 backdrop-blur-md animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER (Visible on Home, History, & Profile; Scanner has its own top bar) */}
      {(activeTab === 'home' || activeTab === 'history' || activeTab === 'profile') && (
        <Header
          onOpenInfo={() => setShowInfoModal(true)}
          onOpenProfile={() => setShowProfileModal(true)}
          officerProfile={officerProfile}
          selectedLocation={selectedLocationCode}
          onChangeLocation={setSelectedLocationCode}
          locations={DISTRIBUTION_POINTS}
        />
      )}

      {/* MAIN CONTENT ROUTING */}
      <main className="flex-1 p-3.5 flex flex-col">
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <HomeDashboard
            latestRecord={latestRecord}
            records={records}
            onStartScan={handleStartScan}
            onViewAllHistory={() => setActiveTab('history')}
            onOpenRecordDetail={(rec) => setSelectedDetailRecord(rec)}
            onOpenInfo={() => setShowInfoModal(true)}
          />
        )}

        {/* TAB 2: SCAN WORKFLOW */}
        {activeTab === 'scan' && (
          <div className="flex-1 flex flex-col">
            {scanStep === 'camera' && (
              <CameraScanner
                onCapture={handleCaptureImage}
                onCancel={() => setActiveTab('home')}
                selectedLocation={currentLocationObj.name}
              />
            )}

            {scanStep === 'processing' && (
              <div className="flex-1 flex items-center justify-center py-6">
                <ProcessingOverlay
                  scannedRgb={currentScannedRgb}
                  onComplete={handleProcessingComplete}
                />
              </div>
            )}

            {scanStep === 'result' && (
              <ResultView
                scannedRgb={currentScannedRgb}
                batchId={
                  currentPreset
                    ? currentPreset.batchId
                    : `MBG-JNA-${Math.floor(100 + Math.random() * 900)}`
                }
                menuName={currentPreset ? currentPreset.menuItem : 'Menu MBG Pilihan'}
                location={currentLocationObj.name}
                locationCode={currentLocationObj.code}
                luxLevel={currentLuxLevel}
                officerProfile={officerProfile}
                onSaveRecord={handleSaveRecord}
                onReportRecord={handleReportRecord}
                onScanAgain={() => setScanStep('camera')}
                onGoHome={() => setActiveTab('home')}
              />
            )}
          </div>
        )}

        {/* TAB 3: RIWAYAT MONITORING & EVALUASI */}
        {activeTab === 'history' && (
          <HistoryView
            records={records}
            onOpenRecordDetail={(rec) => setSelectedDetailRecord(rec)}
            onStartScan={handleStartScan}
            locations={DISTRIBUTION_POINTS}
          />
        )}

        {/* TAB 4: PROFIL PENANGGUNG JAWAB & SPPG */}
        {activeTab === 'profile' && (
          <ProfileView
            profile={officerProfile}
            records={records}
            onOpenEditModal={() => setShowProfileModal(true)}
            onViewHistory={() => setActiveTab('history')}
          />
        )}
      </main>

      {/* BOTTOM NAVIGATION (Hidden only during active camera view) */}
      {!(activeTab === 'scan' && scanStep === 'camera') && (
        <BottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'scan') {
              setScanStep('camera');
            }
          }}
        />
      )}

      {/* DETAIL MODAL */}
      {selectedDetailRecord && (
        <RecordDetailModal
          record={selectedDetailRecord}
          onClose={() => setSelectedDetailRecord(null)}
          onReport={(rec) => {
            handleReportRecord(rec);
            setSelectedDetailRecord({ ...rec, isReported: true });
          }}
        />
      )}

      {/* OFFICER PROFILE MODAL */}
      {showProfileModal && (
        <OfficerProfileModal
          profile={officerProfile}
          onSaveProfile={(updated) => {
            setOfficerProfile(updated);
            triggerToast('✓ Profil petugas berhasil diperbarui');
          }}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* SCIENCE INFO MODAL */}
      {showInfoModal && (
        <ScienceInfoModal onClose={() => setShowInfoModal(false)} />
      )}
    </PhoneContainer>
  );
}
