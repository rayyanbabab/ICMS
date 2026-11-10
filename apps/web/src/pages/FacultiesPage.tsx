import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { StatCard } from '../components/ui/StatCard';
import { 
  Building2, 
  GraduationCap, 
  Users, 
  Award, 
  Sparkles, 
  BookOpen, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FacultiesPage: React.FC = () => {
  const { data: faculties = [], isLoading } = useQuery({
    queryKey: ['faculties'],
    queryFn: async () => {
      const res = await api.get('/organization/faculties');
      return res.data;
    },
  });

  const totalPrograms = faculties.reduce((acc: number, f: any) => acc + (f.studyPrograms?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Struktur Tata Kelola Akademik
            </span>
            <span className="text-xs text-slate-300 font-medium">Universitas Indonesia Mandiri</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Fakultas & Unit Pengelola Program Studi (UPPS)
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Struktur dekanat, departemen akademik, status akreditasi institusi, dan integrasi penjaminan mutu fakultas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-right">
            <span className="text-xs text-slate-300 block">Akreditasi Universitas</span>
            <span className="text-sm font-bold text-emerald-400">UNGGUL (BAN-PT)</span>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Fakultas"
          value={faculties.length}
          subtitle="Fakultas Sains, Teknik & Bisnis"
          icon={Building2}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Total Program Studi"
          value={totalPrograms}
          subtitle="Sarjana (S1), Magister (S2), Diploma"
          icon={GraduationCap}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Standar Mutu"
          value="ISO 9001:2015"
          subtitle="Sistem Penjaminan Mutu Internal"
          icon={ShieldCheck}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Lokasi Kampus"
          value="Thamrin & Sudirman"
          subtitle="Gedung Rektorat & Lab Terpadu"
          icon={Award}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Faculties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faculties.map((fac: any) => (
          <div
            key={fac.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition-all space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {fac.code}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Akreditasi A (Unggul)
                </span>
              </div>

              <div>
                <h3 className="font-bold text-lg text-icms-navy">{fac.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dekan: <strong className="text-slate-800">{fac.deanName || 'Prof. Dr. Ir. Dekan Fakultas, M.Sc.'}</strong>
                </p>
              </div>

              {/* Study programs list under faculty */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Program Studi Di Bawah Fakultas ({fac.studyPrograms?.length || 0}):
                </span>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                  {fac.studyPrograms?.map((prog: any) => (
                    <div key={prog.id} className="p-3 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{prog.degreeLevel} {prog.name}</span>
                        <div className="text-[10px] text-slate-400 font-mono">Kode: {prog.code} • Kaprodi: {prog.headOfProgram || 'Kaprodi'}</div>
                      </div>
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        Akreditasi {prog.accreditation || 'A'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Beban Standar: 144 SKS</span>
              <Link
                to="/akademik/program-studi"
                className="text-xs font-bold text-icms-academic-blue hover:text-blue-700 inline-flex items-center gap-1"
              >
                Lihat Rincian Program Studi <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
