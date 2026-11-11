import React from 'react';
import {
  X,
  Printer,
  Download,
  Award,
  CheckCircle2,
  Building,
  GraduationCap,
  QrCode,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export interface TranscriptCourseItem {
  code: string;
  name: string;
  credits: number;
  gradeLetter: string;
  gradePoint: number;
  semester: number;
}

interface TranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    nim: string;
    fullName: string;
    birthPlace?: string;
    birthDate?: string;
    studyProgram: string;
    faculty: string;
    entryYear: number;
    totalCredits: number;
    gpa: number;
  };
  courses?: TranscriptCourseItem[];
}

export const TranscriptModal: React.FC<TranscriptModalProps> = ({
  isOpen,
  onClose,
  student,
  courses,
}) => {
  if (!isOpen) return null;

  const defaultCourses: TranscriptCourseItem[] = courses || [
    { code: 'IF101', name: 'Algoritma & Pemrograman Lanjut', credits: 4, gradeLetter: 'A', gradePoint: 4.0, semester: 1 },
    { code: 'IF102', name: 'Struktur Data & Analisis Algoritma', credits: 3, gradeLetter: 'A', gradePoint: 4.0, semester: 1 },
    { code: 'IF103', name: 'Matematika Diskrit & Teori Graf', credits: 3, gradeLetter: 'B+', gradePoint: 3.5, semester: 1 },
    { code: 'IF104', name: 'Arsitektur & Organisasi Komputer Modern', credits: 3, gradeLetter: 'A-', gradePoint: 3.7, semester: 1 },
    { code: 'IF201', name: 'Desain Basis Data Relasional & NoSQL', credits: 4, gradeLetter: 'A', gradePoint: 4.0, semester: 2 },
    { code: 'IF202', name: 'Pemrograman Berorientasi Objek Terpadu', credits: 4, gradeLetter: 'A', gradePoint: 4.0, semester: 2 },
    { code: 'IF203', name: 'Sistem Operasi & Jaringan Komputer', credits: 3, gradeLetter: 'B+', gradePoint: 3.5, semester: 2 },
    { code: 'IF204', name: 'Rekayasa Perangkat Lunak & Agile Scrum', credits: 3, gradeLetter: 'A', gradePoint: 4.0, semester: 2 },
    { code: 'IF301', name: 'Kecerdasan Buatan & Machine Learning', credits: 3, gradeLetter: 'A', gradePoint: 4.0, semester: 3 },
    { code: 'IF302', name: 'Keamanan Siber & Kriptografi Modern', credits: 3, gradeLetter: 'A-', gradePoint: 3.7, semester: 3 },
    { code: 'IF303', name: 'Pemrograman Web Skala Besar (Full-Stack)', credits: 4, gradeLetter: 'A', gradePoint: 4.0, semester: 3 },
    { code: 'IF304', name: 'Cloud Native Computing & DevOps CI/CD', credits: 3, gradeLetter: 'A', gradePoint: 4.0, semester: 3 },
  ];

  const totalCredits = defaultCourses.reduce((sum, c) => sum + c.credits, 0);
  const totalQualityPoints = defaultCourses.reduce((sum, c) => sum + c.credits * c.gradePoint, 0);
  const calculatedIpk = (totalQualityPoints / totalCredits).toFixed(2);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[95vh]">
        {/* Modal Toolbar (Screen Only, Hidden on Print) */}
        <div className="print:hidden bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm sm:text-base text-slate-800">
              Pratinjau Dokumen Transkrip Akademik Resmi
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 overflow-y-auto print:p-0 print:overflow-visible text-slate-900 text-xs font-sans">
          {/* 1. KOP SURAT UNIVERSITAS */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-center justify-between gap-6">
            <div className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-3xl shrink-0">
              U
            </div>
            <div className="text-center flex-1 space-y-1">
              <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-slate-900 font-heading">
                UNIVERSITAS INDONESIA MANDIRI
              </h1>
              <h2 className="text-sm sm:text-base font-bold uppercase text-slate-800">
                FAKULTAS TEKNOLOGI INFORMASI
              </h2>
              <p className="text-[11px] text-slate-600 font-medium">
                Kampus Utama: Jl. M.H. Thamrin No. 45, Jakarta Pusat • Telp: (021) 89765432 • Web: www.uim.ac.id
              </p>
              <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                STATUS AKREDITASI INSTITUSI: UNGGUL (BAN-PT SK No. 428/SK/BAN-PT/Ak/PT/2024)
              </p>
            </div>
            <div className="w-20 h-20 rounded-2xl border border-slate-300 p-1.5 flex flex-col items-center justify-center text-center shrink-0">
              <QrCode className="w-12 h-12 text-slate-800" />
              <span className="text-[8px] font-mono text-slate-500 mt-0.5">TTE VALID</span>
            </div>
          </div>

          {/* 2. TITLE */}
          <div className="text-center mb-6">
            <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-widest text-slate-900 underline underline-offset-4 font-heading">
              TRANSKRIP AKADEMIK SEMENTARA
            </h2>
            <span className="text-[10px] font-mono text-slate-500 block mt-1">
              Nomor: 088/TRA/FTI-UIM/X/2026
            </span>
          </div>

          {/* 3. STUDENT METADATA GRID */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6 p-4 rounded-xl bg-slate-50/80 border border-slate-200 print:bg-transparent print:border-none print:p-0">
            <div className="space-y-1.5">
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">Nama Mahasiswa</span>
                <span className="font-bold text-slate-900">: {student.fullName}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">Nomor Induk (NIM)</span>
                <span className="font-mono font-bold text-slate-900">: {student.nim}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">Tempat, Tgl Lahir</span>
                <span className="text-slate-800">: {student.birthPlace || 'Jakarta'}, {student.birthDate || '12 Mei 2004'}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">Fakultas</span>
                <span className="font-bold text-slate-900">: {student.faculty || 'Teknologi Informasi'}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">Program Studi</span>
                <span className="font-bold text-slate-900">: {student.studyProgram}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">Jenjang Pendidikan</span>
                <span className="font-bold text-slate-900">: Sarjana (S1)</span>
              </div>
            </div>
          </div>

          {/* 4. COURSE TABLE */}
          <div className="mb-6">
            <table className="w-full border-collapse border border-slate-400 text-left text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-400">
                  <th className="p-2 border border-slate-400 text-center w-10">No</th>
                  <th className="p-2 border border-slate-400 w-20">Kode</th>
                  <th className="p-2 border border-slate-400">Mata Kuliah</th>
                  <th className="p-2 border border-slate-400 text-center w-14">SKS (K)</th>
                  <th className="p-2 border border-slate-400 text-center w-16">Nilai (N)</th>
                  <th className="p-2 border border-slate-400 text-center w-16">Bobot (B)</th>
                  <th className="p-2 border border-slate-400 text-center w-16">Mutu (KxB)</th>
                </tr>
              </thead>
              <tbody>
                {defaultCourses.map((c, idx) => {
                  const quality = (c.credits * c.gradePoint).toFixed(1);
                  return (
                    <tr key={c.code} className="border-b border-slate-300 hover:bg-slate-50">
                      <td className="p-2 border border-slate-400 text-center font-mono">{idx + 1}</td>
                      <td className="p-2 border border-slate-400 font-mono font-semibold">{c.code}</td>
                      <td className="p-2 border border-slate-400 font-medium">{c.name}</td>
                      <td className="p-2 border border-slate-400 text-center font-bold">{c.credits}</td>
                      <td className="p-2 border border-slate-400 text-center font-bold text-blue-700">{c.gradeLetter}</td>
                      <td className="p-2 border border-slate-400 text-center font-mono">{c.gradePoint.toFixed(1)}</td>
                      <td className="p-2 border border-slate-400 text-center font-mono font-bold">{quality}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-400 text-slate-900">
                  <td colSpan={3} className="p-2 border border-slate-400 text-right uppercase">
                    Total Prestasi Kumulatif
                  </td>
                  <td className="p-2 border border-slate-400 text-center font-bold">{totalCredits}</td>
                  <td colSpan={2} className="p-2 border border-slate-400 text-center"></td>
                  <td className="p-2 border border-slate-400 text-center font-bold font-mono">
                    {totalQualityPoints.toFixed(1)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* 5. SUMMARY STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 p-4 rounded-xl border border-slate-300 bg-slate-50 print:bg-transparent">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Total SKS Lulus</span>
              <span className="text-base font-extrabold text-slate-900">{totalCredits} SKS</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Total Bobot Mutu</span>
              <span className="text-base font-extrabold text-slate-900 font-mono">{totalQualityPoints.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Indeks Prestasi Kumulatif</span>
              <span className="text-base font-extrabold text-blue-700 font-mono">{calculatedIpk} / 4.00</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Predikat Kelulusan</span>
              <span className="text-base font-extrabold text-emerald-700">Dengan Pujian</span>
            </div>
          </div>

          {/* 6. SIGNATURE BLOCK */}
          <div className="flex justify-between items-end pt-4">
            <div className="space-y-1.5 text-center">
              <span className="text-[10px] text-slate-500 block">Verifikasi Keaslian Dokumen:</span>
              <div className="p-2 border border-slate-300 rounded-xl inline-block bg-white shadow-xs">
                <QrCode className="w-16 h-16 text-slate-800" />
              </div>
              <span className="text-[9px] font-mono text-slate-400 block">
                ID: VER-TTE-202611-0428
              </span>
            </div>

            <div className="text-center space-y-1 min-w-56">
              <span className="text-slate-600 block">Jakarta, 11 November 2026</span>
              <span className="font-bold text-slate-800 block">Dekan Fakultas Teknologi Informasi</span>
              <div className="h-16 flex items-center justify-center my-1">
                <div className="px-3 py-1 rounded-lg border border-dashed border-emerald-500 text-emerald-800 bg-emerald-50 text-[10px] font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Telah Ditandatangani Secara Elektronik (TTE)</span>
                </div>
              </div>
              <span className="font-extrabold text-slate-900 block underline underline-offset-2">
                Prof. Dr. Ir. Hendra Setiawan, M.Eng.
              </span>
              <span className="font-mono text-slate-500 text-[10px] block">
                NIP: 197405121999031002
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

