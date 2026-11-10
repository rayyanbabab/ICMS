import React from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { ChartCard } from '../../components/ui/ChartCard';
import { 
  Building2, 
  GraduationCap, 
  Users, 
  Award, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ShieldCheck,
  FileCheck2,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const DeanDashboard: React.FC = () => {
  const prodiDistribution = [
    { name: 'S1 Teknik Informatika', students: 640, color: '#2563EB' },
    { name: 'S1 Sistem Informasi', students: 380, color: '#10B981' },
    { name: 'S1 Sains Data', students: 220, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6">
      {/* Dean Executive Header */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Pimpinan Fakultas (Dekanat)
            </span>
            <span className="text-xs text-slate-300 font-medium">Fakultas Teknologi Informasi (FTI)</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Dashboard Eksekutif Dekan Fakultas
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Pemantauan kinerja tridharma fakultas, mutu program studi, rasio dosen-mahasiswa, dan kelulusan tepat waktu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-right">
            <span className="text-xs text-slate-300 block">Status Akreditasi UPPS</span>
            <span className="text-sm font-bold text-emerald-400">UNGGUL (A) LAM-INFOKOM</span>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Mahasiswa Aktif Fakultas"
          value="1,240 Org"
          subtitle="Semester Ganjil 2026/2027"
          icon={Users}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Rata-rata IPK Fakultas"
          value="3.62"
          subtitle="Target Mutu Institusi >= 3.25"
          icon={Award}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Dosen Homebase FTI"
          value="42 Dosen"
          subtitle="100% Memenuhi BKD"
          icon={GraduationCap}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Kelulusan Tepat Waktu"
          value="89.2%"
          subtitle="Masa Studi <= 4 Tahun"
          icon={CheckCircle2}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Charts & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Distribusi Mahasiswa Per Program Studi"
          subtitle="Sebaran populasi akademik aktif FTI"
          className="lg:col-span-2"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prodiDistribution} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="students" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-icms-navy">Agenda Dekanat Hari Ini</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">3 Agenda</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-icms-academic-blue">09:00 - 10:30 WIB</span>
                <p className="font-bold text-slate-800">Rapat Pleno Kurikulum OBE Bersama Kaprodi</p>
                <span className="text-slate-400 block text-[11px]">Ruang Sidang Dekanat Lt. 2</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-emerald-600">13:30 - 15:00 WIB</span>
                <p className="font-bold text-slate-800">Review Usulan Proposal Hibah Riset LPPM</p>
                <span className="text-slate-400 block text-[11px]">Lab Terpadu Komputer</span>
              </div>
            </div>
          </div>

          <Link
            to="/akademik/program-studi"
            className="w-full text-center py-2 text-xs font-bold text-icms-academic-blue bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            Kelola Program Studi FTI →
          </Link>
        </div>
      </div>
    </div>
  );
};
