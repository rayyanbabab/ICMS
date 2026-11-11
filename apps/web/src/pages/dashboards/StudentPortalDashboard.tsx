import React, { useState } from 'react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  Calendar,
  Clock,
  BookOpen,
  GraduationCap,
  Wallet,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  Library,
  Award,
  AlertCircle,
  FileText,
  Bell,
  MapPin,
  Sparkles,
  Printer,
  UploadCloud,
  CreditCard,
  TrendingUp,
  Download,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { TranscriptModal } from '../../components/ui/TranscriptModal';
import { PaymentGatewayModal } from '../../components/ui/PaymentGatewayModal';
import { DocumentUploaderModal } from '../../components/ui/DocumentUploaderModal';

const GPA_TREND_DATA = [
  { semester: 'Smt 1 (2024/1)', ips: 3.80, ipk: 3.80 },
  { semester: 'Smt 2 (2024/2)', ips: 3.85, ipk: 3.82 },
  { semester: 'Smt 3 (2025/1)', ips: 3.90, ipk: 3.85 },
  { semester: 'Smt 4 (2025/2)', ips: 3.88, ipk: 3.86 },
  { semester: 'Smt 5 (2026/1)', ips: 3.95, ipk: 3.88 },
];

export const StudentPortalDashboard: React.FC = () => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(true);

  const studentData = {
    nim: '202601001',
    fullName: 'Ahmad Fauzi',
    birthPlace: 'Jakarta',
    birthDate: '15 Mei 2004',
    studyProgram: 'S1 Teknik Informatika',
    faculty: 'Fakultas Teknologi Informasi (FTI)',
    entryYear: 2024,
    totalCredits: 78,
    gpa: 3.88,
  };

  const invoiceData = {
    id: 'inv-student-001',
    invoiceNumber: 'INV/2026/09/00881',
    title: 'UKT Semester Ganjil TA 2026/2027 (Reguler)',
    amount: 6500000,
    dueDate: '2026-11-30',
  };

  return (
    <div className="space-y-6">
      {/* Student Portal Welcome Banner — Reference B Mint Green Aesthetic */}
      <div className="bg-gradient-to-r from-[#DDF7E9] via-[#E8F8F0] to-[#E3F2FD] rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/10 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-600/20">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Portal Akademik Mahasiswa Terpadu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Halo, {studentData.fullName}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 max-w-xl font-medium leading-relaxed">
              Selamat datang di semester ganjil. Jadwal kuliah pertama Anda hari ini dimulai pukul{' '}
              <strong className="text-slate-950 font-bold">08:00 WIB</strong> di Lab Komputer 01.
            </p>
          </div>

          {/* Student Profile Quick Pill & Fast Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-emerald-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-icms-navy text-white flex items-center justify-center font-bold text-base shadow border-2 border-emerald-300">
                AF
              </div>
              <div className="text-left space-y-0.5">
                <div className="text-xs font-bold text-slate-900">{studentData.fullName}</div>
                <div className="text-[11px] font-mono text-emerald-800 font-semibold">NIM: {studentData.nim}</div>
                <div className="text-[10px] text-slate-500 font-medium">{studentData.studyProgram} • Sem. 5</div>
              </div>
            </div>

            <div className="flex sm:flex-col gap-2">
              <button
                onClick={() => setIsTranscriptOpen(true)}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
                title="Buka & Cetak Transkrip Akademik Lengkap"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Transkrip Resmi</span>
              </button>
              <button
                onClick={() => setIsUploaderOpen(true)}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
                title="Unggah Dokumen Akademik ke Cloud Storage"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Unggah Berkas</span>
              </button>
            </div>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Academic Snapshot — 4 Mint/Ivory Themed Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* IPK Card */}
        <div className="bg-white rounded-2xl p-5 border border-icms-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              IPK Kumulatif
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-extrabold text-slate-900 font-heading">{studentData.gpa}</div>
            <span className="text-[11px] text-emerald-700 font-semibold">Sangat Memuaskan (A)</span>
          </div>
        </div>

        {/* SKS Selesai */}
        <div className="bg-white rounded-2xl p-5 border border-icms-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Beban SKS Selesai
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-extrabold text-slate-900 font-heading">
              {studentData.totalCredits} SKS
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Dari target 144 SKS (54.2%)</span>
          </div>
        </div>

        {/* Status KRS */}
        <div className="bg-white rounded-2xl p-5 border border-icms-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Status KRS
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <StatusBadge status="APPROVED" label="Disetujui Dosen PA" />
            <div className="text-[11px] text-slate-500 mt-1 font-medium">Dr. Ir. Budi Santoso</div>
          </div>
        </div>

        {/* Keuangan UKT */}
        <div className="bg-white rounded-2xl p-5 border border-icms-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Status SPP/UKT
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <StatusBadge
                status={isPaid ? 'PAID' : 'PENDING'}
                label={isPaid ? 'Lunas (Rp 6.500.000)' : 'Menunggu Bayar'}
              />
              <div className="text-[11px] text-slate-500 mt-1 font-medium">Semester Ganjil 2026</div>
            </div>
            {!isPaid && (
              <button
                onClick={() => setIsPaymentOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold shadow-xs hover:bg-emerald-700 transition-colors"
              >
                Bayar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Row: IPK Trend Line Chart & SKS Graduation Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend IPK Recharts Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-icms-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Tren Capaian Indeks Prestasi (IPS & IPK)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Grafik evaluasi konsistensi mutu akademik semester ke semester
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Target IPK: &ge; 3.75
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GPA_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIpk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorIps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="semester" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[3.0, 4.0]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="ipk"
                  name="IPK Kumulatif"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorIpk)"
                />
                <Line
                  type="monotone"
                  dataKey="ips"
                  name="IPS Semester"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#2563EB' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SKS Graduation Progress Gauge Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-icms-border shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Progres Kelulusan SKS
              </h3>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                78 / 144 SKS
              </span>
            </div>

            {/* Progress Bar Gauge */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Capaian Total</span>
                <span className="text-emerald-700">54.2%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: '54.2%' }}
                />
              </div>
              <p className="text-[11px] text-slate-500 text-right">
                Sisa 66 SKS menuju Yudisium & Wisuda
              </p>
            </div>

            {/* SKS Category Breakdown */}
            <div className="space-y-2.5 pt-2">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">Mata Kuliah Wajib Prodi</span>
                <span className="font-bold text-slate-900">58 / 98 SKS</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">Mata Kuliah Pilihan / MBKM</span>
                <span className="font-bold text-slate-900">20 / 30 SKS</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">Tugas Akhir / Skripsi</span>
                <span className="font-bold text-slate-400">0 / 6 SKS (Sem. 7-8)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => setIsTranscriptOpen(true)}
              className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-all flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Transkrip Akademik Resmi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Middle Grid: Today's Class Schedule & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-icms-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Jadwal Perkuliahan Hari Ini
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Senin, 10 November 2026</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              2 Mata Kuliah
            </span>
          </div>

          <div className="space-y-3">
            {/* Class 1 */}
            <div className="p-4 rounded-2xl border border-emerald-200/90 bg-[#F4FBF7] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                      IF101-01
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      Algoritma & Pemrograman Lanjut
                    </h4>
                  </div>
                  <div className="text-xs text-slate-600 mt-1 font-medium">
                    Dosen: <strong>Dr. Ir. Budi Santoso, M.Kom.</strong> (4 SKS)
                  </div>
                </div>

                <StatusBadge
                  status={checkedIn ? 'PRESENT' : 'PENDING'}
                  label={checkedIn ? 'Sudah Presensi (08:02)' : 'Belum Presensi'}
                />
              </div>

              <div className="pt-3 border-t border-emerald-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-4 text-slate-600">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    08:00 - 10:30 WIB
                  </span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    LAB-KOM-01 (Lab Terpadu Lt. 3)
                  </span>
                </div>

                {!checkedIn ? (
                  <button
                    onClick={() => setCheckedIn(true)}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
                  >
                    Check-in Presensi Sekarang
                  </button>
                ) : (
                  <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Hadir Tervalidasi
                  </span>
                )}
              </div>
            </div>

            {/* Class 2 */}
            <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-white">
                      IF102-01
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      Kecerdasan Buatan & Machine Learning
                    </h4>
                  </div>
                  <div className="text-xs text-slate-600 mt-1 font-medium">
                    Dosen: <strong>Dr. Anita Rahmawati, M.T.</strong> (3 SKS)
                  </div>
                </div>

                <StatusBadge status="PENDING" label="Sesi Siang" />
              </div>

              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-4 text-slate-600">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    13:00 - 15:30 WIB
                  </span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    R-TEORI-302 (Gedung FTI)
                  </span>
                </div>

                <span className="text-slate-400 text-xs">Presensi dibuka 12:45 WIB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deadlines & Quick Modals */}
        <div className="bg-white rounded-2xl p-6 border border-icms-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Tugas & Ujian Terdekat
              </h3>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                2 Tugas
              </span>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-800">Tugas 3: Implementasi Model CNN ResNet</span>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    Besok, 23:59
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">Mata Kuliah: Kecerdasan Buatan & ML</div>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-800">Kuis 2: Dynamic Programming & Graf</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    14 Nov 2026
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">Mata Kuliah: Algoritma & Pemrograman Lanjut</div>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="pt-4 border-t border-slate-100 space-y-2 mt-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
              Layanan Mahasiswa Cepat
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setIsUploaderOpen(true)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-slate-800 font-semibold transition-all text-center flex flex-col items-center gap-1"
              >
                <UploadCloud className="w-4 h-4 text-emerald-700" />
                <span>Upload Dokumen</span>
              </button>
              <button
                onClick={() => setIsTranscriptOpen(true)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-slate-800 font-semibold transition-all text-center flex flex-col items-center gap-1"
              >
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>Transkrip Resmi</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Transkrip Akademik Lengkap */}
      <TranscriptModal
        isOpen={isTranscriptOpen}
        onClose={() => setIsTranscriptOpen(false)}
        student={studentData}
      />

      {/* MODAL 2: Interactive Payment Gateway Simulator */}
      <PaymentGatewayModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        invoice={invoiceData}
        onSuccess={() => {
          setIsPaid(true);
          setIsPaymentOpen(false);
        }}
      />

      {/* MODAL 3: Cloud Document Uploader */}
      <DocumentUploaderModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
      />
    </div>
  );
};
