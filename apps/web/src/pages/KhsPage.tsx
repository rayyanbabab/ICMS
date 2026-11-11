import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '@icms/shared';
import { StatusBadge } from '../components/ui/StatusBadge';
import { exportToCsv } from '../utils/export';
import { TranscriptModal } from '../components/ui/TranscriptModal';
import {
  Award,
  BookOpen,
  Printer,
  Download,
  Calendar,
  GraduationCap,
  CheckCircle2,
  FileSpreadsheet,
  Building,
  Edit3,
  Save,
  X,
  Sparkles,
  FileDown,
} from 'lucide-react';

interface KhsReport {
  student: {
    id: string;
    nim: string;
    fullName: string;
    currentSemester: number;
    studyProgram: string;
    faculty: string;
    advisor: string;
    ipk: number;
    totalCreditsCompleted: number;
  };
  semesters: Array<{
    registrationId: string;
    semesterCode: string;
    semesterName: string;
    academicYear: string;
    totalCredits: number;
    ips: number;
    items: Array<{
      detailId: string;
      courseCode: string;
      courseName: string;
      credits: number;
      className: string;
      lecturerName: string;
      scoreNumeric: number | null;
      gradeLetter: string;
      gradePoint: number;
      totalPoint: number;
      isPublished: boolean;
    }>;
  }>;
}

export const KhsPage: React.FC = () => {
  const { user, activeRole } = useAuth();
  const isLecturerOrAdmin = [UserRole.LECTURER, UserRole.HEAD_OF_PROGRAM, UserRole.SUPER_ADMIN].includes(activeRole);

  const [khs, setKhs] = useState<KhsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newScore, setNewScore] = useState<number>(90);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);

  const fetchKhs = () => {
    setLoading(true);
    apiRequest<KhsReport>('/academic/khs/student')
      .then((res) => {
        if (res.data) setKhs(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchKhs();
  }, [user, activeRole]);

  const handleUpdateGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let letter = 'C';
    let point = 2.0;
    if (newScore >= 85) {
      letter = 'A';
      point = 4.0;
    } else if (newScore >= 75) {
      letter = 'B+';
      point = 3.5;
    } else if (newScore >= 70) {
      letter = 'B';
      point = 3.0;
    } else if (newScore >= 60) {
      letter = 'C+';
      point = 2.5;
    }

    try {
      await apiRequest('/academic/khs/grade', {
        method: 'POST',
        body: JSON.stringify({
          detailId: editingItem.detailId,
          scoreNumeric: newScore,
          gradeLetter: letter,
          gradePoint: point,
        }),
      });
      setEditingItem(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      fetchKhs();
    } catch {
      alert('Gagal memperbarui nilai');
    }
  };

  const student = khs?.student;
  const currentSemester = khs?.semesters?.[0];

  const handleExportCsv = () => {
    if (!currentSemester) return;
    const headers = [
      'Kode MK',
      'Nama Mata Kuliah',
      'Kelas',
      'SKS',
      'Dosen Pengampu',
      'Nilai Angka',
      'Nilai Huruf',
      'Bobot Mutu',
      'Status',
    ];
    const rows = currentSemester.items.map((item) => [
      item.courseCode,
      item.courseName,
      item.className,
      item.credits,
      item.lecturerName,
      item.scoreNumeric ?? '-',
      item.gradeLetter,
      item.gradePoint.toFixed(1),
      'LULUS',
    ]);
    const fileName = `KHS_${student?.nim || '202601001'}_${currentSemester.semesterCode || '2026-1'}`;
    exportToCsv(fileName, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-icms-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-icms-academic-blue text-[11px] font-bold uppercase tracking-wider border border-blue-200">
            <Award className="w-3.5 h-3.5" />
            <span>Kartu Hasil Studi (KHS) & Transkrip</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-icms-navy mt-1">
            {isLecturerOrAdmin ? 'Rekapitulasi & Input Nilai Mahasiswa' : 'Kartu Hasil Studi Mahasiswa'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Laporan evaluasi capaian belajar, Indeks Prestasi Semester (IPS), dan Indeks Prestasi Kumulatif (IPK).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Nilai Berhasil Diperbarui!
            </span>
          )}
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs border border-emerald-200 transition-colors shadow-xs"
            title="Ekspor Rekap Nilai ke format CSV / Excel"
          >
            <FileDown className="w-4 h-4 text-emerald-600" />
            <span>Ekspor KHS (.csv)</span>
          </button>
          <button
            onClick={() => setIsTranscriptModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
            title="Cetak Transkrip Akademik Kumulatif dengan TTE Digital"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Transkrip Lengkap (TTE)</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak KHS Resmi</span>
          </button>
        </div>
      </div>

      {/* Student Academic Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-icms-border shadow-sm">
          <span className="text-[11px] font-medium text-slate-400 block">Mahasiswa</span>
          <span className="text-sm font-bold text-icms-navy block mt-0.5">{student?.fullName || 'Ahmad Fauzi'}</span>
          <span className="text-xs font-mono text-slate-500">{student?.nim || '202601001'}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-icms-border shadow-sm">
          <span className="text-[11px] font-medium text-slate-400 block">Program Studi</span>
          <span className="text-sm font-bold text-icms-navy block mt-0.5">
            {student?.studyProgram || 'Teknik Informatika (S1)'}
          </span>
          <span className="text-xs text-slate-500">{student?.faculty || 'Fakultas Teknologi Informasi'}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-icms-border shadow-sm">
          <span className="text-[11px] font-medium text-slate-400 block">Indeks Prestasi Kumulatif (IPK)</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black text-icms-academic-blue font-heading">
              {student?.ipk || '3.85'}
            </span>
            <span className="text-xs text-slate-400">/ 4.00</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600">Predikat: Pujian (Cumlaude)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-icms-border shadow-sm">
          <span className="text-[11px] font-medium text-slate-400 block">Total SKS Diperoleh</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black text-icms-navy font-heading">
              {student?.totalCreditsCompleted || 20}
            </span>
            <span className="text-xs text-slate-400">/ 144 SKS Kelulusan</span>
          </div>
          <span className="text-[11px] text-slate-500">Semester 1 Aktif</span>
        </div>
      </div>

      {/* Grade Table */}
      <div className="bg-white rounded-2xl border border-icms-border shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-icms-navy">
              Rincian Nilai: {currentSemester?.semesterName || 'Semester Ganjil 2026/2027'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              IPS Semester Ini: <strong className="text-icms-academic-blue">{currentSemester?.ips || 3.85}</strong> • Total SKS: <strong className="text-slate-800">{currentSemester?.totalCredits || 20} SKS</strong>
            </p>
          </div>
          {isLecturerOrAdmin && (
            <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Mode Dosen / Admin: Klik baris untuk edit nilai
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Kode MK</th>
                <th className="py-3 px-4">Nama Mata Kuliah</th>
                <th className="py-3 px-4 text-center">SKS</th>
                <th className="py-3 px-4">Dosen Pengampu</th>
                <th className="py-3 px-4 text-center">Nilai Angka</th>
                <th className="py-3 px-4 text-center">Nilai Huruf</th>
                <th className="py-3 px-4 text-center">Bobot Mutu</th>
                <th className="py-3 px-4 text-center">Status</th>
                {isLecturerOrAdmin && <th className="py-3 px-4 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentSemester?.items.map((item) => (
                <tr key={item.detailId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-icms-academic-blue">
                    {item.courseCode}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-icms-navy">
                    {item.courseName}
                    <span className="text-[10px] text-slate-400 block font-normal">Kelas: {item.className}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                    {item.credits}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {item.lecturerName}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                    {item.scoreNumeric ?? '-'}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-md font-bold text-xs bg-blue-50 text-icms-academic-blue border border-blue-200">
                      {item.gradeLetter}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                    {item.gradePoint.toFixed(1)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      LULUS
                    </span>
                  </td>
                  {isLecturerOrAdmin && (
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setNewScore(item.scoreNumeric || 90);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors"
                      >
                        <Edit3 className="w-3 h-3" /> Edit Nilai
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Grade Modal for Lecturer/Admin */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-icms-navy">Input / Ubah Nilai Mahasiswa</h3>
                <p className="text-xs text-slate-500 mt-0.5">{editingItem.courseCode} - {editingItem.courseName}</p>
              </div>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nilai Angka Kumulatif (0 - 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newScore}
                  onChange={(e) => setNewScore(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-1 focus:ring-icms-academic-blue"
                  required
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Konversi Huruf:</span>
                  <span className="font-bold text-icms-academic-blue">
                    {newScore >= 85 ? 'A (4.0)' : newScore >= 75 ? 'B+ (3.5)' : newScore >= 70 ? 'B (3.0)' : 'C+ (2.5)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status Kelulusan:</span>
                  <span className="font-bold text-emerald-600">LULUS</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-icms-academic-blue hover:bg-blue-700 text-white rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Simpan & Publikasikan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Transkrip Akademik Resmi Modal */}
      <TranscriptModal
        isOpen={isTranscriptModalOpen}
        onClose={() => setIsTranscriptModalOpen(false)}
        student={{
          nim: student?.nim || '202601001',
          fullName: student?.fullName || 'Ahmad Fauzi',
          studyProgram: student?.studyProgram || 'S1 Teknik Informatika',
          faculty: student?.faculty || 'Fakultas Teknologi Informasi (FTI)',
          entryYear: 2024,
          totalCredits: student?.totalCreditsCompleted || 78,
          gpa: student?.ipk || 3.88,
        }}
      />
    </div>
  );
};
