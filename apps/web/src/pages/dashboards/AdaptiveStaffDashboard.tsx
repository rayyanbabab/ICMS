import React from 'react';
import { UserRole } from '@icms/shared';
import { StatCard } from '../../components/ui/StatCard';
import { 
  Building2, 
  Users, 
  Award, 
  CheckCircle2, 
  Briefcase, 
  GraduationCap, 
  Sparkles, 
  DollarSign, 
  ShieldCheck,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdaptiveDashboardProps {
  role: UserRole;
}

export const AdaptiveStaffDashboard: React.FC<AdaptiveDashboardProps> = ({ role }) => {
  const getRoleConfig = () => {
    switch (role) {
      case UserRole.VICE_RECTOR:
        return {
          title: 'Dashboard Wakil Rektor Bidang Akademik & Riset',
          subtitle: 'Pengawalan Mutu Institusi & Ketercapaian IKU',
          badge: 'Pimpinan Universitas',
          stats: [
            { title: 'Capaian IKU Kemendikbud', value: '88.5%', sub: 'Target IKU 1 s/d 8', icon: Award, color: 'text-icms-academic-blue', bg: 'bg-blue-50' },
            { title: 'Total Dana Hibah LPPM', value: 'Rp 1.85 M', sub: '28 Proposal Riset', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { title: 'Program Studi Akreditasi A', value: '100% Unggul', sub: 'LAM & BAN-PT', icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
            { title: 'Publikasi Scopus Terkini', value: '42 Paper', sub: 'Jurnal Bereputasi Q1/Q2', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          ],
          link: '/manajemen/penelitian',
          linkText: 'Buka Riset LPPM & Hibah',
        };
      case UserRole.STUDENT_AFFAIRS_ADMIN:
        return {
          title: 'Dashboard Pembina Kemahasiswaan & Bakat',
          subtitle: 'Biro Kemahasiswaan, Alumni & Karir Mahasiswa',
          badge: 'Kemahasiswaan',
          stats: [
            { title: 'Penerima Beasiswa', value: '340 Mhs', sub: 'KIP-K & Prestasi', icon: GraduationCap, color: 'text-icms-academic-blue', bg: 'bg-blue-50' },
            { title: 'Ormawa & UKM Aktif', value: '18 Lembaga', sub: 'BEM, Himpunan, UKM', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { title: 'Kejuaraan Nasional', value: '24 Medali', sub: 'Gemastik, PKM, dll', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
            { title: 'Kegiatan Mahasiswa', value: '32 Agenda', sub: 'Semester Ganjil', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
          ],
          link: '/manajemen/kemahasiswaan',
          linkText: 'Kelola Beasiswa & Ormawa',
        };
      case UserRole.HR_ADMIN:
        return {
          title: 'Dashboard Biro Kepegawaian & SDM (HRD)',
          subtitle: 'Kualifikasi Dosen & Kepatuhan Beban Kerja (BKD)',
          badge: 'Manajemen SDM',
          stats: [
            { title: 'Total Tenaga Pendidik', value: '42 Dosen', sub: 'Dosen Tetap Ber-NIDN', icon: Users, color: 'text-icms-academic-blue', bg: 'bg-blue-50' },
            { title: 'Kualifikasi Doktor (S3)', value: '18 Dosen', sub: '42.8% Dari Total Dosen', icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { title: 'Kepatuhan BKD', value: '100% Memenuhi', sub: 'Evaluasi Semester Ini', icon: CheckCircle2, color: 'text-amber-600', bg: 'bg-amber-50' },
            { title: 'Guru Besar / Profesor', value: '5 Dosen', sub: 'Puncak Karir Akademik', icon: Award, color: 'text-blue-600', bg: 'bg-blue-50' },
          ],
          link: '/manajemen/sdm',
          linkText: 'Direktori Dosen & Pegawai',
        };
      case UserRole.ALUMNI:
        return {
          title: 'Portal Ikatan Alumni & Karir Lulusan',
          subtitle: 'Jejaring Global Alumni Universitas Indonesia Mandiri',
          badge: 'Alumni Network',
          stats: [
            { title: 'Total Alumni Terdaftar', value: '3,420 Org', sub: 'Angkatan 2016 - 2026', icon: Users, color: 'text-icms-academic-blue', bg: 'bg-blue-50' },
            { title: 'Rata-rata Waktu Tunggu', value: '1.8 Bulan', sub: 'Terserap Cepat Industri', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { title: 'Keselarasan Bidang', value: '91.4% Selaras', sub: 'Sesuai Kompetensi IT', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
            { title: 'Gaji Pertama Rata-rata', value: 'Rp 8.5 Jt', sub: 'Tingkat Kepuasan Kerja Tinggi', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
          ],
          link: '/manajemen/alumni',
          linkText: 'Isi Kuesioner Tracer Study',
        };
      default:
        return {
          title: 'Dashboard Operasional Institusi',
          subtitle: 'Pusat Manajemen Terpadu Universitas',
          badge: 'Sistem Operasional',
          stats: [
            { title: 'Total Pengguna', value: '3,540 Akun', sub: 'Sivitas Terintegrasi', icon: Users, color: 'text-icms-academic-blue', bg: 'bg-blue-50' },
            { title: 'Layanan Aktif', value: '100% Online', sub: 'Database PostgreSQL Sehat', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { title: 'Keamanan Platform', value: 'Argon2id', sub: 'Terenkripsi Standar OWASP', icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
            { title: 'Tahun Akademik', value: '2026/2027', sub: 'Semester Ganjil', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
          ],
          link: '/sistem/pengguna',
          linkText: 'Kelola Pengguna Sistem',
        };
    }
  };

  const cfg = getRoleConfig();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {cfg.badge}
            </span>
            <span className="text-xs text-slate-300 font-medium">Universitas Indonesia Mandiri</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            {cfg.title}
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            {cfg.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={cfg.link}
            className="px-4 py-2.5 text-xs font-bold bg-white text-icms-navy hover:bg-slate-100 rounded-xl shadow-xs transition-colors"
          >
            {cfg.linkText} →
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {cfg.stats.map((st, idx) => (
          <StatCard
            key={idx}
            title={st.title}
            value={st.value}
            subtitle={st.sub}
            icon={st.icon}
            iconBg={st.bg}
            iconColor={st.color}
          />
        ))}
      </div>

      {/* Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
          <h3 className="font-bold text-sm text-icms-navy">Direktori Akademik & Fakultas</h3>
          <p className="text-xs text-slate-500">Lihat sebaran program studi dan struktur kurikulum institusi.</p>
          <Link to="/akademik/program-studi" className="block text-center py-2 text-xs font-bold text-icms-academic-blue bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
            Program Studi →
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
          <h3 className="font-bold text-sm text-icms-navy">Siaran & Pengumuman Kampus</h3>
          <p className="text-xs text-slate-500">Pantau warta resmi kegiatan, beasiswa, dan kebijakan akademik.</p>
          <Link to="/operasional/pengumuman" className="block text-center py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
            Papan Pengumuman →
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
          <h3 className="font-bold text-sm text-icms-navy">Fasilitas & Sarana Kampus</h3>
          <p className="text-xs text-slate-500">Informasi ketersediaan laboratorium dan peminjaman aula pertemuan.</p>
          <Link to="/manajemen/fasilitas" className="block text-center py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors">
            Fasilitas Ruangan →
          </Link>
        </div>
      </div>
    </div>
  );
};
