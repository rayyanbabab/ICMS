import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { StatusBadge } from '../components/ui/StatusBadge';
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
} from 'lucide-react';

interface KhsReport {
  student: {
    nim: string;
    currentSemester: number;
    studyProgram: string;
    faculty: string;
    advisorName: string;
    ipk: number;
    totalCredits: number;
  };
  semesters: Array<{
    registrationId: string;
    semesterCode: string;
    semesterName: string;
    academicYear: string;
    status: string;
    semCredits: number;
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
  const [khs, setKhs] = useState<KhsReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<KhsReport>('/academic/khs/student')
      .then((res) => {
        if (res.data) setKhs(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const currentSem = khs?.semesters?.[0];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-2xl p-6 border border-icms-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase tracking-wider border border-emerald-200">
            <Award className="w-3.5 h-3.5" />
            <span>Kartu Hasil Studi (KHS) & Evaluasi Akademik</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-icms-navy mt-1">
            Transkrip Nilai & KHS Semester
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Laporan resmi perolehan nilai akademik per semester berdasarkan perhitungan SKS dan bobot nilai.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-icms-navy hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak KHS / Transkrip</span>
        </button>
      </div>

      {/* Official Academic Transcript Card (Optimized for Screen & Print) */}
      <div className="bg-white rounded-3xl p-8 border border-icms-border shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
        {/* University Letterhead for Print */}
        <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-icms-navy text-white flex items-center justify-center font-bold text-2xl border-2 border-icms-gold shadow">
              U
            </div>
            <div>
              <h2 className="text-lg font-bold text-icms-navy uppercase tracking-tight">
                UNIVERSITAS INDONESIA MANDIRI (UIM)
              </h2>
              <p className="text-xs text-slate-600">
                {khs?.student.faculty || 'Fakultas Teknologi Informasi'} • Program Studi {khs?.student.studyProgram || 'Teknik Informatika (S1)'}
              </p>
              <p className="text-[11px] text-slate-400">
                Akreditasi: UNGGUL • Jl. Kampus Merdeka No. 10, Jakarta Selatan
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold text-icms-navy uppercase tracking-wider">KARTU HASIL STUDI</div>
            <div className="text-[11px] text-slate-500">{currentSem?.semesterName || 'Semester Ganjil 2026/2027'}</div>
          </div>
        </div>

        {/* Student Bio Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold">NIM Mahasiswa:</span>
            <div className="font-mono font-bold text-slate-900 mt-0.5">{khs?.student.nim || '202601001'}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold">Nama Lengkap:</span>
            <div className="font-bold text-slate-900 mt-0.5">Ahmad Fauzi</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold">Semester Berjalan:</span>
            <div className="font-bold text-slate-900 mt-0.5">Semester {khs?.student.currentSemester || 1}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold">Dosen Pembimbing (PA):</span>
            <div className="font-bold text-slate-900 mt-0.5">{khs?.student.advisorName || 'Dr. Ir. Budi Santoso, M.Kom.'}</div>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">IPS (Semester Ini)</span>
            <div className="text-2xl font-black text-emerald-900 mt-1">{currentSem?.ips?.toFixed(2) || '3.85'}</div>
            <span className="text-[10px] text-emerald-700">Skala 4.00</span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">IPK (Kumulatif)</span>
            <div className="text-2xl font-black text-blue-900 mt-1">{khs?.student.ipk?.toFixed(2) || '3.85'}</div>
            <span className="text-[10px] text-blue-700">Predikat: Pujian (Cum Laude)</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">SKS Semester Ini</span>
            <div className="text-2xl font-black text-amber-900 mt-1">{currentSem?.semCredits || 11} SKS</div>
            <span className="text-[10px] text-amber-700">Beban Diambil</span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">Total SKS Lulus</span>
            <div className="text-2xl font-black text-purple-900 mt-1">{khs?.student.totalCredits || 11} SKS</div>
            <span className="text-[10px] text-purple-700">Dari Target 144 SKS</span>
          </div>
        </div>

        {/* Official Grade Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 text-center w-12">No</th>
                <th className="py-3 px-4">Kode MK</th>
                <th className="py-3 px-4">Nama Mata Kuliah</th>
                <th className="py-3 px-4 text-center">SKS (K)</th>
                <th className="py-3 px-4 text-center">Nilai Angka</th>
                <th className="py-3 px-4 text-center">Nilai Huruf</th>
                <th className="py-3 px-4 text-center">Bobot (N)</th>
                <th className="py-3 px-4 text-center">Mutu (K × N)</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentSem?.items.map((item, idx) => (
                <tr key={item.detailId} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="py-3 px-4 font-mono font-bold text-icms-academic-blue">{item.courseCode}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{item.courseName}</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-800">{item.credits}</td>
                  <td className="py-3 px-4 text-center font-mono text-slate-700">{item.scoreNumeric ?? '-'}</td>
                  <td className="py-3 px-4 text-center font-extrabold text-emerald-700 text-sm">{item.gradeLetter}</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-800">{item.gradePoint.toFixed(1)}</td>
                  <td className="py-3 px-4 text-center font-bold text-icms-navy">{item.totalPoint.toFixed(1)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                      LULUS
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
              <tr>
                <td colSpan={3} className="py-3 px-4 text-right">TOTAL</td>
                <td className="py-3 px-4 text-center">{currentSem?.semCredits || 11} SKS</td>
                <td colSpan={3}></td>
                <td className="py-3 px-4 text-center text-icms-navy">
                  {currentSem?.items.reduce((s, i) => s + i.totalPoint, 0).toFixed(1)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Official Signatures */}
        <div className="pt-8 grid grid-cols-2 text-center text-xs">
          <div>
            <p className="text-slate-500 text-[11px]">Mengetahui,</p>
            <p className="font-bold text-slate-800 mt-0.5">Dosen Pembimbing Akademik</p>
            <div className="h-16"></div>
            <p className="font-bold underline text-slate-900">Dr. Ir. Budi Santoso, M.Kom.</p>
            <p className="text-slate-500 text-[10px]">NIDN: 0012058001</p>
          </div>

          <div>
            <p className="text-slate-500 text-[11px]">Jakarta, 10 November 2026</p>
            <p className="font-bold text-slate-800 mt-0.5">Ketua Program Studi Teknik Informatika</p>
            <div className="h-16"></div>
            <p className="font-bold underline text-slate-900">Dr. Anita Rahmawati, S.Kom., M.T.</p>
            <p className="text-slate-500 text-[10px]">NIP: 198204152008012001</p>
          </div>
        </div>
      </div>
    </div>
  );
};
