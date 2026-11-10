import React, { useState } from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { ChartCard } from '../../components/ui/ChartCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  GraduationCap,
  Users,
  Wallet,
  TrendingUp,
  Award,
  Building2,
  FileText,
  CheckCircle,
  Calendar,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const ENROLLMENT_TRENDS = [
  { year: '2022', pendaftar: 8200, diterima: 2800 },
  { year: '2023', pendaftar: 9400, diterima: 3100 },
  { year: '2024', pendaftar: 11200, diterima: 3450 },
  { year: '2025', pendaftar: 13100, diterima: 3800 },
  { year: '2026', pendaftar: 14850, diterima: 4120 },
];

const FACULTY_FINANCE_DATA = [
  { fakultas: 'FTI', target: 16.5, realisasi: 15.8 },
  { fakultas: 'FEB', target: 14.2, realisasi: 13.9 },
  { fakultas: 'FH', target: 8.5, realisasi: 8.1 },
  { fakultas: 'FK', target: 12.0, realisasi: 11.6 },
];

export const RectorDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2026-1');

  return (
    <div className="space-y-6">
      {/* Executive Welcome & Period Selector */}
      <div className="bg-white rounded-2xl p-6 border border-icms-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold uppercase tracking-wider border border-emerald-200">
              Executive Governance
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs font-semibold text-icms-navy">Universitas Indonesia Mandiri (UIM)</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-icms-navy mt-1">
            Dashboard Eksekutif Rektorat
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ringkasan strategis kinerja institusi, tren akademik, dan performa finansial universitas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-icms-academic-blue" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none cursor-pointer"
            >
              <option value="2026-1">TA 2026/2027 Ganjil</option>
              <option value="2025-2">TA 2025/2026 Genap</option>
              <option value="2025-1">TA 2025/2026 Ganjil</option>
            </select>
          </div>

          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-icms-navy hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all">
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Laporan</span>
          </button>
        </div>
      </div>

      {/* 6 Executive Strategic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Mahasiswa Aktif"
          value="14.270"
          subtitle="Target: 15.000"
          icon={GraduationCap}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
          trend={{ value: '8.4% YoY', isPositive: true }}
        />
        <StatCard
          title="Dosen & Tenaga Ahli"
          value="620"
          subtitle="78% Bergelar Doktor"
          icon={Users}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          trend={{ value: '+24 Dosen', isPositive: true }}
        />
        <StatCard
          title="Pendapatan UKT"
          value="Rp 48,5 M"
          subtitle="Realisasi 94.2%"
          icon={Wallet}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          trend={{ value: '12.1% YoY', isPositive: true }}
        />
        <StatCard
          title="Tunggakan SPP"
          value="Rp 2,8 M"
          subtitle="Dalam Penagihan"
          icon={TrendingUp}
          iconBg="bg-rose-50"
          iconColor="text-rose-600"
          trend={{ value: '-1.4% Turun', isPositive: true }}
        />
        <StatCard
          title="Rata-rata IPK Kampus"
          value="3.48"
          subtitle="Skala 4.00"
          icon={Award}
          iconBg="bg-amber-50"
          iconColor="text-icms-gold"
          trend={{ value: '+0.06 Pts', isPositive: true }}
        />
        <StatCard
          title="Akreditasi Institusi"
          value="UNGGUL"
          subtitle="BAN-PT No. 102/2024"
          icon={Building2}
          iconBg="bg-purple-50"
          iconColor="text-purple-700"
        />
      </div>

      {/* Middle Section: Enrollment & Financial Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend PMB AreaChart */}
        <ChartCard
          title="Pertumbuhan Peminat & Mahasiswa Baru"
          subtitle="Tren pendaftaran 5 tahun akademik terakhir (UIM)"
        >
          <div className="h-[270px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ENROLLMENT_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="pendaftarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="diterimaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} tickLine={false} />
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
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="pendaftar" name="Pendaftar PMB" stroke="#2563EB" strokeWidth={2} fill="url(#pendaftarGrad)" />
                <Area type="monotone" dataKey="diterima" name="Mahasiswa Diterima" stroke="#10B981" strokeWidth={2} fill="url(#diterimaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Realisasi Keuangan BarChart */}
        <ChartCard
          title="Kinerja Pendapatan SPP/UKT per Fakultas"
          subtitle="Target vs Realisasi Anggaran (Miliar Rupiah)"
        >
          <div className="h-[270px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FACULTY_FINANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="fakultas" stroke="#94A3B8" fontSize={11} tickLine={false} />
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
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="target" name="Target (M)" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="realisasi" name="Realisasi (M)" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Bottom Section: Faculty Performance & Executive Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Faculty Performance Comparison */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-icms-border shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-icms-navy font-heading">Perbandingan Kinerja Fakultas</h3>
              <p className="text-xs text-slate-500 mt-0.5">Metrik akademik & rasio dosen-mahasiswa semester berjalan</p>
            </div>
            <span className="text-xs font-semibold text-icms-academic-blue">4 Fakultas Aktif</span>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-4">Fakultas</th>
                  <th className="py-2.5 px-4">Dekan</th>
                  <th className="py-2.5 px-4 text-center">Jml Mahasiswa</th>
                  <th className="py-2.5 px-4 text-center">Rata-rata IPK</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'Fakultas Teknologi Informasi (FTI)', dekan: 'Prof. Dr. Ir. Hendra Setiawan', mhs: '4.820', ipk: '3.52', status: 'ACTIVE' },
                  { name: 'Fakultas Ekonomi & Bisnis (FEB)', dekan: 'Dr. Hj. Sri Wahyuni, S.E., M.Si.', mhs: '4.150', ipk: '3.45', status: 'ACTIVE' },
                  { name: 'Fakultas Kedokteran (FK)', dekan: 'dr. Farhan Malik, Sp.A(K)', mhs: '1.920', ipk: '3.61', status: 'ACTIVE' },
                  { name: 'Fakultas Hukum (FH)', dekan: 'Dr. Surya Darmawan, S.H., M.H.', mhs: '3.380', ipk: '3.38', status: 'ACTIVE' },
                ].map((fac, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-800">{fac.name}</td>
                    <td className="py-3 px-4 text-slate-600">{fac.dekan}</td>
                    <td className="py-3 px-4 text-center font-bold text-icms-navy">{fac.mhs}</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-600">{fac.ipk}</td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status="ACTIVE" label="Optimal" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Executive Decisions & Approvals */}
        <div className="bg-white rounded-2xl p-5 border border-icms-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-icms-navy font-heading flex items-center gap-2">
                <FileText className="w-4 h-4 text-icms-gold" />
                Keputusan & Persetujuan Rektor
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                3 Tertunda
              </span>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              {[
                { title: 'Usulan Pembukaan Prodi Magister AI', pengaju: 'Senat FTI', deadline: 'Hari Ini' },
                { title: 'Persetujuan Alokasi Dana Hibah Riset', pengaju: 'Ketua LPPM', deadline: '12 Nov' },
                { title: 'SK Yudisium Wisuda Periode Ganjil', pengaju: 'Wakil Rektor I (Akademik)', deadline: '15 Nov' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-800">{item.title}</div>
                    <div className="text-[11px] text-slate-500">Oleh: {item.pengaju}</div>
                  </div>
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-100">
                    {item.deadline}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full mt-4 py-2.5 bg-icms-navy hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all">
            <span>Buka Pusat Persetujuan Rektorat</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

