import React from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { 
  FileText, 
  Users, 
  CheckCircle2, 
  Calendar, 
  GraduationCap, 
  Award, 
  Sparkles,
  Printer
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AcademicAdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Biro Administrasi Akademik & Kemahasiswaan (BAAK)
            </span>
            <span className="text-xs text-slate-300 font-medium">Layanan Registrasi & Kelulusan</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Dashboard Staf Administrasi Akademik (BAAK)
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Verifikasi berkas mahasiswa aktif, penerbitan surat keterangan resmi ber-barcode, pengelolaan yudisium, dan transkrip kelulusan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/operasional/administrasi"
            className="px-4 py-2.5 text-xs font-bold bg-white text-icms-navy hover:bg-slate-100 rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" /> Buka Layanan Surat
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Mahasiswa Terdaftar"
          value="3,420 Mhs"
          subtitle="Registrasi Aktif Semester Ini"
          icon={Users}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Surat Keterangan Terbit"
          value="128 Surat"
          subtitle="Aktif Kuliah & Pengantar Riset"
          icon={FileText}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Verifikasi Rencana Studi"
          value="99.1% Selesai"
          subtitle="KRS Terdaftar di PDDIKTI"
          icon={CheckCircle2}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Calon Wisudawan Yudisium"
          value="320 Mhs"
          subtitle="Transkrip Siap Terbit"
          icon={GraduationCap}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
          <h3 className="font-bold text-sm text-icms-navy">Layanan Surat Mahasiswa</h3>
          <p className="text-xs text-slate-500">Cetak dan verifikasi surat aktif kuliah dan perizinan riset lapangan.</p>
          <Link to="/operasional/administrasi" className="block text-center py-2 text-xs font-bold text-icms-academic-blue bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
            Kelola Surat →
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
          <h3 className="font-bold text-sm text-icms-navy">Kalender Akademik BAAK</h3>
          <p className="text-xs text-slate-500">Pantau batas waktu registrasi, KPRS, dan input nilai dosen.</p>
          <Link to="/akademik/kalender" className="block text-center py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
            Buka Kalender →
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
          <h3 className="font-bold text-sm text-icms-navy">Jadwal Kuliah Kampus</h3>
          <p className="text-xs text-slate-500">Periksa ketersediaan ruangan dan alokasi jam tatap muka.</p>
          <Link to="/akademik/jadwal" className="block text-center py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors">
            Lihat Jadwal →
          </Link>
        </div>
      </div>
    </div>
  );
};

