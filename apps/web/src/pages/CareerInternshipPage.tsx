import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { StatCard } from '../components/ui/StatCard';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  CheckCircle2, 
  GraduationCap, 
  Send,
  ExternalLink
} from 'lucide-react';

export const CareerInternshipPage: React.FC = () => {
  const { data: careerData, isLoading } = useQuery({
    queryKey: ['career-internships'],
    queryFn: async () => {
      const res = await api.get('/management/career');
      return res.data;
    },
  });

  const vacancies: any[] = careerData?.vacancies || [];
  const stats = careerData?.stats;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Kampus Merdeka & Kemitraan Industri
            </span>
            <span className="text-xs text-slate-300 font-medium">Career Development Center (CDC)</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Magang Bersertifikat, MBKM & Peluang Karir
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Pusat penyaluran kerja industri, program magang MBKM setara 20 SKS, dan bursa lowongan kerja alumni.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Lowongan Aktif"
          value={stats?.activeVacancies || 38}
          subtitle="Magang & Posisi Junior"
          icon={Briefcase}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Mitra Industri Resmi"
          value={stats?.industryPartners || 84}
          subtitle="Perusahaan Teknologi & BUMN"
          icon={Building2}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Mahasiswa Sedang Magang"
          value={stats?.studentsInterning || 145}
          subtitle="Program Semester Ganjil"
          icon={GraduationCap}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Konversi SKS MBKM"
          value="20 SKS"
          subtitle="Diakui Otomatis di KHS"
          icon={CheckCircle2}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Vacancies List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-icms-navy">Daftar Lowongan Magang & Posisi Karir Rekomendasi</h3>
          <span className="text-xs text-slate-500">Terbuka untuk Mahasiswa Semester 5 s/d 8</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {vacancies.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {v.type === 'MAGANG_MBKM' ? 'MAGANG MBKM (20 SKS)' : 'ENTRY LEVEL'}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    DIBUKA
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-base text-slate-900 leading-snug">{v.position}</h4>
                  <div className="text-xs text-slate-600 font-semibold mt-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{v.company}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 space-y-1 pt-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{v.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">{v.stipend}</span>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Keahlian Dibutuhkan:</span>
                  <div className="flex flex-wrap gap-1">
                    {v.skills?.map((sk: string, idx: number) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Batas: {v.deadline}</span>
                <button
                  onClick={() => alert(`Lamaran untuk posisi ${v.position} di ${v.company} berhasil dikirim ke Career Center.`)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-icms-academic-blue hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" /> Lamar Magang
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
