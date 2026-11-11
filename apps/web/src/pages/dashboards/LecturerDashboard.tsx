import React, { useState } from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { ChartCard } from '../../components/ui/ChartCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  Calendar,
  Clock,
  QrCode,
  UploadCloud,
  FileCheck2,
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  ExternalLink,
  Check,
  X,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DocumentUploaderModal } from '../../components/ui/DocumentUploaderModal';

const ATTENDANCE_TREND = [
  { pertemuan: 'P1', persentase: 95 },
  { pertemuan: 'P2', persentase: 92 },
  { pertemuan: 'P3', persentase: 94 },
  { pertemuan: 'P4', persentase: 90 },
  { pertemuan: 'P5', persentase: 96 },
  { pertemuan: 'P6', persentase: 93 },
  { pertemuan: 'P7', persentase: 91 },
  { pertemuan: 'P8', persentase: 94 },
];

const GRADE_DISTRIBUTION = [
  { grade: 'A (85-100)', jumlah: 18, fill: '#10B981' },
  { grade: 'B+ (75-84)', jumlah: 12, fill: '#2563EB' },
  { grade: 'B (70-74)', jumlah: 6, fill: '#0EA5E9' },
  { grade: 'C+ (60-69)', jumlah: 3, fill: '#F59E0B' },
  { grade: 'C (55-59)', jumlah: 1, fill: '#EF4444' },
];

export const LecturerDashboard: React.FC = () => {
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [activeSession, setActiveSession] = useState('IF101-01');
  const [krsApproved, setKrsApproved] = useState(true);

  return (
    <div className="space-y-6">
      {/* Lecturer Academic Workspace Header */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-900 to-icms-academic-blue rounded-2xl p-6 text-white shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-semibold uppercase tracking-wider mb-2 border border-blue-500/30">
            <span>Academic Teaching Workspace</span>
          </div>
          <h1 className="text-2xl font-bold font-heading">
            Dr. Ir. Budi Santoso, M.Kom.
          </h1>
          <p className="text-slate-300 text-xs mt-1">
            NIDN: <span className="font-mono text-blue-300 font-semibold">0012058001</span> • Lektor Kepala • Program Studi S1 Teknik Informatika
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setQrModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-icms-gold hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-md transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Mulai Presensi QR Hari Ini</span>
          </button>
        </div>
      </div>

      {/* 4 Academic Workspace KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Jadwal Mengajar Hari Ini"
          value="2 Sesi Kuliah"
          subtitle="Kelas Terdekat: 08:00 WIB"
          icon={Calendar}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Total Mahasiswa Diajar"
          value="113 Mahasiswa"
          subtitle="3 Kelas Paralel"
          icon={Users}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />
        <StatCard
          title="Tugas Perlu Dinilai"
          value="14 Pengumpulan"
          subtitle="Tugas 2 Basis Data"
          icon={FileCheck2}
          iconBg="bg-amber-50"
          iconColor="text-amber-700"
          trend={{ value: 'Prioritas', isPositive: false }}
        />
        <StatCard
          title="Rata-rata Presensi Kelas"
          value="92.4%"
          subtitle="Kehadiran Mahasiswa"
          icon={Award}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          trend={{ value: 'Tinggi', isPositive: true }}
        />
      </div>

      {/* Middle Grid: Today's Schedule & Academic Advising */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Teaching Schedule */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-icms-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-icms-navy font-heading">Jadwal Perkuliahan Hari Ini</h3>
              <p className="text-xs text-slate-500 mt-0.5">Senin, Semester Ganjil 2026/2027</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Sesi Aktif
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                code: 'IF101-01',
                name: 'Algoritma & Pemrograman Dasar',
                time: '08:00 - 10:30 WIB',
                room: 'LAB-KOM-01 (Lab Terpadu Lt. 3)',
                mhsCount: 40,
                status: 'SEDANG BERJALAN',
                sessionNum: 8,
              },
              {
                code: 'IF202-01',
                name: 'Sistem Basis Data & SQL',
                time: '13:00 - 15:30 WIB',
                room: 'R-TEORI-302 (Gedung FTI Lt. 3)',
                mhsCount: 38,
                status: 'AKAN DATANG',
                sessionNum: 8,
              },
            ].map((schedule, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200/80 hover:border-icms-academic-blue/50 bg-slate-50/60 hover:bg-white transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-icms-academic-blue">
                        {schedule.code}
                      </span>
                      <h4 className="text-sm font-bold text-icms-navy">{schedule.name}</h4>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-icms-academic-blue" />
                        {schedule.time}
                      </span>
                      <span>Ruang: <strong>{schedule.room}</strong></span>
                      <span>{schedule.mhsCount} Mahasiswa</span>
                    </div>
                  </div>

                  <StatusBadge
                    status={schedule.status === 'SEDANG BERJALAN' ? 'ACTIVE' : 'PENDING'}
                    label={schedule.status}
                  />
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Pertemuan ke-{schedule.sessionNum} dari 16 Sesi</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQrModalOpen(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-icms-academic-blue hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-all"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Tampilkan QR Presensi</span>
                    </button>
                    <button
                      onClick={() => setIsUploaderOpen(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-all"
                      title="Unggah Materi Kuliah & Silabus"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Materi Kuliah</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Advising / Dosen Wali Approval */}
        <div className="bg-white rounded-2xl p-5 border border-icms-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-icms-navy font-heading flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-icms-academic-blue" />
                Persetujuan KRS Mahasiswa Bimbingan
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-icms-academic-blue">
                Dosen Wali
              </span>
            </div>

            <div className="space-y-3 mt-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold text-icms-navy">Ahmad Fauzi</div>
                    <div className="text-[11px] text-slate-500 font-mono">NIM: 202601001 • Sem 1</div>
                  </div>
                  <StatusBadge
                    status={krsApproved ? 'APPROVED' : 'PENDING'}
                    label={krsApproved ? 'Disetujui' : 'Menunggu'}
                  />
                </div>

                <div className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-100">
                  <div className="flex justify-between text-[11px]">
                    <span>Total SKS Diajukan:</span>
                    <strong className="text-icms-navy">20 SKS</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>IPK Kumulatif:</span>
                    <strong className="text-emerald-600">3.85</strong>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setKrsApproved(true)}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Setujui KRS</span>
                  </button>
                  <button
                    onClick={() => setKrsApproved(false)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all"
                  >
                    Detail
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Bimbingan Akademik: 1 Mahasiswa</span>
            <span className="text-emerald-600 font-semibold">100% Terverifikasi</span>
          </div>
        </div>
      </div>

      {/* Analytics Row: Class Attendance Trend & Cohort Grade Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend Chart */}
        <div className="bg-white rounded-2xl p-6 border border-icms-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Tren Presensi Mahasiswa per Pertemuan (8 Sesi)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoring keaktifan kelas IF101 Algoritma & Pemrograman Dasar
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Rata-rata: 93.5%
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ATTENDANCE_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="pertemuan" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  formatter={(val: number) => [`${val}%`, 'Tingkat Kehadiran']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="persentase"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution Chart */}
        <div className="bg-white rounded-2xl p-6 border border-icms-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                Sebaran Nilai Sementara Kelas (40 Mahasiswa)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluasi tugas terstruktur dan kuis berjalan
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Kelulusan: 97.5%
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={GRADE_DISTRIBUTION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="grade" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  formatter={(val: number) => [`${val} Mahasiswa`, 'Jumlah']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="jumlah" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cloud Material & Syllabus Uploader Modal */}
      <DocumentUploaderModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        title="Unggah Materi Perkuliahan & Silabus (Cloud Storage)"
      />
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="text-left">
                <h3 className="text-sm font-bold text-icms-navy">Presensi Digital Kuliah</h3>
                <p className="text-[11px] text-slate-500">Pertemuan ke-8 • {activeSession}</p>
              </div>
              <button
                onClick={() => setQrModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* QR Mock Canvas */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
              <div className="w-48 h-48 bg-white p-3 rounded-xl border border-slate-300 shadow-inner flex items-center justify-center">
                {/* SVG QR Code Simulation */}
                <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center text-white text-[10px] p-2 text-center font-mono">
                  [QR TOKEN: ICMS-2026-SES-IF101]
                  <br />
                  Scan via Portal Mahasiswa
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>QR Aktif (Berubah tiap 30 detik)</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Mahasiswa wajib berada di jangkauan Lab Komputer untuk validasi lokasi backend.
            </p>

            <button
              onClick={() => setQrModalOpen(false)}
              className="w-full py-2 bg-icms-navy text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all"
            >
              Tutup Jendela Presensi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

