import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { StatCard } from '../components/ui/StatCard';
import { 
  BookOpen, 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  FileText,
  Bookmark,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CurriculumPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'structure' | 'cpl'>('structure');

  const { data: curricula = [], isLoading } = useQuery({
    queryKey: ['curricula'],
    queryFn: async () => {
      const res = await api.get('/academic/curricula');
      return res.data;
    },
  });

  const curr = curricula[0];
  const courses: any[] = curr?.courses || [];

  // Group courses by semester
  const semestersList = [1, 2, 3, 4, 5, 6, 7, 8];

  const cplList = [
    {
      code: 'CPL-01',
      domain: 'Sikap & Tata Nilai',
      statement: 'Mampu menunjukkan sikap bertakwa kepada Tuhan Yang Maha Esa, menjunjung tinggi nilai kemanusiaan, moral, dan etika profesional rekayasa perangkat lunak.',
    },
    {
      code: 'CPL-02',
      domain: 'Pengetahuan Inti Komputasi',
      statement: 'Menguasai konsep teoretis komputasi, struktur diskrit, analisis kompleksitas algoritma, arsitektur sistem komputer, dan jaringan berkinerja tinggi.',
    },
    {
      code: 'CPL-03',
      domain: 'Keterampilan Khusus Rekayasa',
      statement: 'Mampu merancang, mengimplementasikan, menguji, dan memelihara sistem perangkat lunak skala enterprise menggunakan metodologi agile dan praktik DevOps modern.',
    },
    {
      code: 'CPL-04',
      domain: 'Manajemen Data & Kecerdasan Buatan',
      statement: 'Mampu mengelola basis data relasional/non-relasional berskala masif serta menerapkan algoritma Machine Learning dalam menyelesaikan permasalahan bisnis.',
    },
    {
      code: 'CPL-05',
      domain: 'Keterampilan Umum & Kepemimpinan',
      statement: 'Mampu berkomunikasi secara efektif lisan maupun tulisan, bekerja sama dalam tim multidisiplin, serta beradaptasi dengan perkembangan teknologi global.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Kurikulum Berbasis Capaian (OBE)
            </span>
            <span className="text-xs text-slate-300 font-medium">Kurikulum Merdeka 2024</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Struktur Kurikulum & Capaian Pembelajaran Lulusan (CPL)
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            {curr?.name || 'Kurikulum Merdeka Teknik Informatika 2024'} • Total Beban: {curr?.totalCredits || 144} SKS
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('structure')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'structure' ? 'bg-white text-icms-navy shadow-xs' : 'text-slate-200 hover:text-white'
            }`}
          >
            Struktur Semester
          </button>
          <button
            onClick={() => setActiveTab('cpl')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'cpl' ? 'bg-white text-icms-navy shadow-xs' : 'text-slate-200 hover:text-white'
            }`}
          >
            Standar CPL
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Beban SKS"
          value={`${curr?.totalCredits || 144} SKS`}
          subtitle="Syarat Kelulusan Sarjana"
          icon={BookOpen}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Masa Tempuh Normal"
          value="8 Semester"
          subtitle="4 Tahun Masa Studi"
          icon={GraduationCap}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Kompetensi CPL"
          value="5 Capaian"
          subtitle="Standar Asosiasi APTIKOM"
          icon={Target}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Status Akreditasi"
          value="Unggul (A)"
          subtitle="LAM-INFOKOM Mandiri"
          icon={Award}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* TAB 1: STRUCTURE VIEW */}
      {activeTab === 'structure' && (
        <div className="space-y-6">
          {semestersList.map((semNum) => {
            const semCourses = courses.filter((c) => c.semester === semNum);
            if (semCourses.length === 0 && semNum > 2) return null;

            const semSks = semCourses.reduce((acc, c) => acc + c.credits, 0);

            return (
              <div key={semNum} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-icms-academic-blue text-white flex items-center justify-center font-bold text-xs">
                      {semNum}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 font-heading">
                      Semester {semNum}
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                    {semCourses.length} Mata Kuliah • {semSks} SKS
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {semCourses.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {c.code}
                          </span>
                          <span className="text-xs font-bold text-slate-600">{c.credits} SKS</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 mt-2 line-clamp-2 leading-snug">
                          {c.name}
                        </h4>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{c.type === 'MANDATORY' ? 'Wajib Prodi' : 'Pilihan'}</span>
                        <Link to="/akademik/mata-kuliah" className="text-icms-academic-blue font-semibold hover:underline">
                          Silabus →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: CPL VIEW */}
      {activeTab === 'cpl' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="font-bold text-base text-icms-navy">Standar Capaian Pembelajaran Lulusan (CPL)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Standar kompetensi lulusan Program Studi Sarjana Teknik Informatika mengacu pada Kerangka Kualifikasi Nasional Indonesia (KKNI Level 6).
            </p>
          </div>

          <div className="space-y-4">
            {cplList.map((cpl) => (
              <div
                key={cpl.code}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-start gap-4"
              >
                <div className="px-3 py-1.5 rounded-lg bg-icms-navy text-white font-mono font-bold text-xs shrink-0 text-center">
                  {cpl.code}
                </div>
                <div className="space-y-1 flex-1">
                  <span className="text-xs font-bold text-icms-academic-blue uppercase tracking-wider block">
                    Domain: {cpl.domain}
                  </span>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">
                    {cpl.statement}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
