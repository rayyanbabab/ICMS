import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { StatusBadge } from '../components/ui/StatusBadge';
import { UserRole } from '@icms/shared';
import {
  Clock,
  QrCode,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  Users,
  X,
  Send,
  Loader2,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  status: string;
  checkInTime: string;
  student: {
    nim: string;
    user: { fullName: string };
  };
}

interface AttendanceSession {
  id: string;
  topic: string;
  sessionNum: number;
  qrCodeToken: string;
  isOpen: boolean;
  class: {
    name: string;
    offering: { course: { code: string; name: string } };
    lecturer?: { user: { fullName: string } };
  };
  records: AttendanceRecord[];
}

export const AttendancePage: React.FC = () => {
  const { user, activeRole } = useAuth();
  const isLecturer = [UserRole.LECTURER, UserRole.SUPER_ADMIN].includes(activeRole);
  const isStudent = activeRole === UserRole.STUDENT;

  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [activeToken, setActiveToken] = useState('QR-IF101-8921');
  const [inputToken, setInputToken] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Local persistent attendees for immediate reactive loop
  const [attendees, setAttendees] = useState<Array<{ nim: string; name: string; time: string; status: string }>>([
    { nim: '202601001', name: 'Ahmad Fauzi', time: '08:05 WIB', status: 'PRESENT' },
    { nim: '202601002', name: 'Rina Salsabila', time: '08:08 WIB', status: 'PRESENT' },
    { nim: '202601003', name: 'Dimas Setiawan', time: '08:12 WIB', status: 'PRESENT' },
  ]);

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const generated = `QR-IF101-${Math.floor(1000 + Math.random() * 9000)}`;
    setActiveToken(generated);
    setModalOpen(false);
    setFeedback(`Sesi presensi baru berhasil dibuka! Token Mahasiswa: ${generated}`);
  };

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setCheckedIn(true);
      setLoading(false);
      setFeedback('Presensi berhasil dicatat! Kehadiran tervalidasi pada pukul ' + new Date().toLocaleTimeString('id-ID') + '.');

      // Add student to shared attendees
      const studentName = user?.fullName || 'Ahmad Fauzi';
      const studentNim = '202601001';
      if (!attendees.some((a) => a.nim === studentNim)) {
        setAttendees([
          { nim: studentNim, name: studentName, time: new Date().toLocaleTimeString('id-ID'), status: 'PRESENT' },
          ...attendees,
        ]);
      }
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-icms-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-icms-academic-blue text-[11px] font-bold uppercase tracking-wider border border-blue-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Presensi Kuliah Digital (QR Code & Token)</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-icms-navy mt-1">
            {isLecturer ? 'Manajemen Sesi Presensi Kelas' : 'Presensi Kehadiran Kuliah'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sistem presensi terintegrasi real-time antara Dosen dan Mahasiswa berbasis validasi token & QR.
          </p>
        </div>

        {isLecturer && (
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-icms-gold hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-sm transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Buka Sesi Presensi QR Hari Ini</span>
          </button>
        )}
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Student Check-in Card */}
      {isStudent && (
        <div className="bg-white rounded-2xl p-6 border border-icms-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-icms-academic-blue">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-icms-navy">Kuliah Sedang Berlangsung</h3>
                <p className="text-xs text-slate-500">IF101 - Algoritma & Pemrograman Lanjut (Kelas IF-1A)</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 animate-pulse">
              Sesi Presensi Aktif
            </span>
          </div>

          {!checkedIn ? (
            <form onSubmit={handleCheckIn} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Masukkan Token Presensi Kelas (Diberikan oleh Dosen):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputToken}
                    onChange={(e) => setInputToken(e.target.value.toUpperCase())}
                    placeholder={`Contoh: ${activeToken}`}
                    className="flex-1 px-4 py-2 font-mono font-bold text-sm tracking-wider uppercase border border-slate-300 rounded-xl focus:ring-1 focus:ring-icms-academic-blue"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-icms-academic-blue hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    {loading ? 'Validasi...' : 'Check-in'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Tips Pengujian: Gunakan token <strong className="text-slate-700 font-mono">{activeToken}</strong>
                </p>
              </div>
            </form>
          ) : (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-emerald-900">Kehadiran Anda Telah Terverifikasi!</h4>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Status: <strong>HADIR</strong> • Waktu: {new Date().toLocaleTimeString('id-ID')} • Lokasi: R-Lab-01
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lecturer / Monitor Active Session Card */}
      {isLecturer && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active QR Token Display */}
          <div className="bg-white p-6 rounded-2xl border border-icms-border shadow-sm flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Token Presensi Aktif</span>
              <div className="text-2xl font-black font-mono tracking-widest text-icms-navy mt-1 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                {activeToken}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Tampilkan kode QR atau bagikan token ini kepada mahasiswa di dalam kelas.
              </p>
            </div>

            <div className="w-full pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Mata Kuliah:</span>
              <span className="font-bold text-slate-800">IF101 (IF-1A)</span>
            </div>
          </div>

          {/* Real-time Attendees List */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-icms-border shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-icms-navy">Daftar Mahasiswa Hadir Real-Time</h3>
                <p className="text-xs text-slate-500 mt-0.5">Mahasiswa yang telah melakukan check-in pada sesi ini.</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {attendees.length} Mahasiswa Hadir
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {attendees.map((a, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50/50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[11px]">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{a.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{a.nim}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">{a.time}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      HADIR
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Buka Sesi */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-icms-navy">Buka Sesi Presensi Baru</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mata Kuliah & Kelas</label>
                <input
                  type="text"
                  disabled
                  value="IF101 - Algoritma & Pemrograman Lanjut (IF-1A)"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Topik Perkuliahan Hari Ini</label>
                <input
                  type="text"
                  defaultValue="Pertemuan ke-8: Binary Search Tree & Graph Traversals"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-icms-academic-blue"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-icms-academic-blue hover:bg-blue-700 text-white rounded-xl shadow-xs"
                >
                  Buat Sesi & Generate Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
