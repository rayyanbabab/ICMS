import React, { useEffect, useState } from 'react';
import {
  Server,
  Database,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Cpu,
  GraduationCap,
  Users,
  Wallet,
  BookOpen,
} from 'lucide-react';

interface HealthData {
  status: string;
  service: string;
  version: string;
  uptime: number;
  database: {
    status: string;
    latencyMs: number | null;
  };
}

export const DashboardPage: React.FC = () => {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/health')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Transform interceptor returns ApiResponse shape: { success: true, data: { ... } }
        setHealth(data.data || data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Welcome Card */}
      <div className="bg-gradient-to-r from-icms-deep-navy via-icms-navy to-icms-academic-blue rounded-xl p-6 text-white shadow-lg border border-slate-700/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-icms-gold/20 text-icms-gold text-[11px] font-semibold tracking-wider uppercase mb-2 border border-icms-gold/30">
              Phase 0 Architecture & Foundation
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Integrated Campus Management System (ICMS)
            </h1>
            <p className="text-slate-300 text-xs mt-1 max-w-2xl">
              Enterprise digital platform for university operations: Academic Governance, Student Lifecycle,
              LMS, Digital Library, Financial Operations, and Executive Analytics.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="http://localhost:4000/api/v1/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-icms-gold hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-semibold shadow transition-all"
            >
              <span>Swagger API Docs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-icms-academic-blue/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metric / Infrastructure Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Backend API Service */}
        <div className="bg-white rounded-xl p-4 border border-icms-border shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Backend Core API</span>
            <div className="text-lg font-bold text-icms-navy mt-1">NestJS 11 + TS</div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400' : error ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              <span className="text-slate-600">
                {loading ? 'Memeriksa...' : error ? 'Offline' : `Aktif (Port 4000)`}
              </span>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50 text-icms-academic-blue border border-blue-100">
            <Server className="w-5 h-5" />
          </div>
        </div>

        {/* Database Service */}
        <div className="bg-white rounded-xl p-4 border border-icms-border shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Database Engine</span>
            <div className="text-lg font-bold text-icms-navy mt-1">PostgreSQL 18</div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${health?.database?.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              <span className="text-slate-600">
                {health?.database?.status === 'healthy'
                  ? `Terhubung (${health.database.latencyMs} ms)`
                  : 'Siap Konfigurasi'}
              </span>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Database className="w-5 h-5" />
          </div>
        </div>

        {/* ORM & Schemas */}
        <div className="bg-white rounded-xl p-4 border border-icms-border shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Data Modeling</span>
            <div className="text-lg font-bold text-icms-navy mt-1">Prisma ORM v6</div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>35+ Model Terstruktur</span>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Security & Access */}
        <div className="bg-white rounded-xl p-4 border border-icms-border shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Access Control</span>
            <div className="text-lg font-bold text-icms-navy mt-1">RBAC + Argon2</div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-icms-gold" />
              <span>14 Role Terdefinisi</span>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Phase 0 Checklist & 19 Modules Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Phase 0 Deliverables Check */}
        <div className="bg-white rounded-xl p-5 border border-icms-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-icms-border">
            <h2 className="text-sm font-bold text-icms-navy flex items-center gap-2">
              <Cpu className="w-4 h-4 text-icms-academic-blue" />
              Capaian Phase 0 (Foundation)
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
              SELESAI
            </span>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Monorepo Architecture Scaffolding', desc: 'apps/web, apps/api, packages/shared', done: true },
              { title: 'React + TypeScript + Vite Frontend', desc: 'Tailwind CSS, React Router, Design Tokens', done: true },
              { title: 'NestJS Modular Backend API', desc: 'REST API, Global Validation, Exception Filters', done: true },
              { title: 'Prisma Schema & Domain Tables', desc: 'Auth, Org, Academic, KRS/KHS, Finance, LMS', done: true },
              { title: 'Docker Compose & Nginx Proxy', desc: 'Postgres, Redis, MinIO S3, Reverse Proxy', done: true },
              { title: 'Swagger / OpenAPI Specification', desc: 'Endpoint /api/v1/docs aktif & terintegrasi', done: true },
              { title: 'Shared Domain Contracts & Enums', desc: 'Role, Permission, StudentStatus, InvoiceStatus', done: true },
            ].map((task, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-800">{task.title}</div>
                  <div className="text-[11px] text-slate-500">{task.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 19 Modules Implementation Roadmap */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-icms-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-icms-border">
            <div>
              <h2 className="text-sm font-bold text-icms-navy">19 Modul Ekosistem Kampus Terpadu</h2>
              <p className="text-[11px] text-slate-500">Peta implementasi bertahap sesuai Master Blueprint ICMS</p>
            </div>
            <span className="text-xs font-medium text-slate-500">Tahap Selanjutnya: Phase 1</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[430px] overflow-y-auto pr-1">
            {[
              { id: 'M01', name: 'Autentikasi & Manajemen Pengguna', phase: 'Phase 1', icon: ShieldCheck, status: 'Siap Implementasi' },
              { id: 'M02', name: 'Manajemen Mahasiswa', phase: 'Phase 2', icon: Users, status: 'Skema Siap' },
              { id: 'M03', name: 'Manajemen Akademik & Kurikulum', phase: 'Phase 2', icon: BookOpen, status: 'Skema Siap' },
              { id: 'M04', name: 'KRS & KHS Mahasiswa', phase: 'Phase 2', icon: GraduationCap, status: 'Skema Siap' },
              { id: 'M05', name: 'Manajemen Dosen & Beban Ajar', phase: 'Phase 2', icon: Users, status: 'Skema Siap' },
              { id: 'M06', name: 'Keuangan & Invoicing SPP/UKT', phase: 'Phase 3', icon: Wallet, status: 'Skema Siap' },
              { id: 'M07', name: 'Presensi QR & Lokasi', phase: 'Phase 3', icon: Clock, status: 'Skema Siap' },
              { id: 'M08', name: 'LMS (Learning Management System)', phase: 'Phase 4', icon: Layers, status: 'Skema Siap' },
              { id: 'M09', name: 'Ujian Online & Bank Soal', phase: 'Phase 4', icon: CheckCircle2, status: 'Skema Siap' },
              { id: 'M10', name: 'Perpustakaan Digital (E-Book)', phase: 'Phase 5', icon: BookOpen, status: 'Skema Siap' },
              { id: 'M11', name: 'SDM & Payroll Kepegawaian', phase: 'Phase 5', icon: Users, status: 'Skema Siap' },
              { id: 'M12', name: 'Penelitian & Pengabdian LPPM', phase: 'Phase 5', icon: Layers, status: 'Skema Siap' },
              { id: 'M13', name: 'Administrasi & Persuratan Digital', phase: 'Phase 5', icon: Layers, status: 'Skema Siap' },
              { id: 'M14', name: 'Magang & Tracer Study Alumni', phase: 'Phase 5', icon: Layers, status: 'Skema Siap' },
              { id: 'M15', name: 'Fasilitas & Manajemen Aset', phase: 'Phase 5', icon: Layers, status: 'Skema Siap' },
              { id: 'M16', name: 'Organisasi & Kegiatan Mahasiswa', phase: 'Phase 5', icon: Layers, status: 'Skema Siap' },
              { id: 'M17', name: 'Notifikasi & Komunikasi Kampus', phase: 'Phase 3', icon: Layers, status: 'Skema Siap' },
              { id: 'M18', name: 'Executive & Multi-Role Dashboard', phase: 'Phase 6', icon: Layers, status: 'Skema Siap' },
              { id: 'M19', name: 'AI Intelligent Campus Assistant', phase: 'Phase 6', icon: Layers, status: 'Direncanakan' },
            ].map((mod) => {
              const Icon = mod.icon;
              return (
                <div
                  key={mod.id}
                  className="p-3 rounded-lg border border-slate-100 hover:border-icms-academic-blue/40 bg-slate-50/60 hover:bg-white transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-icms-academic-blue flex items-center justify-center font-bold text-xs shrink-0">
                      {mod.id}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-icms-navy">{mod.name}</div>
                      <div className="text-[10px] text-slate-500">{mod.phase}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 shrink-0">
                    {mod.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

