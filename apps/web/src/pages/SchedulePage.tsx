import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { StatCard } from '../components/ui/StatCard';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  Layers,
  Building
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DAYS_MAP: Record<number, string> = {
  1: 'Senin',
  2: 'Selasa',
  3: 'Rabu',
  4: 'Kamis',
  5: 'Jumat',
  6: 'Sabtu',
  7: 'Minggu',
};

export const SchedulePage: React.FC = () => {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState<number | 'ALL'>('ALL');

  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ['academic-schedules'],
    queryFn: async () => {
      const res = await api.get('/academic/schedules');
      return res.data;
    },
  });

  const schedules: any[] = scheduleData?.schedules || [];
  const isStudent = scheduleData?.roleContext === 'STUDENT';

  // Filter schedules
  const filteredSchedules = selectedDay === 'ALL'
    ? schedules
    : schedules.filter((s) => s.dayOfWeek === selectedDay);

  // Group by day for organized weekly matrix view
  const daysList = [1, 2, 3, 4, 5, 6];

  // Calculate unique total credits
  const totalCredits = schedules.reduce((acc, s) => acc + (s.credits || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Jadwal Perkuliahan Terintegrasi
            </span>
            <span className="text-xs text-slate-300 font-medium">Semester Ganjil 2026/2027</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            {isStudent ? 'Jadwal Kuliah Mingguan Mahasiswa' : 'Jadwal Mengajar & Perkuliahan'}
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            {isStudent
              ? 'Matriks jadwal tatap muka dan praktikum laboratorium sesuai Kartu Rencana Studi (KRS) resmi.'
              : 'Daftar penugasan kelas perkuliahan, alokasi ruang laboratorium, dan waktu tatap muka dosen.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/10 transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Cetak Jadwal
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Kelas Pertemuan"
          value={schedules.length}
          subtitle="Sesi Per Minggu"
          icon={CalendarIcon}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Total Beban SKS"
          value={totalCredits}
          subtitle="Satuan Kredit Semester"
          icon={BookOpen}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Hari Aktif Kuliah"
          value="Senin - Jumat"
          subtitle="5 Hari Kerja Efektif"
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Gedung Perkuliahan"
          value="Kampus A Thamrin"
          subtitle="Lab Komputer & Ruang Teori"
          icon={Building}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Day Filter Pills */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedDay('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedDay === 'ALL'
                ? 'bg-icms-academic-blue text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Hari ({schedules.length})
          </button>
          {daysList.map((dayNum) => {
            const count = schedules.filter((s) => s.dayOfWeek === dayNum).length;
            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDay(dayNum)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedDay === dayNum
                    ? 'bg-icms-academic-blue text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {DAYS_MAP[dayNum]} ({count})
              </button>
            );
          })}
        </div>

        <span className="text-xs text-slate-400 font-medium shrink-0">
          Waktu: Waktu Indonesia Barat (WIB)
        </span>
      </div>

      {/* Schedules List / Grid */}
      {selectedDay === 'ALL' ? (
        <div className="space-y-6">
          {daysList.map((dayNum) => {
            const daySchedules = schedules.filter((s) => s.dayOfWeek === dayNum);
            if (daySchedules.length === 0) return null;

            return (
              <div key={dayNum} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-icms-academic-blue" />
                  <h3 className="font-bold text-base text-slate-900 font-heading">
                    {DAYS_MAP[dayNum]}
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    ({daySchedules.length} Kelas Perkuliahan)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {daySchedules.map((sch) => (
                    <ScheduleCard key={sch.id} schedule={sch} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchedules.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-slate-200">
              <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-slate-700">Tidak ada jadwal kuliah pada hari ini</h4>
              <p className="text-xs text-slate-400 mt-1">Gunakan waktu luang untuk belajar mandiri atau diskusi kelompok.</p>
            </div>
          ) : (
            filteredSchedules.map((sch) => (
              <ScheduleCard key={sch.id} schedule={sch} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

const ScheduleCard: React.FC<{ schedule: any }> = ({ schedule }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between gap-4 group">
      <div className="space-y-3">
        {/* Time and Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 font-mono bg-slate-100 px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-icms-academic-blue" />
            <span>{schedule.startTime} - {schedule.endTime} WIB</span>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            {schedule.credits} SKS
          </span>
        </div>

        <div>
          <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
            {schedule.courseCode} • Kelas {schedule.className}
          </div>
          <h4 className="font-bold text-base text-slate-900 group-hover:text-icms-academic-blue transition-colors leading-snug mt-0.5">
            {schedule.courseName}
          </h4>
        </div>

        <div className="space-y-1.5 text-xs text-slate-600 pt-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-800">{schedule.classroomName} ({schedule.classroomCode})</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500">{schedule.building || 'Gedung Utama'}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-700 font-medium">{schedule.lecturerName}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <Link
          to="/operasional/presensi"
          className="text-xs font-bold text-icms-academic-blue hover:text-blue-700 hover:underline flex items-center gap-1"
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Presensi Kelas
        </Link>
        <Link
          to="/operasional/lms"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          Modul LMS →
        </Link>
      </div>
    </div>
  );
};
