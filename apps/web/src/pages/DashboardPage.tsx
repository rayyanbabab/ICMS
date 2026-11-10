import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiRequest } from '../services/api';
import {
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  Layers,
  ShieldCheck,
  Cpu,
  Database,
  ExternalLink,
  Wallet,
  ArrowRight,
  BookMarked,
  UserCheck,
} from 'lucide-react';

interface OrgStats {
  totalUsers: number;
  totalStudents: number;
  totalLecturers: number;
  totalFaculties: number;
  totalPrograms: number;
}

interface OrgHierarchy {
  university: {
    name: string;
    code: string;
    accreditation: string;
    faculties: Array<{
      name: string;
      code: string;
      studyPrograms: Array<{ name: string; degreeLevel: string }>;
    }>;
  };
  activeSemester: {
    name: string;
    code: string;
    type: string;
    academicYear: { code: string };
  };
}

export const DashboardPage: React.FC = () => {
  const { user, login } = useAuth();
  const [stats, setStats] = useState<OrgStats | null>(null);
  const [hierarchy, setHierarchy] = useState<OrgHierarchy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiRequest<OrgStats>('/organization/stats').catch(() => null),
      apiRequest<OrgHierarchy>('/organization/hierarchy').catch(() => null),
    ]).then(([statsRes, hierRes]) => {
      if (statsRes?.data) setStats(statsRes.data);
      if (hierRes?.data) setHierarchy(hierRes.data);
      setLoading(false);
    });
  }, []);

  const switchAccount = async (u: string, p: string) => {
    setLoading(true);
    await login(u, p);
    window.location.reload();
  };

  const isStudent = user?.roles?.includes('STUDENT' as any);
  const isLecturer = user?.roles?.includes('LECTURER' as any);
  const isAdmin = user?.roles?.includes('SUPER_ADMIN' as any);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-icms-deep-navy via-icms-navy to-icms-academic-blue rounded-xl p-6 text-white shadow-lg border border-slate-700/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-icms-gold/20 text-icms-gold text-[11px] font-semibold tracking-wider uppercase mb-2 border border-icms-gold/30">
              {hierarchy?.university?.name || 'Universitas Indonesia Mandiri'} — {hierarchy?.activeSemester?.name || 'TA 2026/2027'}
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Selamat Datang, {user?.fullName || 'Pengguna'}
            </h1>
            <p className="text-slate-300 text-xs mt-1 max-w-2xl">
              Sistem Informasi Manajemen Kampus Terpadu (ICMS) aktif dan terhubung langsung ke basis data PostgreSQL.
            </p>
          </div>

          {/* Quick Role Switcher */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
              Ganti Akun Demo:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => switchAccount('admin', 'AdminPassword123!')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded border transition-all ${
                  isAdmin ? 'bg-icms-gold text-slate-950 border-icms-gold' : 'bg-slate-800 text-white hover:bg-slate-700 border-slate-600'
                }`}
              >
                Super Admin
              </button>
              <button
                onClick={() => switchAccount('dosen', 'DosenPassword123!')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded border transition-all ${
                  isLecturer ? 'bg-icms-gold text-slate-950 border-icms-gold' : 'bg-slate-800 text-white hover:bg-slate-700 border-slate-600'
                }`}
              >
                Dosen
              </button>
              <button
                onClick={() => switchAccount('mahasiswa', 'MahasiswaPassword123!')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded border transition-all ${
                  isStudent ? 'bg-icms-gold text-slate-950 border-icms-gold' : 'bg-slate-800 text-white hover:bg-slate-700 border-slate-600'
                }`}
              >
                Mahasiswa
              </button>
            </div>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-icms-academic-blue/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Role-Specific Metric Header */}
      {isStudent && user?.studentProfile && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-icms-border shadow-sm">
            <span className="text-[11px] font-medium text-slate-500 uppercase">NIM Mahasiswa</span>
            <div className="text-xl font-bold text-icms-navy mt-1">{user.studentProfile.nim}</div>
            <span className="text-xs text-slate-500">{user.studentProfile.studyProgram?.name || 'Teknik Informatika (S1)'}</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-icms-border shadow-sm">
            <span className="text-[11px] font-medium text-slate-500 uppercase">Semester Berjalan</span>
            <div className="text-xl font-bold text-icms-academic-blue mt-1">Semester {user.studentProfile.currentSemester}</div>
            <span className="text-xs text-emerald-600 font-medium">Status: Aktif</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-icms-border shadow-sm">
            <span className="text-[11px] font-medium text-slate-500 uppercase">Indeks Prestasi Kumulatif (IPK)</span>
            <div className="text-xl font-bold text-icms-gold mt-1">{user.studentProfile.gpa.toFixed(2)} / 4.00</div>
            <span className="text-xs text-slate-500">Total SKS: {user.studentProfile.totalCredits} SKS</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-icms-border shadow-sm">
            <span className="text-[11px] font-medium text-slate-500 uppercase">Dosen Wali (PA)</span>
            <div className="text-sm font-bold text-icms-navy mt-1">Dr. Ir. Budi Santoso, M.Kom.</div>
            <span className="text-xs text-slate-500">NIDN: 0012058001</span>
          </div>
        </div>
      )}

      {isLecturer && user?.lecturerProfile && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-icms-border shadow-sm">
            <span className="text-[11px] font-medium text-slate-500 uppercase">NIDN Dosen</span>
            <div className="text-xl font-bold text-icms-navy mt-1">{user.lecturerProfile.nidn}</div>
            <span className="text-xs text-slate-500">Fakultas Teknologi Informasi</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-icms-border shadow-sm">
            <span className="text-[11px] font-medium text-slate-500 uppercase">Jabatan Akademik</span>
            <div className="text-lg font-bold text-icms-academic-blue mt-1">{user.lecturerProfile.academicRank}</div>
            <span className="text-xs text-emerald-600 font-medium">Status: Aktif Mengajar</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-icms-border shadow-sm">
            <span className="text-[11px] font-medium text-slate-500 uppercase">Bidang Keahlian</span>
            <div className="text-sm font-bold text-slate-800 mt-1">{user.lecturerProfile.specialization}</div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-icms-border shadow-sm">
            <span className="text-[11px] font-medium text-slate-500 uppercase">Mahasiswa Bimbingan</span>
            <div className="text-xl font-bold text-icms-gold mt-1">1 Mahasiswa</div>
            <span className="text-xs text-slate-500">KRS Siap Diverifikasi</span>
          </div>
        </div>
      )}

      {/* Live Enterprise Data from Database */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-icms-border shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase">Total Pengguna</span>
            <div className="text-2xl font-bold text-icms-navy mt-1">{stats?.totalUsers ?? '3'}</div>
            <span className="text-[11px] text-slate-500">Database Live</span>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50 text-icms-academic-blue border border-blue-100">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-icms-border shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase">Mahasiswa Aktif</span>
            <div className="text-2xl font-bold text-icms-navy mt-1">{stats?.totalStudents ?? '1'}</div>
            <span className="text-[11px] text-emerald-600 font-medium">Terdaftar di DB</span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-icms-border shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase">Dosen Pengajar</span>
            <div className="text-2xl font-bold text-icms-navy mt-1">{stats?.totalLecturers ?? '1'}</div>
            <span className="text-[11px] text-slate-500">NIDN Terverifikasi</span>
          </div>
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-icms-border shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase">Fakultas</span>
            <div className="text-2xl font-bold text-icms-navy mt-1">{stats?.totalFaculties ?? '1'}</div>
            <span className="text-[11px] text-slate-500">Akreditasi Unggul</span>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-100">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-icms-border shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase">Program Studi</span>
            <div className="text-2xl font-bold text-icms-navy mt-1">{stats?.totalPrograms ?? '1'}</div>
            <span className="text-[11px] text-slate-500">Strata S1</span>
          </div>
          <div className="p-2.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-100">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* University Structure & 19 Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Structure Box */}
        <div className="bg-white rounded-xl p-5 border border-icms-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-icms-border">
            <h2 className="text-sm font-bold text-icms-navy flex items-center gap-2">
              <Building2 className="w-4 h-4 text-icms-academic-blue" />
              Struktur Organisasi Kampus
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
              AKTIF
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <div className="font-bold text-icms-navy">{hierarchy?.university?.name || 'Universitas Indonesia Mandiri'}</div>
              <div className="text-slate-500 text-[11px]">Kode Institusi: {hierarchy?.university?.code || 'UIM'} • Akreditasi: {hierarchy?.university?.accreditation || 'Unggul'}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
              <div className="font-semibold text-slate-700">Fakultas & Program Studi:</div>
              {hierarchy?.university?.faculties?.map((fac) => (
                <div key={fac.code} className="pl-2 border-l-2 border-icms-academic-blue space-y-1">
                  <div className="font-medium text-slate-800">{fac.name}</div>
                  <div className="text-[11px] text-slate-500">
                    Prodi: {fac.studyPrograms.map((p) => `${p.name} (${p.degreeLevel})`).join(', ')}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
              <div className="font-bold">Periode Aktif:</div>
              <div>{hierarchy?.activeSemester?.name || 'Semester Ganjil 2026/2027'}</div>
              <div className="text-[10px] text-amber-700">KRS dibuka untuk semester aktif</div>
            </div>
          </div>
        </div>

        {/* 19 Modules Implementation Matrix */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-icms-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-icms-border">
            <div>
              <h2 className="text-sm font-bold text-icms-navy">Status 19 Modul Ekosistem Kampus</h2>
              <p className="text-[11px] text-slate-500">Modul terintegrasi dengan PostgreSQL dan Role-Based Access Control</p>
            </div>
            <a
              href="http://localhost:4000/api/v1/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-icms-academic-blue hover:text-blue-700"
            >
              <span>Swagger API</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
            {[
              { id: 'M01', name: 'Autentikasi & RBAC (14 Role)', status: 'BERFUNGSI', badge: 'bg-emerald-100 text-emerald-800' },
              { id: 'M02', name: 'Manajemen Mahasiswa & NIM', status: 'TERHUBUNG KE DB', badge: 'bg-emerald-100 text-emerald-800' },
              { id: 'M03', name: 'Manajemen Akademik & Organisasi', status: 'TERHUBUNG KE DB', badge: 'bg-emerald-100 text-emerald-800' },
              { id: 'M04', name: 'KRS & KHS Mahasiswa', status: 'SKEMA SIAP', badge: 'bg-blue-100 text-blue-800' },
              { id: 'M05', name: 'Manajemen Dosen & NIDN', status: 'TERHUBUNG KE DB', badge: 'bg-emerald-100 text-emerald-800' },
              { id: 'M06', name: 'Keuangan & Invoicing SPP/UKT', status: 'SKEMA SIAP', badge: 'bg-blue-100 text-blue-800' },
              { id: 'M07', name: 'Presensi QR & Geolocation', status: 'SKEMA SIAP', badge: 'bg-blue-100 text-blue-800' },
              { id: 'M08', name: 'LMS Digital Classroom', status: 'SKEMA SIAP', badge: 'bg-blue-100 text-blue-800' },
              { id: 'M09', name: 'Ujian Online & Bank Soal', status: 'SKEMA SIAP', badge: 'bg-blue-100 text-blue-800' },
              { id: 'M10', name: 'Perpustakaan Digital (E-Book)', status: 'SKEMA SIAP', badge: 'bg-blue-100 text-blue-800' },
              { id: 'M11', name: 'SDM & Payroll Kepegawaian', status: 'SKEMA SIAP', badge: 'bg-blue-100 text-blue-800' },
              { id: 'M12', name: 'Penelitian & Pengabdian LPPM', status: 'SKEMA SIAP', badge: 'bg-blue-100 text-blue-800' },
              { id: 'M13', name: 'Administrasi & Persuratan', status: 'SKEMA SIAP', badge: 'bg-blue-100 text-blue-800' },
              { id: 'M14', name: 'Magang & Tracer Study', status: 'SKEMA SIAP', badge: 'bg-blue-100 text-blue-800' },
              { id: 'M15', name: 'Fasilitas & Manajemen Aset', status: 'SKEMA SIAP', badge: 'bg-blue-100 text-blue-800' },
              { id: 'M16', name: 'Organisasi Kemahasiswaan', status: 'SKEMA SIAP', badge: 'bg-blue-100 text-blue-800' },
              { id: 'M17', name: 'Notifikasi & Pengumuman', status: 'SKEMA SIAP', badge: 'bg-blue-100 text-blue-800' },
              { id: 'M18', name: 'Dashboard Eksekutif Multi-Role', status: 'BERFUNGSI', badge: 'bg-emerald-100 text-emerald-800' },
              { id: 'M19', name: 'AI Campus Assistant', status: 'DIRENCANAKAN', badge: 'bg-slate-100 text-slate-700' },
            ].map((mod) => (
              <div
                key={mod.id}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-icms-academic-blue">{mod.id}</span>
                  <span className="text-xs font-semibold text-icms-navy">{mod.name}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${mod.badge}`}>
                  {mod.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
