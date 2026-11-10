import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { StatCard } from '../components/ui/StatCard';
import { 
  GraduationCap, 
  Building2, 
  Award, 
  Search, 
  Sparkles, 
  BookOpen, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudyProgramsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: faculties = [], isLoading } = useQuery({
    queryKey: ['faculties'],
    queryFn: async () => {
      const res = await api.get('/organization/faculties');
      return res.data;
    },
  });

  // Flatten study programs
  const programs: any[] = faculties.flatMap((f: any) => 
    (f.studyPrograms || []).map((p: any) => ({
      ...p,
      facultyName: f.name,
      facultyCode: f.code,
    }))
  );

  const filteredPrograms = programs.filter((p) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.facultyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Direktori Program Studi Resmi
            </span>
            <span className="text-xs text-slate-300 font-medium">Kurikulum Berbasis Capaian (OBE)</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Program Studi & Departemen Akademik
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Informasi jenjang pendidikan, kepemimpinan kaprodi, status akreditasi BAN-PT/LAM, serta profil lulusan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/akademik/kurikulum"
            className="px-4 py-2.5 text-xs font-bold bg-white text-icms-navy hover:bg-slate-100 rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Lihat Kurikulum & CPL
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Program Studi"
          value={programs.length}
          subtitle="Program Studi Aktif"
          icon={GraduationCap}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Jenjang Pendidikan"
          value="S1 Sarjana"
          subtitle="Gelar Sarjana Komputer (S.Kom)"
          icon={Award}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Peringkat Akreditasi"
          value="Unggul (A)"
          subtitle="LAM-INFOKOM & BAN-PT"
          icon={ShieldCheck}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Total SKS Kelulusan"
          value="144 SKS"
          subtitle="Masa Studi Normal 8 Semester"
          icon={BookOpen}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs font-bold text-slate-700">
          Menampilkan {filteredPrograms.length} Program Studi
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari program studi atau kode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-icms-academic-blue"
          />
        </div>
      </div>

      {/* Study Programs Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPrograms.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {p.code}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Akreditasi {p.accreditation || 'A'}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {p.facultyName}
                </span>
                <h4 className="font-bold text-base text-slate-900 group-hover:text-icms-academic-blue transition-colors mt-0.5">
                  {p.degreeLevel} {p.name}
                </h4>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1 text-slate-600">
                <div>
                  Ketua Program Studi:
                  <strong className="text-slate-800 block">{p.headOfProgram || 'Dr. Anita Rahmawati, S.Kom., M.T.'}</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Beban: 144 SKS</span>
              <Link
                to="/akademik/mata-kuliah"
                className="text-xs font-bold text-icms-academic-blue hover:text-blue-700 flex items-center gap-1"
              >
                Katalog MK <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

