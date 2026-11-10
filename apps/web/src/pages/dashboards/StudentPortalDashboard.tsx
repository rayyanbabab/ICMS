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
} from 'lucide-react';

export const StudentPortalDashboard: React.FC = () => {
  const [checkedIn, setCheckedIn] = useState(false);

  return (
    <div className="space-y-6">
      {/* Student Portal Welcome Banner — Reference B Mint Green Aesthetic */}
      <div className="bg-gradient-to-r from-[#DDF7E9] via-[#E8F8F0] to-[#E3F2FD] rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/10 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-600/20">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Portal Akademik Mahasiswa UIM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Halo, Ahmad Fauzi! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 max-w-xl font-medium leading-relaxed">
              Selamat datang di semester ganjil. Jadwal kuliah pertama Anda hari ini dimulai pukul{' '}
              <strong className="text-slate-950 font-bold">08:00 WIB</strong> di Lab Komputer 01.
            </p>
          </div>

          {/* Student Profile Quick Pill */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-emerald-100 shadow-sm flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-full bg-icms-navy text-white flex items-center justify-center font-bold text-base shadow border-2 border-emerald-300">
              AF
            </div>
            <div className="text-left space-y-0.5">
              <div className="text-xs font-bold text-slate-900">Ahmad Fauzi</div>
              <div className="text-[11px] font-mono text-emerald-800 font-semibold">NIM: 202601001</div>
              <div className="text-[10px] text-slate-500 font-medium">S1 Teknik Informatika • Sem. 1</div>
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
            <div className="text-3xl font-extrabold text-slate-900 font-heading">3.85</div>
            <span className="text-[11px] text-emerald-700 font-semibold">Sangat Memuaskan (A)</span>
          </div>
        </div>

        {/* SKS Selesai */}
        <div className="bg-white rounded-2xl p-5 border border-icms-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Beban SKS
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-extrabold text-slate-900 font-heading">20 SKS</div>
            <span className="text-[11px] text-slate-500 font-medium">Dari target 144 SKS</span>
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
          <div className="mt-2">
            <StatusBadge status="PAID" label="Lunas (Rp 6.500.000)" />
            <div className="text-[11px] text-slate-500 mt-1 font-medium">Semester 1 Terverifikasi</div>
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
                      Algoritma & Pemrograman Dasar
                    </h4>
                  </div>
                  <div className="text-xs text-slate-600 mt-1 font-medium">
                    Dosen: <strong>Dr. Ir. Budi Santoso, M.Kom.</strong> (3 SKS)
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
                      Matematika Diskrit
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

        {/* Deadlines & Learning Tasks */}
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
                  <span className="font-bold text-slate-800">Tugas 2: Flowchart & Pseudocode</span>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    Besok, 23:59
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">Mata Kuliah: Algoritma & Pemrograman Dasar</div>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-800">Kuis 1: Teori Himpunan & Relasi</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    14 Nov 2026
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">Mata Kuliah: Matematika Diskrit</div>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="pt-4 border-t border-slate-100 space-y-2 mt-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
              Akses Cepat Layanan
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-slate-800 font-semibold transition-all text-center flex flex-col items-center gap-1">
                <Library className="w-4 h-4 text-emerald-700" />
                <span>Perpustakaan E-Book</span>
              </button>
              <button className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-slate-800 font-semibold transition-all text-center flex flex-col items-center gap-1">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>KHS & Transkrip</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

