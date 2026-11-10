import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { StatCard } from '../components/ui/StatCard';
import { 
  Users, 
  Award, 
  GraduationCap, 
  Sparkles, 
  Bookmark, 
  CheckCircle2, 
  Trophy, 
  Calendar,
  ExternalLink
} from 'lucide-react';

export const StudentAffairsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scholarships' | 'clubs' | 'achievements'>('scholarships');

  const { data: affairsData, isLoading } = useQuery({
    queryKey: ['student-affairs'],
    queryFn: async () => {
      const res = await api.get('/management/student-affairs');
      return res.data;
    },
  });

  const scholarships: any[] = affairsData?.scholarships || [];
  const clubs: any[] = affairsData?.clubs || [];
  const achievements: any[] = affairsData?.achievements || [];
  const stats = affairsData?.stats;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Pengembangan Bakat & Kesejahteraan Mahasiswa
            </span>
            <span className="text-xs text-slate-300 font-medium">Biro Kemahasiswaan & Alumni</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Kemahasiswaan, Beasiswa & Prestasi Talenta
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Pusat layanan beasiswa pendidikan, organisasi kemahasiswaan (BEM & UKM), serta rekam jejak prestasi kompetisi mahasiswa.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('scholarships')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'scholarships' ? 'bg-white text-icms-navy shadow-xs' : 'text-slate-200 hover:text-white'
            }`}
          >
            Beasiswa ({scholarships.length})
          </button>
          <button
            onClick={() => setActiveTab('clubs')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'clubs' ? 'bg-white text-icms-navy shadow-xs' : 'text-slate-200 hover:text-white'
            }`}
          >
            Organisasi & UKM ({clubs.length})
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'achievements' ? 'bg-white text-icms-navy shadow-xs' : 'text-slate-200 hover:text-white'
            }`}
          >
            Prestasi Lomba ({achievements.length})
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Penerima Beasiswa"
          value={stats?.scholarshipRecipients || 340}
          subtitle="Mahasiswa Terbantu Dana"
          icon={GraduationCap}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Organisasi & UKM"
          value={stats?.activeOrganizations || 18}
          subtitle="Lembaga Minat & Bakat"
          icon={Users}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Prestasi Nasional"
          value={stats?.nationalAchievements || 24}
          subtitle="Juara Gemastik, PKM, dll"
          icon={Trophy}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Prestasi Global"
          value={stats?.internationalAchievements || 6}
          subtitle="Kompetisi Internasional"
          icon={Award}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* TAB 1: SCHOLARSHIPS */}
      {activeTab === 'scholarships' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-icms-navy">Program Bantuan Pendidikan & Beasiswa Aktif</h3>
            <span className="text-xs text-slate-500">Pendaftaran melalui portal ICMS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {scholarships.map((sch) => (
              <div
                key={sch.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {sch.provider}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      DIBUKA
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-slate-900 leading-snug">{sch.name}</h4>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5 text-slate-600">
                    <div>
                      Cakupan Beasiswa:
                      <strong className="text-emerald-700 block">{sch.coverage}</strong>
                    </div>
                    <div>
                      Syarat IPK:
                      <span className="text-slate-800 block">{sch.requirement}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Batas: {sch.deadline}</span>
                  <button
                    onClick={() => alert(`Pengajuan beasiswa ${sch.name} berhasil direkam ke Biro Kemahasiswaan.`)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-icms-academic-blue hover:bg-blue-700 text-white shadow-xs transition-colors"
                  >
                    Daftar Beasiswa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CLUBS */}
      {activeTab === 'clubs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-icms-navy">Lembaga Eksekutif & Unit Kegiatan Mahasiswa (UKM)</h3>
            <span className="text-xs text-slate-500">Wadah kepemimpinan dan minat talenta</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {clubs.map((club) => (
              <div
                key={club.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                    {club.category}
                  </span>
                  <h4 className="font-bold text-base text-slate-900 leading-snug">{club.name}</h4>
                  
                  <div className="text-xs text-slate-600 space-y-1 pt-1">
                    <div>Ketua Umum: <strong>{club.president}</strong></div>
                    <div>Jumlah Anggota: <strong>{club.membersCount} Mahasiswa</strong></div>
                    <div className="text-[11px] text-slate-500 pt-1">Kegiatan Utama: {club.activities}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => alert(`Pendaftaran minat anggota ${club.name} berhasil terkirim.`)}
                    className="w-full py-1.5 rounded-xl text-xs font-bold text-icms-academic-blue bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    Gabung Organisasi →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ACHIEVEMENTS */}
      {activeTab === 'achievements' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-base text-icms-navy">Rekam Prestasi Kejuaraan Mahasiswa</h3>
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
            {achievements.map((ach, idx) => (
              <div key={idx} className="p-4 bg-white hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-500" /> {ach.award}
                    </span>
                    <span className="text-xs text-slate-500">Tahun {ach.year}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{ach.competition}</h4>
                  <p className="text-xs text-slate-600">Kategori: {ach.category} • Tim: <strong>{ach.team}</strong></p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full shrink-0">
                  Terverifikasi Puspresnas
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

