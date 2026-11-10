import React from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { 
  Users, 
  CheckCircle2, 
  GraduationCap, 
  Award, 
  Sparkles, 
  UserPlus,
  Clock,
  Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdmissionAdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Penerimaan Mahasiswa Baru (PMB)
            </span>
            <span className="text-xs text-slate-300 font-medium">Tahun Akademik 2026/2027</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Dashboard Admisi & Registrasi Mahasiswa Baru
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Pemantauan gelombang seleksi masuk, verifikasi berkas rapor/ijazah, tes potensi akademik online, dan registrasi ulang NIM.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/akademik/fakultas"
            className="px-4 py-2.5 text-xs font-bold bg-white text-icms-navy hover:bg-slate-100 rounded-xl shadow-xs transition-colors"
          >
            Daftar Kuota Fakultas
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Pendaftar PMB"
          value="1,480 Akun"
          subtitle="Gelombang 1, 2 & Jalur Mandiri"
          icon={UserPlus}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Lolos Seleksi Ujian"
          value="890 Calon Mhs"
          subtitle="Tingkat Kelulusan 60.1%"
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Registrasi Ulang (NIM)"
          value="760 Mahasiswa"
          subtitle="Resmi Menjadi Sivitas UIM"
          icon={GraduationCap}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Jalur Prestasi & KIP-K"
          value="185 Mahasiswa"
          subtitle="Beasiswa Penuh Bebas UKT"
          icon={Award}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
          <h3 className="font-bold text-base text-icms-navy">Manajemen Pengguna & Pembuatan Akun NIM</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Generate nomor induk mahasiswa (NIM) resmi dan buatkan akun login portal akademik secara instan.
          </p>
          <Link to="/sistem/pengguna" className="inline-block px-4 py-2 text-xs font-bold text-white bg-icms-academic-blue hover:bg-blue-700 rounded-xl transition-colors">
            Buka Manajemen Pengguna →
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
          <h3 className="font-bold text-base text-icms-navy">Siaran Pengumuman Hasil Seleksi</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Publikasikan pengumuman kelulusan calon mahasiswa baru ke portal utama dan website resmi universitas.
          </p>
          <Link to="/operasional/pengumuman" className="inline-block px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            Terbitkan Pengumuman →
          </Link>
        </div>
      </div>
    </div>
  );
};

