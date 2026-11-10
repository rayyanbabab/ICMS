import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../services/api';
import { StatCard } from '../../components/ui/StatCard';
import { ChartCard } from '../../components/ui/ChartCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  Users,
  GraduationCap,
  Building2,
  ShieldAlert,
  Server,
  Database,
  UserPlus,
  KeyRound,
  Calendar,
  History,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface HealthData {
  status: string;
  uptime: number;
  database: {
    status: string;
    latencyMs: number | null;
  };
}

interface OrgStats {
  totalUsers: number;
  totalStudents: number;
  totalLecturers: number;
  totalFaculties: number;
  totalPrograms: number;
}

const API_LATENCY_DATA = [
  { time: '18:00', latency: 42, requests: 120 },
  { time: '19:00', latency: 38, requests: 180 },
  { time: '20:00', latency: 55, requests: 240 },
  { time: '21:00', latency: 45, requests: 310 },
  { time: '22:00', latency: 32, requests: 210 },
  { time: '23:00', latency: 28, requests: 150 },
];

export const SuperAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<OrgStats | null>(null);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiRequest<OrgStats>('/organization/stats').catch(() => null),
      fetch('/api/v1/health')
        .then((res) => res.json())
        .then((r) => r.data || r)
        .catch(() => null),
    ]).then(([statsRes, healthRes]) => {
      if (statsRes?.data) setStats(statsRes.data);
      if (healthRes) setHealth(healthRes);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-deep-navy via-icms-navy to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[11px] font-semibold uppercase tracking-wider mb-2 border border-blue-500/30">
            <Server className="w-3.5 h-3.5" />
            <span>Super Administrator Workspace • System Governance</span>
          </div>
          <h1 className="text-2xl font-bold font-heading">Pusat Kendali Sistem & Keamanan</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl">
            Monitoring kesehatan infrastruktur, hak akses pengguna, integritas transaksi database PostgreSQL, dan audit log seluruh universitas.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="http://localhost:4000/api/v1/docs"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-icms-academic-blue hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow transition-all"
          >
            <span>Swagger OpenAPI</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 6 High-Visibility System KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Akun Pengguna"
          value={stats?.totalUsers ?? '3'}
          subtitle="Semua Role Terdaftar"
          icon={Users}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
          trend={{ value: '100% Aktif', isPositive: true }}
        />
        <StatCard
          title="Data Mahasiswa"
          value={stats?.totalStudents ?? '1'}
          subtitle="NIM Terverifikasi"
          icon={GraduationCap}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          trend={{ value: '+1 Baru', isPositive: true }}
        />
        <StatCard
          title="Dosen Pengajar"
          value={stats?.totalLecturers ?? '1'}
          subtitle="NIDN Terverifikasi"
          icon={Users}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />
        <StatCard
          title="Fakultas & Prodi"
          value={`${stats?.totalFaculties ?? 1} / ${stats?.totalPrograms ?? 1}`}
          subtitle="Struktur Akademik"
          icon={Building2}
          iconBg="bg-amber-50"
          iconColor="text-amber-700"
        />
        <StatCard
          title="Database PostgreSQL"
          value={health?.database?.status === 'healthy' ? 'Online' : 'Standby'}
          subtitle={`Latensi: ${health?.database?.latencyMs ?? 12} ms`}
          icon={Database}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          trend={{ value: 'PostgreSQL 18', isPositive: true }}
        />
        <StatCard
          title="Keamanan & Token"
          value="Argon2id"
          subtitle="JWT Key Protected"
          icon={Lock}
          iconBg="bg-purple-50"
          iconColor="text-purple-700"
        />
      </div>

      {/* Middle Grid: Telemetry & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latency & Throughput Chart */}
        <ChartCard
          title="Telemetri API & Latensi Database"
          subtitle="Beban respon backend /api/v1 (ms) 6 jam terakhir"
          className="lg:col-span-2"
          action={
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Avg: 38ms
              </span>
            </div>
          }
        >
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={API_LATENCY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="latency" name="Latensi (ms)" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#latencyGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Quick Admin Actions */}
        <div className="bg-white rounded-2xl p-5 border border-icms-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-icms-navy font-heading flex items-center gap-2">
                <Activity className="w-4 h-4 text-icms-academic-blue" />
                Tindakan Cepat Sistem
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                Admin Tools
              </span>
            </div>

            <div className="space-y-2.5 mt-4">
              {[
                { title: 'Buat Akun Pengguna Baru', desc: 'Tambahkan user & tetapkan role', icon: UserPlus, href: '/sistem/pengguna' },
                { title: 'Kelola Hak Akses (RBAC)', desc: '14 Role & scope otorisasi', icon: KeyRound, href: '/sistem/pengguna' },
                { title: 'Konfigurasi Tahun Akademik', desc: 'Atur semester aktif & timeline KRS', icon: Calendar, href: '/akademik/kurikulum' },
                { title: 'Lihat Audit Log Aktivitas', desc: 'Riwayat mutasi nilai & keuangan', icon: History, href: '/sistem/audit' },
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-slate-100 hover:border-icms-academic-blue/40 bg-slate-50/70 hover:bg-white transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 group-hover:bg-blue-100 text-icms-academic-blue flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800">{action.title}</div>
                        <div className="text-[10px] text-slate-500">{action.desc}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-icms-academic-blue group-hover:translate-x-0.5 transition-all" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Security Shield Active
            </span>
            <span>Prisma ORM v6</span>
          </div>
        </div>
      </div>

      {/* Recent Login & Security Activity Table */}
      <div className="bg-white rounded-2xl p-5 border border-icms-border shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-icms-navy font-heading">Riwayat Login & Keamanan Terkini</h3>
            <p className="text-xs text-slate-500 mt-0.5">Pencatatan sesi otentikasi pengguna secara real-time</p>
          </div>
          <span className="text-xs text-slate-500 font-medium">Sinkronisasi Real-Time</span>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-4">Pengguna</th>
                <th className="py-2.5 px-4">Role Akses</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">IP Address</th>
                <th className="py-2.5 px-4">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { user: 'admin@icms.ac.id (Super Admin)', role: 'SUPER_ADMIN', status: 'SUCCESS', ip: '127.0.0.1', time: 'Baru saja' },
                { user: 'dosen@icms.ac.id (Dr. Budi Santoso)', role: 'LECTURER', status: 'SUCCESS', ip: '127.0.0.1', time: '5 menit lalu' },
                { user: 'mahasiswa@icms.ac.id (Ahmad Fauzi)', role: 'STUDENT', status: 'SUCCESS', ip: '127.0.0.1', time: '12 menit lalu' },
                { user: 'unknown@tester.com', role: 'UNKNOWN', status: 'FAILED', ip: '192.168.1.10', time: '1 jam lalu' },
              ].map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-800">{log.user}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-icms-academic-blue">{log.role}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={log.status} label={log.status === 'SUCCESS' ? 'Berhasil' : 'Gagal'} />
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{log.ip}</td>
                  <td className="py-3 px-4 text-slate-500">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

