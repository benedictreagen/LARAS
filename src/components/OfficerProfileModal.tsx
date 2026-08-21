import React, { useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Building2,
  MapPin,
  Phone,
  Tag,
  Check,
  Sparkles,
  Edit3,
  Award,
  RefreshCw
} from 'lucide-react';
import { OfficerProfile } from '../types';
import { OFFICER_ROLES, DISTRIBUTION_POINTS } from '../data/mockData';
import { BgnLogo } from './BgnLogo';

interface OfficerProfileModalProps {
  profile: OfficerProfile;
  onSaveProfile: (profile: OfficerProfile) => void;
  onClose: () => void;
}

export const OfficerProfileModal: React.FC<OfficerProfileModalProps> = ({
  profile,
  onSaveProfile,
  onClose,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<OfficerProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsEditing(false);
    }, 1000);
  };

  const handleRoleChange = (roleKey: string) => {
    const foundRole = OFFICER_ROLES.find((r) => r.id === roleKey);
    setFormData((prev) => ({
      ...prev,
      role: roleKey as any,
      roleLabel: foundRole ? foundRole.label : prev.roleLabel,
    }));
  };

  // Quick Preset Profiles for testing convenience
  const applyPreset = (presetType: 'SPPG' | 'PENGAWAS' | 'PJ_SDN' | 'PJ_SMPN' | 'PJ_SMAN') => {
    switch (presetType) {
      case 'SPPG':
        setFormData({
          name: 'Dr. Alvindra Salsabian Lifanto, S.T.P., M.T., M.Gz., Ph.D.',
          role: 'SPPG',
          roleLabel: 'Koordinator Pengawas Mutu & Sensor Pangan MBG',
          nip: '19900315 201503 1 002',
          organization: 'Badan Gizi Nasional (BGN) • Tim Kipas Kopdes 1,8 Triliun',
          assignedLocation: 'SMPN 1 Juwana',
          contactNumber: '0812-3344-5588',
        });
        break;
      case 'PENGAWAS':
        setFormData({
          name: 'Ahmad Fauzi, M.Si',
          role: 'PENGAWAS',
          roleLabel: 'Pengawas Badan Gizi Nasional (BGN)',
          nip: '19810305 200604 1 005',
          organization: 'Inspektorat Mutu BGN Wilayah Jawa Tengah',
          assignedLocation: 'Semua Titik Distribusi Juwana & Pati',
          contactNumber: '0812-9876-5432',
        });
        break;
      case 'PJ_SDN':
        setFormData({
          name: 'Nurul Hidayah, S.Pd.SD',
          role: 'PJ_SEKOLAH',
          roleLabel: 'Penanggung Jawab (PJ) Sekolah',
          nip: '19871103 201101 2 009',
          organization: 'SDN 02 Kebonsawahan',
          assignedLocation: 'SDN 02 Kebonsawahan',
          contactNumber: '0857-4123-8890',
        });
        break;
      case 'PJ_SMPN':
        setFormData({
          name: 'Budi Santoso, S.Pd',
          role: 'PJ_SEKOLAH',
          roleLabel: 'Penanggung Jawab (PJ) Sekolah',
          nip: '19820514 200801 1 012',
          organization: 'SMPN 1 Juwana',
          assignedLocation: 'SMPN 1 Juwana',
          contactNumber: '0815-6678-9901',
        });
        break;
      case 'PJ_SMAN':
        setFormData({
          name: 'Drs. Hendro Wibowo',
          role: 'PJ_SEKOLAH',
          roleLabel: 'Penanggung Jawab (PJ) Sekolah',
          nip: '19750912 200212 1 003',
          organization: 'SMAN 1 Juwana',
          assignedLocation: 'SMAN 1 Juwana',
          contactNumber: '0821-3344-5566',
        });
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-rose-900 via-rose-800 to-rose-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BgnLogo size="sm" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Profil Petugas
              </h3>
              <p className="text-[10px] text-rose-200">Badan Gizi Nasional • Tim Kipas Kopdes 1,8 Triliun</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {!isEditing ? (
            /* VIEW MODE */
            <div className="space-y-4">
              {/* Profile Card Header */}
              <div className="bg-gradient-to-br from-rose-50/80 via-slate-50 to-amber-50/40 rounded-2xl p-4 border border-rose-100/80 text-center relative overflow-hidden">
                <div className="flex justify-center mb-2">
                  <div className="relative">
                    <BgnLogo size="lg" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white border-2 border-white flex items-center justify-center shadow-xs">
                      <ShieldCheck className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                <h4 className="text-sm font-black text-slate-900 tracking-tight">
                  {profile.name}
                </h4>
                <div className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 font-bold text-[10px] border border-rose-200">
                  <Award className="w-3 h-3" />
                  <span>{profile.roleLabel}</span>
                </div>

                <p className="text-[11px] text-slate-500 font-mono mt-1">
                  NIP: {profile.nip || '-'}
                </p>
              </div>

              {/* Detail Info Grid */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/90 space-y-2.5">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Instansi / Unit:</span>
                  </span>
                  <span className="font-semibold text-slate-900 text-right truncate max-w-[170px]">
                    {profile.organization}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-700 pt-1.5 border-t border-slate-200/70">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Titik Tugas Aktif:</span>
                  </span>
                  <span className="font-semibold text-slate-900 text-right truncate max-w-[170px]">
                    {profile.assignedLocation}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-700 pt-1.5 border-t border-slate-200/70">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Kontak WhatsApp:</span>
                  </span>
                  <span className="font-mono font-medium text-slate-900">
                    {profile.contactNumber}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-700 pt-1.5 border-t border-slate-200/70">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span>Otorisasi Sistem:</span>
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                    ✓ Terverifikasi M&E
                  </span>
                </div>
              </div>

              {/* Pelaporan Note */}
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
                <strong>Integrasi Database M&E:</strong> Setiap hasil pemindaian yang direkam atau dilaporkan akan secara otomatis melampirkan identitas penanggung jawab di atas sebagai verifikator mutu pangan resmi.
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Ubah Data Profil</span>
                </button>
                <button
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          ) : (
            /* EDIT FORM MODE */
            <form onSubmit={handleSave} className="space-y-3">
              {/* Preset Selector */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700">
                  Pilih Preset Identitas Cepat:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyPreset('SPPG')}
                    className="p-1.5 bg-slate-100 hover:bg-rose-50 rounded-lg text-[10px] font-medium text-left border border-slate-200 truncate"
                  >
                    🏢 SPPG Juwana (Dr. Alvindra)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('PENGAWAS')}
                    className="p-1.5 bg-slate-100 hover:bg-rose-50 rounded-lg text-[10px] font-medium text-left border border-slate-200 truncate"
                  >
                    🛡️ Pengawas BGN
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('PJ_SDN')}
                    className="p-1.5 bg-slate-100 hover:bg-rose-50 rounded-lg text-[10px] font-medium text-left border border-slate-200 truncate"
                  >
                    🏫 PJ SDN 02 Kebonsawahan
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('PJ_SMPN')}
                    className="p-1.5 bg-slate-100 hover:bg-rose-50 rounded-lg text-[10px] font-medium text-left border border-slate-200 truncate"
                  >
                    🏫 PJ SMPN 1 Juwana
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('PJ_SMAN')}
                    className="p-1.5 bg-slate-100 hover:bg-rose-50 rounded-lg text-[10px] font-medium text-left border border-slate-200 truncate col-span-2"
                  >
                    🏫 PJ SMAN 1 Juwana
                  </button>
                </div>
              </div>

              {/* Nama Lengkap */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nama Penanggung Jawab / Petugas:
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  placeholder="Contoh: Dr. Alvindra Salsabian Lifanto, S.T.P., M.T., M.Gz., Ph.D."
                />
              </div>

              {/* Peran / Jabatan */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Peran / Jabatan Operasional:
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  {OFFICER_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* NIP / ID Petugas */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  NIP / ID Registrasi Petugas:
                </label>
                <input
                  type="text"
                  value={formData.nip}
                  onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  placeholder="Contoh: 19940822 201902 2 004"
                />
              </div>

              {/* Instansi / Unit */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Instansi / Unit Penugasan:
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  placeholder="Contoh: Badan Gizi Nasional - Satpel Pati"
                />
              </div>

              {/* Titik Tugas */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Titik Distribusi Penugasan:
                </label>
                <select
                  value={formData.assignedLocation}
                  onChange={(e) => setFormData({ ...formData, assignedLocation: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  {DISTRIBUTION_POINTS.map((loc) => (
                    <option key={loc.id} value={loc.code}>
                      {loc.name}
                    </option>
                  ))}
                  <option value="Semua Titik Distribusi Pati">Semua Titik Distribusi Pati (Pengawas)</option>
                </select>
              </div>

              {/* Kontak */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  No. Telepon / WhatsApp:
                </label>
                <input
                  type="text"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  placeholder="0813-xxxx-xxxx"
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300 stroke-[3px]" />
                      <span>Tersimpan!</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-all"
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
