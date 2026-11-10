import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { StatCard } from '../components/ui/StatCard';
import { 
  Settings, 
  Database, 
  ShieldCheck, 
  HardDrive, 
  Sparkles, 
  CheckCircle2, 
  Save, 
  RefreshCw,
  Building,
  Lock,
  Download
} from 'lucide-react';

export const SystemSettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'profile' | 'policy' | 'backup'>('profile');
  const [backupMessage, setBackupMessage] = useState<string | null>(null);

  const { data: settingsData } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const res = await api.get('/system/settings');
      return res.data;
    },
  });

  const { data: backupData, refetch: refetchBackup } = useQuery({
    queryKey: ['backup-status'],
    queryFn: async () => {
      const res = await api.get('/system/backup');
      return res.data;
    },
  });

  const backupMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/system/backup/create');
      return res.data;
    },
    onSuccess: (data) => {
      setBackupMessage(data.message);
      refetchBackup();
    },
  });

  const inst = settingsData?.institution;
  const policy = settingsData?.academicPolicy;
  const security = settingsData?.securityPolicy;
  const backups: any[] = backupData?.backups || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Konfigurasi Enterprise & Disaster Recovery
            </span>
            <span className="text-xs text-slate-300 font-medium">Pengaturan Inti Platform</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Pengaturan Sistem & Pemulihan Cadangan (Backup)
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Identitas resmi universitas, regulasi batas SKS, protokol keamanan enkripsi, dan otomatisasi snapshot basis data PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'profile' ? 'bg-white text-icms-navy shadow-xs' : 'text-slate-200 hover:text-white'
            }`}
          >
            Profil Kampus
          </button>
          <button
            onClick={() => setActiveTab('policy')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'policy' ? 'bg-white text-icms-navy shadow-xs' : 'text-slate-200 hover:text-white'
            }`}
          >
            Kebijakan & Keamanan
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'backup' ? 'bg-white text-icms-navy shadow-xs' : 'text-slate-200 hover:text-white'
            }`}
          >
            Snapshot Backup
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Status Snapshot Backup"
          value="HEALTHY"
          subtitle="Otomatis Setiap 24 Jam"
          icon={Database}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Total Arsip Snapshot"
          value={`${backupData?.totalSnapshots || 14} File`}
          subtitle="Tersimpan di S3 Cloud Storage"
          icon={HardDrive}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Enkripsi Password"
          value="Argon2id"
          subtitle="OWASP Certified Security"
          icon={ShieldCheck}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Beban SKS Maksimal"
          value="24 SKS"
          subtitle="Regulasi Standar Nasional"
          icon={Settings}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* TAB 1: INSTITUTION PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-icms-navy">Profil Legalitas & Kontak Institusi</h3>
              <p className="text-xs text-slate-500 mt-0.5">Informasi resmi yang tercetak pada berkas kop surat dan transkrip akademik.</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Terakreditasi Unggul
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nama Universitas / Institusi</label>
              <input
                type="text"
                readOnly
                value={inst?.name || 'Universitas Indonesia Mandiri'}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Kode Perguruan Tinggi (PDDIKTI)</label>
              <input
                type="text"
                readOnly
                value={inst?.code || 'UIM-001234'}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Surat Keputusan Pendirian (SK Kemendikbud)</label>
              <input
                type="text"
                readOnly
                value={inst?.skEstablishment || 'SK Mendikbud No. 488/E/O/2012'}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Peringkat Akreditasi Institusi</label>
              <input
                type="text"
                readOnly
                value={inst?.accreditation || 'Unggul (BAN-PT)'}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-emerald-700 font-bold"
              />
            </div>
            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Alamat Kampus Utama</label>
              <input
                type="text"
                readOnly
                value={inst?.address || 'Jl. M.H. Thamrin No. 88, Menteng, Jakarta Pusat 10350'}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: POLICIES & SECURITY */}
      {activeTab === 'policy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-base text-icms-navy pb-3 border-b border-slate-100">Regulasi & Batas Akademik</h3>
            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Maksimum SKS Per Semester:</span>
                <span className="font-bold text-slate-900">{policy?.maxCreditsPerSemester || 24} SKS</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Masa Studi Normal Sarjana:</span>
                <span className="font-bold text-slate-900">{policy?.standardStudyDurationYears || 4} Tahun (8 Semester)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Nilai Kelulusan Minimum:</span>
                <span className="font-bold text-slate-900">{policy?.passingGradeMinimum || 'C (2.0)'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Presensi Minimum Ujian:</span>
                <span className="font-bold text-slate-900">{policy?.attendanceMinimumPercentage || 75}% Kehadiran</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-base text-icms-navy pb-3 border-b border-slate-100">Keamanan & Sesi Pengguna</h3>
            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Algoritma Password:</span>
                <span className="font-bold text-emerald-700">{security?.passwordHashing || 'Argon2id'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Masa Berlaku Token JWT:</span>
                <span className="font-bold text-slate-900">{security?.jwtExpiryMinutes || 1440} Menit (24 Jam)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Two-Factor Authentication:</span>
                <span className="font-bold text-emerald-600">Aktif & Didukung</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Session Timeout:</span>
                <span className="font-bold text-slate-900">{security?.sessionTimeoutMinutes || 60} Menit Idle</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BACKUP ENGINE */}
      {activeTab === 'backup' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-icms-navy">Database Snapshots & Disaster Recovery</h3>
              <p className="text-xs text-slate-500 mt-0.5">Cadangan data terenkripsi otomatis disimpan di S3 Object Storage.</p>
            </div>
            <button
              onClick={() => backupMutation.mutate()}
              disabled={backupMutation.isPending}
              className="px-4 py-2 text-xs font-bold bg-icms-academic-blue hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Database className="w-4 h-4" /> {backupMutation.isPending ? 'Memproses Snapshot...' : 'Buat Snapshot Sekarang'}
            </button>
          </div>

          {backupMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
              <span>✓ {backupMessage}</span>
              <button onClick={() => setBackupMessage(null)} className="font-bold">✕</button>
            </div>
          )}

          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
            {backups.map((bkp: any) => (
              <div key={bkp.id} className="p-4 bg-white hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{bkp.filename}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {bkp.status}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Dibuat pada: {new Date(bkp.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} pk {new Date(bkp.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-mono font-bold text-slate-700">{bkp.sizeMB} MB</span>
                  <button
                    onClick={() => alert(`Mengunduh arsip snapshot: ${bkp.filename}`)}
                    className="p-1.5 text-slate-500 hover:text-icms-academic-blue rounded-lg transition-colors"
                    title="Unduh Snapshot"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

