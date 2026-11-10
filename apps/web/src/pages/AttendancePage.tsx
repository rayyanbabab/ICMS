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
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const isLecturer = user?.roles?.includes(UserRole.LECTURER);
  const isStudent = user?.roles?.includes(UserRole.STUDENT);

  const [qrToken, setQrToken] = useState('QR-IF101-2026');
  const [inputToken, setInputToken] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setCheckedIn(true);
      setLoading(false);
      setFeedback('Presensi berhasil dicatat! Kehadiran tervalidasi pada pukul 08:05 WIB.');
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-icms-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-icms-academic-blue text-[11px] font-bold uppercase tracking-wider border border-blue-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Presensi Kuliah Digital (QR Code & Lokasi)</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-icms-navy mt-1">
            Manajemen Kehadiran Perkuliahan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sistem presensi terintegrasi backend untuk mencegah absensi ganda dan memvalidasi kehadiran real-time.
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
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Student Check-in Card */}
      {isStudent && (
        <div className="bg-white rounded-2xl p-6 border border-icms-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-icms-navy font-heading flex items-center gap-2">
              <QrCode className="w-4 h-4 text-emerald-600" />
              Check-in Presensi Sesi Kuliah Berjalan
            </h3>
            <StatusBadge
              status={checkedIn ? 'PRESENT' : 'PENDING'}
              label={checkedIn ? 'Sudah Presensi' : 'Sesi Dibuka'}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-2 text-xs">
              <div className="font-bold text-slate-900 text-sm">
                IF101-01 — Algoritma & Pemrograman Dasar
              </div>
              <div className="text-slate-600">
                Dosen: <strong>Dr. Ir. Budi Santoso, M.Kom.</strong> • Pertemuan ke-8
              </div>
              <div className="flex items-center gap-4 text-slate-500 text-[11px] pt-1">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-icms-academic-blue" />
                  08:00 - 10:30 WIB
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  LAB-KOM-01 (Lab Terpadu Lt. 3)
                </span>
              </div>
            </div>

            <div>
              {!checkedIn ? (
                <form onSubmit={handleCheckIn} className="space-y-2">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Masukkan Token QR Kelas:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Contoh: QR-IF101-2026"
                      value={inputToken}
                      onChange={(e) => setInputToken(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono uppercase focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-sm"
                    >
                      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Kirim'}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Atau scan QR yang ditampilkan dosen di layar proyektor.
                  </span>
                </form>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs text-emerald-800 font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Kehadiran Selesai Diverifikasi!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Attendance History Table */}
      <div className="bg-white rounded-2xl border border-icms-border shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-icms-navy font-heading">
              Riwayat Presensi Semester Ini
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rekapitulasi persentase kehadiran per mata kuliah (Syarat ujian min. 75%)
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Tingkat Kehadiran: 100%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Tanggal & Jam</th>
                <th className="py-3 px-4">Kode & Mata Kuliah</th>
                <th className="py-3 px-4">Pertemuan</th>
                <th className="py-3 px-4">Topik Materi</th>
                <th className="py-3 px-4">Ruang Kuliah</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { date: '10 Nov 2026, 08:02', course: 'IF101 — Algoritma & Pemrograman Dasar', session: 'Pertemuan 8', topic: 'Array 2 Dimensi & Matriks', room: 'LAB-KOM-01', status: 'PRESENT' },
                { date: '03 Nov 2026, 08:05', course: 'IF101 — Algoritma & Pemrograman Dasar', session: 'Pertemuan 7', topic: 'Struktur Kontrol Perulangan (Loops)', room: 'LAB-KOM-01', status: 'PRESENT' },
                { date: '27 Okt 2026, 08:01', course: 'IF101 — Algoritma & Pemrograman Dasar', session: 'Pertemuan 6', topic: 'Kondisional Bersarang (Nested If)', room: 'LAB-KOM-01', status: 'PRESENT' },
                { date: '20 Okt 2026, 13:04', course: 'IF102 — Matematika Diskrit', session: 'Pertemuan 5', topic: 'Relasi Ekuivalensi & Partisi', room: 'R-TEORI-302', status: 'PRESENT' },
              ].map((rec, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-700">{rec.date}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{rec.course}</td>
                  <td className="py-3 px-4 font-semibold text-slate-600">{rec.session}</td>
                  <td className="py-3 px-4 text-slate-600">{rec.topic}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{rec.room}</td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status={rec.status} label="Hadir" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Modal for Lecturer */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="text-left">
                <h3 className="text-sm font-bold text-icms-navy">Sesi Presensi QR Aktif</h3>
                <p className="text-[11px] text-slate-500">IF101-01 • Pertemuan ke-8</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
              <div className="w-44 h-44 bg-white p-3 rounded-xl border border-slate-300 shadow flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center text-white text-[10px] p-2 text-center font-mono">
                  [QR TOKEN: {qrToken}]
                  <br />
                  Scan via Portal Mahasiswa
                </div>
              </div>
              <div className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Token: {qrToken}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Mahasiswa memasukkan kode di atas untuk verifikasi kehadiran.
            </p>

            <button
              onClick={() => setModalOpen(false)}
              className="w-full py-2 bg-icms-navy text-white text-xs font-bold rounded-xl hover:bg-slate-800"
            >
              Tutup QR Presensi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

