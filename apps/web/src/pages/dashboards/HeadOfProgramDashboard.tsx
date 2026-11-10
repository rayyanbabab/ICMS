import React from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { ChartCard } from '../../components/ui/ChartCard';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeadOfProgramDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Kepemimpinan Jurusan / Program Studi
            </span>
            <span className="text-xs text-slate-300 font-medium">S1 Teknik Informatika (IF)</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Dashboard Ketua Program Studi (Kaprodi)
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Pengawalan operasional perkuliahan, distribusi kelas & dosen pengampu, persetujuan KRS bimbingan, dan capaian OBE.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/akademik/kurikulum"
            className="px-4 py-2.5 text-xs font-bold bg-white text-icms-navy hover:bg-slate-100 rounded-xl shadow-xs transition-colors"
          >
            Matriks Kurikulum OBE
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Mahasiswa Aktif Prodi"
          value="640 Mhs"
          subtitle="Angkatan 2023 - 2026"
          icon={Users}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Kelas Perkuliahan Buka"
          value="34 Kelas"
          subtitle="Semester Ganjil 2026/2027"
          icon={BookOpen}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Persetujuan KRS Bimbingan"
          value="98.5% Selesai"
          subtitle="Verifikasi Dosen Wali (DPA)"
          icon={CheckCircle2}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Rata-rata Pengambilan"
          value="21.4 SKS"
          subtitle="Beban Belajar Mahasiswa"
          icon={GraduationCap}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Quick Action Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-icms-academic-blue" />
            <h3 className="font-bold text-sm text-slate-900">Validasi Rencana Studi (KRS)</h3>
          </div>
          <p className="text-xs text-slate-500">
            Pastikan seluruh mahasiswa telah menyelesaikan bimbingan KRS sebelum batas akhir revisi perkuliahan.
          </p>
          <Link
            to="/akademik/krs"
            className="block text-center py-2 text-xs font-bold text-icms-academic-blue bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            Buka Antrean KRS →
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">Distribusi Jadwal Kuliah</h3>
          </div>
          <p className="text-xs text-slate-500">
            Monitoring jadwal penggunaan laboratorium komputer dan ruang kuliah teori agar tidak bentrok.
          </p>
          <Link
            to="/akademik/jadwal"
            className="block text-center py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
          >
            Lihat Jadwal Mingguan →
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-sm text-slate-900">Jadwal Ujian Tengah Semester</h3>
          </div>
          <p className="text-xs text-slate-500">
            Penyiapan bank soal ujian online Computer-Based Testing (CBT) kurikulum Teknik Informatika.
          </p>
          <Link
            to="/operasional/ujian"
            className="block text-center py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors"
          >
            Kelola Ujian Online →
          </Link>
        </div>
      </div>
    </div>
  );
};
