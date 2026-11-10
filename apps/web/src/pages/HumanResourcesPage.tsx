import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { StatCard } from '../components/ui/StatCard';
import { 
  Users, 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  Mail,
  UserCheck
} from 'lucide-react';

export const HumanResourcesPage: React.FC = () => {
  const { data: hrData, isLoading } = useQuery({
    queryKey: ['human-resources'],
    queryFn: async () => {
      const res = await api.get('/management/hr');
      return res.data;
    },
  });

  const staff: any[] = hrData?.staff || [];
  const stats = hrData?.stats;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Manajemen Sumber Daya Manusia (HRD)
            </span>
            <span className="text-xs text-slate-300 font-medium">Biro Kepegawaian & SDM Kampus</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Direktori Dosen & Tenaga Kependidikan
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Pengelolaan profil dosen, jabatan fungsional akademik, nomor induk dosen nasional (NIDN), dan pemantauan beban kerja dosen (BKD).
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Dosen Tetap"
          value={stats?.totalLecturers || staff.length}
          subtitle="Dosen Ber-NIDN Resmi"
          icon={Users}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Kualifikasi Doktoral (S3)"
          value={`${stats?.doctoralDegrees || 18} Dosen`}
          subtitle="Lulusan LN & PTN Ternama"
          icon={GraduationCap}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Guru Besar (Profesor)"
          value={`${stats?.professors || 5} Dosen`}
          subtitle="Jabatan Fungsional Tertinggi"
          icon={Award}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Kepatuhan BKD"
          value="100% Memenuhi"
          subtitle="Evaluasi Kinerja Semester"
          icon={UserCheck}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Staff Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-icms-navy">Daftar Tenaga Pendidik & Peneliti Kampus</h3>
            <p className="text-xs text-slate-500 mt-0.5">Dosen tetap fakultas di bawah naungan Universitas Indonesia Mandiri.</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {staff.length} Dosen Terdata
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Nama Dosen & Gelar</th>
                <th className="px-5 py-3.5">NIDN</th>
                <th className="px-5 py-3.5">Jabatan Fungsional</th>
                <th className="px-5 py-3.5">Program Studi</th>
                <th className="px-5 py-3.5">Bidang Keahlian</th>
                <th className="px-5 py-3.5">Status BKD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map((lec) => (
                <tr key={lec.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900 text-sm">{lec.name}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" /> {lec.email}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-700">{lec.nidn}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800">{lec.academicRank}</td>
                  <td className="px-5 py-3.5 text-slate-700">{lec.studyProgram}</td>
                  <td className="px-5 py-3.5 text-slate-600 max-w-xs">{lec.specialization}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> MEMENUHI
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
