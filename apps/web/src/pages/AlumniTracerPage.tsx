import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { StatCard } from '../components/ui/StatCard';
import { 
  GraduationCap, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Sparkles, 
  Building2, 
  Award, 
  CheckCircle2,
  Users
} from 'lucide-react';

export const AlumniTracerPage: React.FC = () => {
  const { data: alumniData, isLoading } = useQuery({
    queryKey: ['alumni-tracer'],
    queryFn: async () => {
      const res = await api.get('/management/alumni');
      return res.data;
    },
  });

  const graduates: any[] = alumniData?.recentGraduates || [];
  const stats = alumniData?.stats;

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Pelacakan Jejak Lulusan (Tracer Study)
            </span>
            <span className="text-xs text-slate-300 font-medium">Direktorat Hubungan Alumni & Karir</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Ikatan Alumni & Evaluasi Tracer Study
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Survei daya serap lulusan di dunia kerja, keselarasan kompetensi kurikulum, dan jejaring alumni universitas secara berkelanjutan.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Alumni Terdata"
          value={stats?.totalAlumni || 3420}
          subtitle="Wisudawan Angkatan 2016 - 2026"
          icon={Users}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Masa Tunggu Kerja"
          value={`${stats?.averageWaitingMonth || 1.8} Bulan`}
          subtitle="Standar Nasional < 3 Bulan"
          icon={Clock}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Keselarasan Bidang Kerja"
          value={`${stats?.fieldRelevancePercentage || 91.4}%`}
          subtitle="Sesuai Bidang Komputasi"
          icon={CheckCircle2}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Gaji Pertama Rata-rata"
          value={formatIDR(stats?.averageStartingSalaryIDR || 8500000)}
          subtitle="Di Atas UMR Regional"
          icon={DollarSign}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Recent Graduates Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-icms-navy">Daftar Sampel Responden Tracer Study Terkini</h3>
            <p className="text-xs text-slate-500 mt-0.5">Wisudawan yang telah berhasil diserap oleh industri terkemuka.</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {graduates.length} Responden
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Nama Alumni & NIM</th>
                <th className="px-5 py-3.5">Program Studi</th>
                <th className="px-5 py-3.5">Tahun Lulus & IPK</th>
                <th className="px-5 py-3.5">Tempat Bekerja</th>
                <th className="px-5 py-3.5">Posisi / Jabatan</th>
                <th className="px-5 py-3.5">Waktu Tunggu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {graduates.map((alm) => (
                <tr key={alm.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900 text-sm">{alm.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">NIM: {alm.nim}</div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700 font-medium">{alm.studyProgram}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-slate-800">Lulus {alm.gradYear}</span>
                    <span className="text-[11px] text-emerald-600 block font-semibold">IPK: {alm.ipk}</span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-icms-navy">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{alm.currentCompany}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800">{alm.currentRole}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {alm.waitingMonths} Bulan
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
