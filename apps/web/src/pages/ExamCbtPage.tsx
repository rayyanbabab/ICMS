import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { StatCard } from '../components/ui/StatCard';
import { 
  FileCheck2, 
  Clock, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  Send,
  Timer
} from 'lucide-react';

export const ExamCbtPage: React.FC = () => {
  const { user } = useAuth();
  const [activeExam, setActiveExam] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(3600); // 60 mins
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [resultScore, setResultScore] = useState<any>(null);

  const { data: examsData, isLoading } = useQuery({
    queryKey: ['academic-exams'],
    queryFn: async () => {
      const res = await api.get('/academic/exams');
      return res.data;
    },
  });

  const submitExamMutation = useMutation({
    mutationFn: async ({ examId, answers }: { examId: string; answers: Record<string, number> }) => {
      const res = await api.post(`/academic/exams/${examId}/submit`, { answers });
      return res.data;
    },
    onSuccess: (data) => {
      setResultScore(data);
      setIsExamCompleted(true);
    },
  });

  // Countdown timer effect during exam
  useEffect(() => {
    if (!activeExam || isExamCompleted) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeExam, isExamCompleted, selectedAnswers]);

  const handleStartExam = (exam: any) => {
    setActiveExam(exam);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeLeftSeconds(exam.durationMin * 60 || 3600);
    setIsExamCompleted(false);
    setResultScore(null);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitExam = () => {
    if (!activeExam) return;
    submitExamMutation.mutate({
      examId: activeExam.id,
      answers: selectedAnswers,
    });
  };

  const formatTimer = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const exams: any[] = examsData?.exams || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Computer-Based Test (CBT) Engine 4.0
            </span>
            <span className="text-xs text-slate-300 font-medium">Ujian Daring Terpantau</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Ujian Online & Evaluasi Pembelajaran
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Sistem evaluasi akademik terkomputerisasi dengan pengacakan butir soal, penghitungan waktu real-time, dan penilaian otomatis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-right">
            <span className="text-xs text-slate-300 block">Status CBT Engine</span>
            <span className="text-sm font-bold text-emerald-400">Online & Terenkripsi</span>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Ujian Terjadwal"
          value={exams.length}
          subtitle="UTS & UAS Semester Ganjil"
          icon={FileCheck2}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Ujian Siap Dikerjakan"
          value={exams.filter((e) => e.status === 'AVAILABLE').length}
          subtitle="Jadwal Hari Ini"
          icon={Clock}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Durasi Standar"
          value="60 - 90 Mnt"
          subtitle="Timer Hitung Mundur"
          icon={Timer}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Sistem Penilaian"
          value="Otomatis"
          subtitle="Koreksi Nilai Instan"
          icon={Award}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* CBT ACTIVE EXAM SIMULATOR */}
      {activeExam && !isExamCompleted && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
          {/* CBT Top Bar */}
          <div className="bg-icms-navy text-white p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 font-mono uppercase">{activeExam.courseCode} • {activeExam.type}</span>
              <h3 className="font-bold text-base">{activeExam.title}</h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-red-500/20 text-red-300 border border-red-500/30 px-4 py-1.5 rounded-xl font-mono text-sm font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 animate-spin text-red-400" />
                <span>Sisa Waktu: {formatTimer(timeLeftSeconds)}</span>
              </div>
              <button
                onClick={handleSubmitExam}
                disabled={submitExamMutation.isPending}
                className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Selesaikan Ujian
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Question Workspace */}
            <div className="lg:col-span-3 space-y-6">
              {activeExam.questions && activeExam.questions.length > 0 ? (
                (() => {
                  const q = activeExam.questions[currentQuestionIndex];
                  const currentSelected = selectedAnswers[q.id];

                  return (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <span className="text-sm font-bold text-icms-academic-blue">
                          Soal Nomor {currentQuestionIndex + 1} dari {activeExam.questions.length}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">Bobot Soal: 20 Poin</span>
                      </div>

                      <div className="text-base font-semibold text-slate-800 leading-relaxed">
                        {q.text}
                      </div>

                      {/* Options */}
                      <div className="space-y-3">
                        {q.options.map((opt: string, optIdx: number) => {
                          const optionLetter = String.fromCharCode(65 + optIdx);
                          const isSelected = currentSelected === optIdx;

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectOption(q.id, optIdx)}
                              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3.5 ${
                                isSelected
                                  ? 'bg-blue-50/60 border-icms-academic-blue text-icms-navy shadow-xs ring-1 ring-icms-academic-blue/30'
                                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                                isSelected
                                  ? 'bg-icms-academic-blue text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {optionLetter}
                              </div>
                              <span className="text-sm font-medium">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Navigation buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <button
                          onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                          disabled={currentQuestionIndex === 0}
                          className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl transition-colors flex items-center gap-1.5"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" /> Soal Sebelumnya
                        </button>
                        <button
                          onClick={() => setCurrentQuestionIndex((prev) => Math.min(activeExam.questions.length - 1, prev + 1))}
                          disabled={currentQuestionIndex === activeExam.questions.length - 1}
                          className="px-4 py-2 text-xs font-bold text-white bg-icms-academic-blue hover:bg-blue-700 disabled:opacity-40 rounded-xl transition-colors flex items-center gap-1.5"
                        >
                          Soal Berikutnya <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="p-8 text-center text-slate-400">Tidak ada butir soal untuk ujian ini.</div>
              )}
            </div>

            {/* Question Navigation Drawer */}
            <div className="lg:col-span-1 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Nomor Soal</h4>
              <div className="grid grid-cols-5 gap-2">
                {activeExam.questions?.map((q: any, idx: number) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCurrent = currentQuestionIndex === idx;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-9 rounded-lg font-bold text-xs transition-all ${
                        isCurrent
                          ? 'ring-2 ring-icms-academic-blue bg-icms-academic-blue text-white'
                          : isAnswered
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-200 text-xs space-y-1.5 text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
                  <span>Sudah Terjawab</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-white border border-slate-200" />
                  <span>Belum Terjawab</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESULT MODAL AFTER COMPLETING EXAM */}
      {isExamCompleted && resultScore && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 font-heading">Ujian CBT Selesai Dikoreksi!</h3>
          <p className="text-xs text-slate-500">{resultScore.message}</p>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 my-4 space-y-3">
            <span className="text-xs text-slate-500 block">Nilai Ujian Anda</span>
            <div className="text-4xl font-extrabold text-icms-navy font-mono">
              {resultScore.score} <span className="text-base text-slate-400 font-normal">/ 100</span>
            </div>
            <div className="flex justify-center gap-6 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <span>Jawaban Benar: <strong className="text-emerald-600">{resultScore.correctCount}</strong></span>
              <span>Jawaban Salah: <strong className="text-red-500">{resultScore.wrongCount}</strong></span>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveExam(null);
              setIsExamCompleted(false);
              setResultScore(null);
            }}
            className="px-6 py-2.5 text-xs font-bold bg-icms-navy hover:bg-slate-800 text-white rounded-xl shadow-xs transition-colors"
          >
            Kembali ke Daftar Ujian
          </button>
        </div>
      )}

      {/* EXAMS LIST TABLE / CARDS */}
      {!activeExam && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-icms-navy">Daftar Jadwal Ujian Tengah Semester (UTS)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Silakan persiapkan diri dan klik tombol Mulai Ujian sesuai jadwal yang telah ditentukan.</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              {exams.length} Ujian
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {exams.map((exam) => {
              const isAvailable = exam.status === 'AVAILABLE';

              return (
                <div key={exam.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {exam.courseCode}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">{exam.type}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isAvailable 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {isAvailable ? 'SIAP DIKERJAKAN' : 'AGENDA MENDATANG'}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-slate-900">{exam.title}</h4>

                    <div className="text-xs text-slate-500 flex items-center gap-4">
                      <span>Waktu Mulai: <strong className="text-slate-700">{new Date(exam.startTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} pk 08:00 WIB</strong></span>
                      <span>Durasi: <strong className="text-slate-700">{exam.durationMin} Menit</strong></span>
                      <span>Jumlah Soal: <strong className="text-slate-700">{exam.totalQuestions} Butir Pilihan Ganda</strong></span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <button
                      onClick={() => handleStartExam(exam)}
                      disabled={!isAvailable}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-icms-academic-blue hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 shadow-xs transition-colors flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Mulai Ujian CBT
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
