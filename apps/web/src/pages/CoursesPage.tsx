import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { StatusBadge } from '../components/ui/StatusBadge';
import { StatCard } from '../components/ui/StatCard';
import {
  BookOpen,
  Search,
  Filter,
  GraduationCap,
  Layers,
  Award,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';

interface CourseItem {
  id: string;
  code: string;
  name: string;
  englishName?: string;
  credits: number;
  semester: number;
  type: string;
  description?: string;
  prerequisites: Array<{
    minGrade?: string;
    prerequisite: { code: string; name: string };
  }>;
}

export const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [search, setSearch] = useState('');
  const [semFilter, setSemFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<CourseItem[]>('/academic/courses')
      .then((res) => {
        if (res.data) setCourses(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase());
    const matchSem = semFilter ? c.semester.toString() === semFilter : true;
    return matchSearch && matchSem;
  });

  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-icms-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-icms-academic-blue text-[11px] font-bold uppercase tracking-wider border border-blue-200">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Katalog Kurikulum & Silabus</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-icms-navy mt-1">
            Daftar Mata Kuliah Program Studi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kurikulum Merdeka 2024 • S1 Teknik Informatika (Fakultas Teknologi Informasi)
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-700">
          <FileSpreadsheet className="w-4 h-4 text-icms-academic-blue" />
          <span className="font-semibold">Total Kurikulum:</span>
          <span className="font-bold text-icms-navy">144 SKS Lulus</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Mata Kuliah"
          value={courses.length || '8'}
          subtitle="Tersedia di Kurikulum"
          icon={BookOpen}
        />
        <StatCard
          title="Total Bobot SKS"
          value={`${totalCredits || 23} SKS`}
          subtitle="Distribusi 8 Semester"
          icon={Layers}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Mata Kuliah Wajib"
          value={courses.filter((c) => c.type === 'MANDATORY').length || '7'}
          subtitle="Kompetensi Utama"
          icon={Award}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />
        <StatCard
          title="Mata Kuliah Pilihan"
          value={courses.filter((c) => c.type === 'ELECTIVE').length || '1'}
          subtitle="Peminatan & Riset"
          icon={GraduationCap}
          iconBg="bg-amber-50"
          iconColor="text-amber-700"
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-icms-border shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode atau nama mata kuliah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-icms-academic-blue"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Semester:</span>
            <select
              value={semFilter}
              onChange={(e) => setSemFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs border border-slate-200 rounded-lg bg-slate-50 font-semibold focus:outline-none"
            >
              <option value="">Semua Semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="5">Semester 5</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course Catalog Table */}
      <div className="bg-white rounded-2xl border border-icms-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Kode MK</th>
                <th className="py-3 px-4">Nama Mata Kuliah</th>
                <th className="py-3 px-4">Nama Internasional (English)</th>
                <th className="py-3 px-4 text-center">Bobot SKS</th>
                <th className="py-3 px-4 text-center">Rekomendasi Sem.</th>
                <th className="py-3 px-4 text-center">Tipe</th>
                <th className="py-3 px-4">Mata Kuliah Prasyarat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-icms-academic-blue">
                    {item.code}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 text-slate-500 italic">
                    {item.englishName || '-'}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-icms-navy">
                    {item.credits} SKS
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-700">
                    Semester {item.semester}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge
                      status={item.type === 'MANDATORY' ? 'ACTIVE' : 'ELECTIVE'}
                      label={item.type === 'MANDATORY' ? 'Wajib' : 'Pilihan'}
                    />
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {item.prerequisites && item.prerequisites.length > 0 ? (
                      item.prerequisites.map((p, idx) => (
                        <span
                          key={idx}
                          className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold mr-1"
                        >
                          {p.prerequisite.code} (Min {p.minGrade || 'D'})
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
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
