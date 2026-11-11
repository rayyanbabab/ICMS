import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Building2,
  BookOpen,
  GraduationCap,
  Users,
  UserCheck,
  Receipt,
  Library,
  UserPlus,
  Award,
  Sparkles,
  CheckCircle2,
  Database,
  FileCheck2,
  Briefcase,
  LogIn,
} from 'lucide-react';
import { UserRole } from '@icms/shared';

interface DemoAccount {
  role: UserRole;
  label: string;
  category: 'LEADERSHIP' | 'ACADEMIC' | 'OPERATIONS' | 'COMMUNITY';
  title: string;
  identifier: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeBg: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  // 1. Leadership
  {
    role: UserRole.SUPER_ADMIN,
    label: 'Super Admin',
    category: 'LEADERSHIP',
    title: 'Super Administrator',
    identifier: 'admin',
    description: 'Pusat tata kelola sistem, audit log, perizinan, dan pemeliharaan database',
    icon: ShieldCheck,
    accentColor: 'border-slate-800 text-slate-800 bg-slate-50',
    badgeBg: 'bg-slate-800 text-white',
  },
  {
    role: UserRole.RECTOR,
    label: 'Rektor',
    category: 'LEADERSHIP',
    title: 'Rektor Universitas',
    identifier: 'rektor@icms.ac.id',
    description: 'Dashboard eksekutif, analisis pendapatan keuangan, dan statistik akreditasi institusi',
    icon: UserCheck,
    accentColor: 'border-blue-700 text-blue-700 bg-blue-50/50',
    badgeBg: 'bg-blue-800 text-white',
  },
  {
    role: UserRole.VICE_RECTOR,
    label: 'Wakil Rektor',
    category: 'LEADERSHIP',
    title: 'Wakil Rektor I (Akademik)',
    identifier: 'warek1@icms.ac.id',
    description: 'Monitoring mutu pembelajaran, implementasi OBE, dan capaian lulusan',
    icon: Award,
    accentColor: 'border-blue-600 text-blue-600 bg-blue-50/40',
    badgeBg: 'bg-blue-700 text-white',
  },

  // 2. Academic & Faculty
  {
    role: UserRole.DEAN,
    label: 'Dekan FTI',
    category: 'ACADEMIC',
    title: 'Dekan Fakultas Teknologi Informasi',
    identifier: 'dekan.fti@icms.ac.id',
    description: 'Pengawasan prodi, beban kerja dosen (BKD), dan evaluasi fakultas',
    icon: Building2,
    accentColor: 'border-indigo-600 text-indigo-600 bg-indigo-50/50',
    badgeBg: 'bg-indigo-700 text-white',
  },
  {
    role: UserRole.HEAD_OF_PROGRAM,
    label: 'Kaprodi IF',
    category: 'ACADEMIC',
    title: 'Ketua Program Studi Teknik Informatika',
    identifier: 'kaprodi.if@icms.ac.id',
    description: 'Manajemen kurikulum, ploting jadwal perkuliahan, dan persetujuan kelas',
    icon: BookOpen,
    accentColor: 'border-teal-600 text-teal-600 bg-teal-50/50',
    badgeBg: 'bg-teal-700 text-white',
  },
  {
    role: UserRole.LECTURER,
    label: 'Dosen & PA',
    category: 'ACADEMIC',
    title: 'Dosen Pengajar & Pembimbing Akademik',
    identifier: 'dosen@icms.ac.id',
    description: 'Persetujuan KRS mahasiswa bimbingan, kelas digital LMS, presensi QR, dan input nilai',
    icon: Users,
    accentColor: 'border-amber-600 text-amber-700 bg-amber-50/50',
    badgeBg: 'bg-amber-600 text-white',
  },

  // 3. Operations & Bureaus
  {
    role: UserRole.ACADEMIC_ADMIN,
    label: 'BAAK (Registrar)',
    category: 'OPERATIONS',
    title: 'Biro Administrasi Akademik (BAAK)',
    identifier: 'baak@icms.ac.id',
    description: 'Verifikasi berkas mahasiswa, antrean validasi KRS, dan penerbitan surat resmi ber-TTE',
    icon: FileCheck2,
    accentColor: 'border-sky-600 text-sky-700 bg-sky-50/50',
    badgeBg: 'bg-sky-700 text-white',
  },
  {
    role: UserRole.FINANCE_ADMIN,
    label: 'BAUK (Keuangan)',
    category: 'OPERATIONS',
    title: 'Biro Administrasi Keuangan (BAUK)',
    identifier: 'bauk@icms.ac.id',
    description: 'Manajemen invoice UKT, rekonsiliasi pembayaran Virtual Account/QRIS, dan buku kas',
    icon: Receipt,
    accentColor: 'border-emerald-600 text-emerald-700 bg-emerald-50/50',
    badgeBg: 'bg-emerald-700 text-white',
  },
  {
    role: UserRole.ADMISSION_ADMIN,
    label: 'Admisi PMB',
    category: 'OPERATIONS',
    title: 'Panitia Penerimaan Mahasiswa Baru',
    identifier: 'pmb@icms.ac.id',
    description: 'Pendaftaran calon mahasiswa baru, verifikasi berkas ijazah, dan seleksi masuk',
    icon: UserPlus,
    accentColor: 'border-rose-600 text-rose-700 bg-rose-50/50',
    badgeBg: 'bg-rose-700 text-white',
  },
  {
    role: UserRole.HR_ADMIN,
    label: 'SDM / HRD',
    category: 'OPERATIONS',
    title: 'Biro Kepegawaian & SDM',
    identifier: 'hrd@icms.ac.id',
    description: 'Data profil dosen & tenaga kependidikan, NIP/NIDN, kepangkatan, dan data gaji',
    icon: Briefcase,
    accentColor: 'border-orange-600 text-orange-700 bg-orange-50/50',
    badgeBg: 'bg-orange-700 text-white',
  },
  {
    role: UserRole.STUDENT_AFFAIRS_ADMIN,
    label: 'Kemahasiswaan',
    category: 'OPERATIONS',
    title: 'Biro Kemahasiswaan & Alumni',
    identifier: 'kemahasiswaan@icms.ac.id',
    description: 'Pengelolaan organisasi mahasiswa (BEM/UKM), beasiswa, dan pencatatan prestasi',
    icon: Users,
    accentColor: 'border-cyan-600 text-cyan-700 bg-cyan-50/50',
    badgeBg: 'bg-cyan-700 text-white',
  },
  {
    role: UserRole.LIBRARIAN,
    label: 'Pustakawan',
    category: 'OPERATIONS',
    title: 'Perpustakaan Digital Kampus',
    identifier: 'perpustakaan@icms.ac.id',
    description: 'Katalog buku, sirkulasi peminjaman, reservasi bahan pustaka, dan e-book digital',
    icon: Library,
    accentColor: 'border-purple-600 text-purple-700 bg-purple-50/50',
    badgeBg: 'bg-purple-700 text-white',
  },

  // 4. Community
  {
    role: UserRole.STUDENT,
    label: 'Mahasiswa',
    category: 'COMMUNITY',
    title: 'Portal Mahasiswa Terpadu',
    identifier: 'mahasiswa@icms.ac.id',
    description: 'Rencana studi KRS, cek KHS & IPK, presensi QR, tugas LMS, bayar UKT, dan ajukan surat',
    icon: GraduationCap,
    accentColor: 'border-emerald-600 text-emerald-700 bg-emerald-50/50',
    badgeBg: 'bg-emerald-600 text-white',
  },
  {
    role: UserRole.ALUMNI,
    label: 'Alumni',
    category: 'COMMUNITY',
    title: 'Jaringan Alumni & Karir',
    identifier: 'alumni@icms.ac.id',
    description: 'Pengisian tracer study universitas, jejaring wisudawan, dan portal informasi loker magang',
    icon: Award,
    accentColor: 'border-slate-600 text-slate-700 bg-slate-50',
    badgeBg: 'bg-slate-700 text-white',
  },
];

export const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('AdminPassword123!');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.SUPER_ADMIN);
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'LEADERSHIP' | 'ACADEMIC' | 'OPERATIONS' | 'COMMUNITY'>('ALL');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (idToUse?: string, passToUse?: string) => {
    const finalId = idToUse || identifier;
    const finalPass = passToUse || password;

    setErrorMsg(null);
    setSubmitting(true);

    try {
      await login(finalId, finalPass);
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login gagal. Periksa username dan password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectDemo = (demo: DemoAccount, autoSubmit: boolean = false) => {
    setIdentifier(demo.identifier);
    setPassword('AdminPassword123!');
    setSelectedRole(demo.role);
    setErrorMsg(null);

    if (autoSubmit) {
      handleLogin(demo.identifier, 'AdminPassword123!');
    }
  };

  const filteredDemos = DEMO_ACCOUNTS.filter((acc) => {
    if (activeCategory === 'ALL') return true;
    return acc.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top University Branding Bar */}
      <header className="w-full bg-white border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-icms-navy text-white flex items-center justify-center font-bold text-lg shadow-sm border border-slate-700">
            U
          </div>
          <div>
            <div className="text-sm font-extrabold tracking-tight text-icms-navy font-heading">
              UNIVERSITAS INDONESIA MANDIRI
            </div>
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2">
              <span>ICMS Campus Suite • Sistem Informasi Manajemen Terpadu</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-emerald-700 font-semibold">Akreditasi Unggul</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>Database: <strong className="text-slate-800">Neon PostgreSQL</strong> (49 Tabel Aktif)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Enkripsi: <strong className="text-slate-800">Argon2id + JWT</strong></span>
          </div>
        </div>
      </header>

      {/* Main Container: Split Enterprise Experience */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-start justify-center my-auto">
        {/* Left Column: Interactive 14 Demo Accounts Explorer */}
        <section className="w-full lg:w-7/12 flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold mb-1.5 border border-blue-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>1-CLICK DEMO WORKSPACE EXPLORER</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-icms-navy tracking-tight">
                  Pilih Akun Demo (14 Peran Kampus)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Klik kartu akun untuk auto-fill form, atau klik tombol <strong>"Langsung Masuk"</strong> untuk login instan.
                </p>
              </div>

              {/* Password notice badge */}
              <div className="text-right sm:text-right shrink-0">
                <span className="text-[11px] font-medium text-slate-400 block">Password seluruh akun:</span>
                <code className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  AdminPassword123!
                </code>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-3.5 scrollbar-thin border-b border-slate-100">
              {[
                { id: 'ALL', label: 'Semua 14 Peran' },
                { id: 'LEADERSHIP', label: '👑 Pimpinan (3)' },
                { id: 'ACADEMIC', label: '🏛️ Akademik & Dosen (3)' },
                { id: 'OPERATIONS', label: '📋 Biro Operasional (6)' },
                { id: 'COMMUNITY', label: '🎓 Mahasiswa & Alumni (2)' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeCategory === cat.id
                      ? 'bg-icms-navy text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Demo Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredDemos.map((demo) => {
                const Icon = demo.icon;
                const isSelected = selectedRole === demo.role;

                return (
                  <div
                    key={demo.role}
                    onClick={() => handleSelectDemo(demo, false)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 text-left group relative ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-md'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${demo.accentColor}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block group-hover:text-blue-600 transition-colors">
                              {demo.label}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              {demo.identifier}
                            </span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${demo.badgeBg}`}>
                          {demo.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {demo.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 group-hover:text-slate-600 font-medium">
                        {isSelected ? '✓ Terpilih di formulir' : 'Klik untuk pilih'}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectDemo(demo, true);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-sm transition-all"
                        title="Langsung login ke role ini"
                      >
                        <span>Masuk</span>
                        <LogIn className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right Column: Clean White Elevated Login Card */}
        <section className="w-full lg:w-5/12 max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
            <div>
              {/* Form Header */}
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-icms-navy to-blue-700 text-white flex items-center justify-center font-bold text-xl shadow-md mb-3.5">
                  I
                </div>
                <h1 className="text-2xl font-bold font-heading text-icms-navy tracking-tight">
                  Masuk ke Sistem
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Gunakan username atau email resmi kampus untuk mengakses ruang kerja Anda.
                </p>
              </div>

              {/* Active Selected Role Indicator */}
              <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[11px] font-medium text-slate-500">Peran yang Dipilih:</span>
                  <span className="text-xs font-bold text-slate-800">
                    {DEMO_ACCOUNTS.find((a) => a.role === selectedRole)?.label || selectedRole}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Demo Siap
                </span>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-5 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-shake">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Login Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Username / Email / NIM / NIDN
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Masukkan username atau email"
                      className="w-full pl-10 pr-3 py-2.5 text-xs font-medium bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <span className="text-[11px] text-blue-600 hover:underline cursor-pointer">
                      Lupa password?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      className="w-full pl-10 pr-10 py-2.5 text-xs font-medium bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <span className="text-slate-600 text-[11px]">Ingat sesi masuk di perangkat ini</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 bg-icms-navy hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memverifikasi Akses Role...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk ke Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Footer Trust & Security Badges */}
            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-slate-600">Enterprise Single Sign-On</span>
              </div>
              <span className="font-mono text-slate-400">ICMS v1.0.0</span>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Bottom Copyright & Credentials Bar */}
      <footer className="w-full bg-white border-t border-slate-200/80 px-6 py-3 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          © 2026 <strong>Universitas Indonesia Mandiri (UIM)</strong>. Hak Cipta Dilindungi Undang-Undang.
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>Kebijakan Privasi</span>
          <span>•</span>
          <span>Standar Keamanan ISO 27001</span>
          <span>•</span>
          <span>Bantuan Teknis BTI</span>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
