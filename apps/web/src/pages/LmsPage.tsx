import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Download, 
  UploadCloud, 
  AlertCircle, 
  Award,
  GraduationCap,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';

export const LmsPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'materials' | 'assignments'>('materials');

  // Submit assignment modal state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [fileUrlInput, setFileUrlInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Grade assignment modal state (for lecturers)
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [gradeInput, setGradeInput] = useState<number>(90);
  const [feedbackInput, setFeedbackInput] = useState<string>('');

  const { data: lmsData, isLoading, refetch } = useQuery({
    queryKey: ['lms-overview'],
    queryFn: async () => {
      const res = await api.get('/lms/overview');
      return res.data;
    },
  });

  const isStudent = lmsData?.roleContext === 'STUDENT';
  const classes = lmsData?.classes || [];
  
  // Set default selected class once loaded
  const currentClass = classes.find((c: any) => c.classId === selectedClassId) || classes[0];

  const submitMutation = useMutation({
    mutationFn: async ({ assignmentId, fileUrl }: { assignmentId: string; fileUrl: string }) => {
      return api.post(`/lms/assignments/${assignmentId}/submit`, { fileUrl });
    },
    onSuccess: () => {
      setIsSubmitModalOpen(false);
      setFileUrlInput('');
      setSelectedAssignment(null);
      refetch();
    },
  });

  const gradeMutation = useMutation({
    mutationFn: async ({ submissionId, score, feedback }: { submissionId: string; score: number; feedback: string }) => {
      return api.post(`/lms/submissions/${submissionId}/grade`, { score, feedback });
    },
    onSuccess: () => {
      setIsGradeModalOpen(false);
      setSelectedSubmission(null);
      refetch();
    },
  });

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !fileUrlInput.trim()) return;
    submitMutation.mutate({
      assignmentId: selectedAssignment.id,
      fileUrl: fileUrlInput.trim(),
    });
  };

  const handleGradeTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;
    gradeMutation.mutate({
      submissionId: selectedSubmission.id,
      score: Number(gradeInput),
      feedback: feedbackInput,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Digital Classroom 4.0
            </span>
            <span className="text-xs text-slate-300 font-medium">Semester Ganjil 2026/2027</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">Learning Management System (LMS)</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            {isStudent 
              ? 'Akses modul perkuliahan terstruktur, slide dosen, pengumpulan tugas digital, dan umpan balik penilaian akademik.'
              : 'Pusat pengelolaan materi digital, silabus interaktif, penugasan kuliah, serta penilaian berkas mahasiswa.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-right">
            <span className="text-xs text-slate-300 block">Status Peran</span>
            <span className="text-sm font-bold text-emerald-400">
              {isStudent ? 'Mahasiswa Aktif' : 'Dosen Pengampu / Pengelola'}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title={isStudent ? 'Mata Kuliah Diikuti' : 'Kelas Diampu'}
          value={classes.length}
          subtitle="Semester Aktif 2026/2027"
          icon={GraduationCap}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Total Modul & Slide"
          value={lmsData?.totalMaterials || classes.reduce((a: number, c: any) => a + c.totalMaterials, 0)}
          subtitle="File PDF & Presentasi"
          icon={BookOpen}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title={isStudent ? 'Tugas Selesai' : 'Total Tugas'}
          value={isStudent ? `${lmsData?.submittedAssignments || 0} / ${lmsData?.totalAssignments || 0}` : classes.reduce((a: number, c: any) => a + c.totalAssignments, 0)}
          subtitle={isStudent ? 'Kemajuan Penugasan' : 'Proyek & Praktikum'}
          icon={CheckCircle2}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title={isStudent ? 'Tenggat Waktu Terdekat' : 'Menunggu Dinilai'}
          value={isStudent ? (lmsData?.upcomingDeadlines?.length || 0) : (lmsData?.totalPendingGrading || 0)}
          subtitle={isStudent ? 'Perlu Dikerjakan' : 'Berkas Mahasiswa'}
          icon={Clock}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Class Selection Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Daftar Kelas Perkuliahan</h3>
            <span className="text-xs font-medium text-slate-400">{classes.length} Kelas</span>
          </div>

          <div className="space-y-2">
            {classes.map((c: any) => {
              const isSelected = (currentClass?.classId === c.classId);
              return (
                <button
                  key={c.classId}
                  onClick={() => setSelectedClassId(c.classId)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-icms-academic-blue/5 border-icms-academic-blue text-icms-navy shadow-sm ring-1 ring-icms-academic-blue/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {c.courseCode}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{c.credits} SKS</span>
                  </div>
                  <div className="font-semibold text-sm line-clamp-1">{c.courseName}</div>
                  <div className="text-xs text-slate-500 flex items-center justify-between mt-1">
                    <span>{c.lecturerName || 'Dosen Pengampu'}</span>
                    <span className="font-medium text-slate-600">{c.className}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Class Workspace */}
        <div className="lg:col-span-3 space-y-5">
          {currentClass ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                      {currentClass.courseCode}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Kelas: {currentClass.className}</span>
                  </div>
                  <h2 className="text-xl font-bold text-icms-navy">{currentClass.courseName}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pengampu: <span className="font-semibold text-slate-700">{currentClass.lecturerName || 'Dr. Dosen, M.Kom.'}</span> • Beban: {currentClass.credits} SKS
                  </p>
                </div>

                {/* Tab Pill Buttons */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveTab('materials')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      activeTab === 'materials'
                        ? 'bg-white text-icms-navy shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Materi ({currentClass.materials?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('assignments')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      activeTab === 'assignments'
                        ? 'bg-white text-icms-navy shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Tugas & Evaluasi ({currentClass.assignments?.length || 0})
                  </button>
                </div>
              </div>

              {/* TAB 1: MATERIALS */}
              {activeTab === 'materials' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-800">Daftar Modul & Bahan Ajar Digital</h4>
                    <span className="text-xs text-slate-400">Total {currentClass.materials?.length || 0} Berkas</span>
                  </div>

                  {(!currentClass.materials || currentClass.materials.length === 0) ? (
                    <div className="p-8 text-center rounded-xl border border-dashed border-slate-200">
                      <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-600">Belum ada materi perkuliahan</p>
                      <p className="text-xs text-slate-400">Dosen pengampu belum mengunggah silabus atau berkas ajar.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {currentClass.materials.map((mat: any, idx: number) => (
                        <div
                          key={mat.id || idx}
                          className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all bg-white flex flex-col justify-between gap-3 group"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2.5 rounded-lg shrink-0 ${
                              mat.fileType === 'PDF' 
                                ? 'bg-red-50 text-red-600 border border-red-200'
                                : 'bg-amber-50 text-amber-600 border border-amber-200'
                            }`}>
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-slate-100 text-slate-600">
                                {mat.fileType} • {((mat.fileSize || 1024 * 1024) / (1024 * 1024)).toFixed(1)} MB
                              </span>
                              <h5 className="font-bold text-sm text-slate-800 mt-1 line-clamp-1 group-hover:text-icms-academic-blue transition-colors">
                                {mat.title}
                              </h5>
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                {mat.description || 'Bahan ajar materi perkuliahan terstruktur.'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="text-[11px] text-slate-400">Urutan ke-{mat.order || idx + 1}</span>
                            <a
                              href={mat.fileUrl || '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-icms-academic-blue hover:text-blue-700 bg-blue-50/60 hover:bg-blue-100/60 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" /> Unduh Dokumen
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ASSIGNMENTS */}
              {activeTab === 'assignments' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-800">Tugas Perkuliahan & Pengumpulan Digital</h4>
                    <span className="text-xs text-slate-400">Total {currentClass.assignments?.length || 0} Tugas</span>
                  </div>

                  {(!currentClass.assignments || currentClass.assignments.length === 0) ? (
                    <div className="p-8 text-center rounded-xl border border-dashed border-slate-200">
                      <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-600">Belum ada penugasan aktif</p>
                      <p className="text-xs text-slate-400">Semua tugas perkuliahan telah selesai atau belum diterbitkan.</p>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {currentClass.assignments.map((asg: any) => {
                        const dueDate = new Date(asg.dueDate);
                        const isOverdue = dueDate < new Date();
                        const sub = asg.submission || (asg.submissions && asg.submissions[0]);

                        return (
                          <div
                            key={asg.id}
                            className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div className="space-y-2 max-w-2xl">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                                  asg.isSubmitted || (sub && sub.score !== null)
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : isOverdue 
                                      ? 'bg-red-50 text-red-700 border border-red-200'
                                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  <Clock className="w-3 h-3" />
                                  Tenggat: {dueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                                <span className="text-xs font-semibold text-slate-500">Maks. {asg.maxScore} Poin</span>
                              </div>

                              <h5 className="font-bold text-base text-slate-900">{asg.title}</h5>
                              <p className="text-xs text-slate-600 leading-relaxed">{asg.description}</p>

                              {/* Student feedback display */}
                              {sub && sub.score !== null && (
                                <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-start gap-2.5">
                                  <Award className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                  <div className="text-xs">
                                    <span className="font-bold text-emerald-900">
                                      Nilai Diperoleh: {sub.score} / {asg.maxScore}
                                    </span>
                                    {sub.feedback && (
                                      <p className="text-emerald-800 mt-0.5 font-medium">
                                        Catatan Dosen: "{sub.feedback}"
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row md:flex-col items-end gap-2 shrink-0">
                              {isStudent ? (
                                asg.isSubmitted ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                                      <CheckCircle2 className="w-4 h-4" /> Terkumpul
                                    </span>
                                    <button
                                      onClick={() => {
                                        setSelectedAssignment(asg);
                                        setFileUrlInput(asg.submission?.fileUrl || '');
                                        setIsSubmitModalOpen(true);
                                      }}
                                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
                                    >
                                      Revisi File
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setSelectedAssignment(asg);
                                      setFileUrlInput('');
                                      setIsSubmitModalOpen(true);
                                    }}
                                    className="px-4 py-2 rounded-xl text-xs font-bold bg-icms-academic-blue hover:bg-blue-700 text-white shadow-xs transition-all flex items-center gap-1.5"
                                  >
                                    <UploadCloud className="w-4 h-4" /> Kumpulkan Tugas
                                  </button>
                                )
                              ) : (
                                /* Lecturer view */
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-500 font-medium">
                                    {asg.submissionCount || (asg.submissions?.length || 0)} Berkas Dikumpulkan
                                  </span>
                                  {asg.submissions && asg.submissions.length > 0 && (
                                    <button
                                      onClick={() => {
                                        setSelectedSubmission(asg.submissions[0]);
                                        setGradeInput(asg.submissions[0].score || 90);
                                        setFeedbackInput(asg.submissions[0].feedback || 'Bagus dan terstruktur.');
                                        setIsGradeModalOpen(true);
                                      }}
                                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1"
                                    >
                                      <Award className="w-3.5 h-3.5" /> Beri Nilai
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">Pilih Kelas Perkuliahan</h3>
              <p className="text-xs text-slate-500 mt-1">Pilih salah satu kelas di bilah sisi kiri untuk membuka materi dan tugas.</p>
            </div>
          )}
        </div>
      </div>

      {/* STUDENT SUBMISSION MODAL */}
      {isSubmitModalOpen && selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Pengumpulan Berkas Tugas</h3>
              <button 
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitTask} className="mt-4 space-y-4">
              <div>
                <span className="text-xs text-slate-500 block mb-1">Judul Tugas</span>
                <p className="text-sm font-bold text-slate-800">{selectedAssignment.title}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  URL / Tautan Berkas Tugas (Google Drive / GitHub / PDF Cloud)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/... atau https://cdn.icms.ac.id/..."
                  value={fileUrlInput}
                  onChange={(e) => setFileUrlInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-icms-academic-blue"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Pastikan tautan dapat diakses publik atau dosen pengampu untuk evaluasi penilaian.
                </p>
              </div>

              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200/60 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-icms-academic-blue shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900">
                  Dengan mengumpulkan berkas ini, Anda menyatakan bahwa karya ini adalah orisinal dan mematuhi kode etik akademik universitas.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="px-5 py-2 text-xs font-bold bg-icms-academic-blue hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {submitMutation.isPending ? 'Mengunggah...' : 'Konfirmasi Kumpulkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LECTURER GRADING MODAL */}
      {isGradeModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Evaluasi & Penilaian Tugas Mahasiswa</h3>
              <button 
                onClick={() => setIsGradeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGradeTask} className="mt-4 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="text-xs text-slate-500">Mahasiswa Pengumpul:</div>
                <div className="text-sm font-bold text-slate-800">
                  {selectedSubmission.studentName} ({selectedSubmission.studentNim})
                </div>
                <div className="pt-1">
                  <a
                    href={selectedSubmission.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-icms-academic-blue hover:underline inline-flex items-center gap-1"
                  >
                    Buka Berkas Tugas Mahasiswa <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nilai Angka (0 - 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={gradeInput}
                  onChange={(e) => setGradeInput(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Umpan Balik / Catatan Dosen (Feedback)
                </label>
                <textarea
                  rows={3}
                  placeholder="Berikan catatan evaluasi kualitas kode, argumen, atau perbaikan..."
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsGradeModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={gradeMutation.isPending}
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {gradeMutation.isPending ? 'Menyimpan...' : 'Terbitkan Nilai'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
