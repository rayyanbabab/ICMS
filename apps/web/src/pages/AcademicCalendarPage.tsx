import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { StatCard } from '../components/ui/StatCard';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Printer, 
  ArrowRight,
  BookmarkCheck,
  GraduationCap,
  FileCheck2,
  Wallet
} from 'lucide-react';

export const AcademicCalendarPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const { data: calendarData, isLoading } = useQuery({
    queryKey: ['academic-calendar'],
    queryFn: async () => {
      const res = await api.get('/academic/calendar');
      return res.data;
    },
  });

  const events: any[] = calendarData?.events || [];
  const semInfo = calendarData?.activeSemester;

  const filteredEvents = selectedCategory === 'ALL'
    ? events
    : events.filter((e) => e.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'KEUANGAN': return <Wallet className="w-4 h-4 text-emerald-600" />;
      case 'UJIAN': return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'KELULUSAN': return <GraduationCap className="w-4 h-4 text-blue-600" />;
      default: return <FileCheck2 className="w-4 h-4 text-icms-academic-blue" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-slate-400" /> Selesai
          </span>
        );
      case 'ACTIVE':
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 animate-pulse">
            <Clock className="w-3 h-3 text-emerald-600" /> Berlangsung Saat Ini
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Agenda Mendatang
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Kalender Akademik Resmi Universitas
            </span>
            <span className="text-xs text-slate-300 font-medium">Tahun Akademik 2026/2027</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Kalender & Agenda Akademik Terpadu
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Rangkaian jadwal tahapan penting operasional pendidikan, batas waktu pembayaran, periode evaluasi ujian, hingga penerbitan transkrip KHS.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/10 transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Unduh Dokumen Resmi
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Semester Aktif"
          value={semInfo?.name || 'Semester Ganjil 2026/2027'}
          subtitle={`Kode: ${semInfo?.code || '2026-1'}`}
          icon={Calendar}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Total Agenda Semester"
          value={events.length}
          subtitle="Tahapan Pembelajaran"
          icon={BookmarkCheck}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Fase Saat Ini"
          value="Pekan UTS Ganjil"
          subtitle="15 - 27 Nov 2026"
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Batas Input Nilai Dosen"
          value="30 Jan 2027"
          subtitle="Penerbitan KHS 05 Feb"
          icon={GraduationCap}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'Semua Agenda' },
          { id: 'AKADEMIK', label: 'Administrasi Akademik' },
          { id: 'PERKULIAHAN', label: 'Tatap Muka & Praktikum' },
          { id: 'UJIAN', label: 'Evaluasi UTS & UAS' },
          { id: 'KEUANGAN', label: 'Registrasi & UKT' },
          { id: 'KELULUSAN', label: 'Yudisium & Wisuda' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-icms-navy text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Timeline View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <h3 className="font-bold text-base text-icms-navy">Rangkaian Tahapan Semester Ganjil 2026/2027</h3>

        <div className="relative pl-6 space-y-6 border-l-2 border-slate-100">
          {filteredEvents.map((ev, idx) => {
            const isCompleted = ev.status === 'COMPLETED';
            const isActive = ev.status === 'ACTIVE';

            return (
              <div key={ev.id || idx} className="relative group">
                {/* Node indicator on vertical line */}
                <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white transition-all ${
                  isActive 
                    ? 'border-emerald-500 bg-emerald-500 ring-4 ring-emerald-100 scale-125'
                    : isCompleted
                      ? 'border-slate-400 bg-slate-400'
                      : 'border-blue-400 bg-blue-100'
                }`} />

                <div className={`p-5 rounded-2xl border transition-all ${
                  isActive 
                    ? 'bg-emerald-50/40 border-emerald-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {ev.category}
                        </span>
                        {getStatusBadge(ev.status)}
                      </div>

                      <h4 className="font-bold text-base text-slate-900 group-hover:text-icms-academic-blue transition-colors">
                        {ev.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                        {ev.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold text-icms-navy bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60 inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-icms-academic-blue" />
                        <span>
                          {new Date(ev.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {ev.startDate !== ev.endDate && ` - ${new Date(ev.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
