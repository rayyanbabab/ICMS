import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { StatusBadge } from '../components/ui/StatusBadge';
import { UserRole } from '@icms/shared';
import {
  FileCheck2,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Check,
  X,
  Send,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface Offering {
  id: string;
  course: {
    id: string;
    code: string;
    name: string;
    credits: number;
    semester: number;
    type: string;
  };
  classes: Array<{
    id: string;
    name: string;
    capacity: number;
    enrolledCount: number;
    lecturer?: { user: { fullName: string } };
    schedules: Array<{
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      classroom: { name: string; code: string };
    }>;
  }>;
}

interface KrsData {
  student: {
    nim: string;
    studyProgram: { name: string };
    advisor?: { user: { fullName: string } };
  };
  semester: {
    name: string;
    code: string;
  };
  registration?: {
    id: string;
    status: string;
    totalCredits: number;
    maxCredits: number;
    rejectionNote?: string;
    details: Array<{
      classId: string;
      class: {
        id: string;
        name: string;
        offering: { course: { code: string; name: string; credits: number } };
        lecturer?: { user: { fullName: string } };
      };
    }>;
  };
}

export const KrsPage: React.FC = () => {
  const { user, activeRole } = useAuth();
  const isStudent = activeRole === UserRole.STUDENT;

  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [krsData, setKrsData] = useState<KrsData | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [offeringRes, krsRes, subRes] = await Promise.all([
        apiRequest<Offering[]>('/academic/offerings').catch(() => null),
        apiRequest<KrsData>('/academic/krs/student').catch(() => null),
        apiRequest<any[]>('/academic/krs/submissions').catch(() => null),
      ]);

      if (offeringRes?.data) setOfferings(offeringRes.data);
      if (krsRes?.data) {
        setKrsData(krsRes.data);
        if (krsRes.data.registration?.details) {
          setSelectedClasses(krsRes.data.registration.details.map((d) => d.classId));
        }
      }
      if (subRes?.data) {
        setSubmissions(subRes.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, activeRole]);

  const toggleClass = (classId: string) => {
    if (selectedClasses.includes(classId)) {
      setSelectedClasses(selectedClasses.filter((id) => id !== classId));
    } else {
      setSelectedClasses([...selectedClasses, classId]);
    }
  };

  const selectedSks = offerings.reduce((sum, off) => {
    const matchedClass = off.classes.find((c) => selectedClasses.includes(c.id));
    return matchedClass ? sum + off.course.credits : sum;
  }, 0);

  const handleEnrollSubmit = async () => {
    if (selectedClasses.length === 0) {
      alert('Pilih minimal satu mata kuliah untuk mengisi KRS.');
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest('/academic/krs/enroll', {
        method: 'POST',
        body: JSON.stringify({ classIds: selectedClasses }),
      });
      setFeedback('KRS berhasil diajukan ke Dosen Pembimbing Akademik!');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Gagal mengajukan KRS');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (regId: string, isApproved: boolean) => {
    try {
      await apiRequest(`/academic/krs/${regId}/approve`, {
        method: 'POST',
        body: JSON.stringify({ isApproved }),
      });
      setFeedback(isApproved ? 'KRS Mahasiswa telah berhasil disetujui!' : 'KRS Mahasiswa telah ditolak.');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Gagal memproses persetujuan KRS');
    }
  };

  const status = krsData?.registration?.status || 'DRAFT';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-icms-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-icms-academic-blue text-[11px] font-bold uppercase tracking-wider border border-blue-200">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Kartu Rencana Studi (KRS) Online</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-icms-navy mt-1">
            {isStudent ? 'Pengisian KRS Mahasiswa' : 'Antrean Persetujuan KRS Mahasiswa Bimbingan'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isStudent
              ? 'Semester Ganjil 2026/2027 • Pemilihan mata kuliah & validasi batas beban SKS'
              : 'Verifikasi rencana studi mahasiswa bimbingan akademik Anda (Dosen PA / Kaprodi / BAAK)'}
          </p>
        </div>

        {isStudent && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Total SKS Dipilih</span>
              <span className="text-2xl font-black text-icms-academic-blue font-heading">
                {selectedSks} <span className="text-xs font-normal text-slate-400">/ 24 SKS</span>
              </span>
            </div>
            <button
              onClick={handleEnrollSubmit}
              disabled={submitting || status === 'APPROVED'}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-icms-academic-blue hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{status === 'APPROVED' ? 'KRS Disetujui' : 'Ajukan KRS ke Dosen PA'}</span>
            </button>
          </div>
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

      {/* Role-Specific View Switch */}
      {isStudent ? (
        /* =================== STUDENT VIEW =================== */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Class Offerings */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-icms-border shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-icms-navy">Daftar Mata Kuliah Tersedia (Paket Semester 1)</h2>
                <p className="text-xs text-slate-500 mt-0.5">Centang kelas yang ingin Anda ambil pada semester ini</p>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                {offerings.length} Mata Kuliah
              </span>
            </div>

            <div className="space-y-3">
              {offerings.map((off) => {
                const isSelected = off.classes.some((c) => selectedClasses.includes(c.id));
                const targetClass = off.classes[0];
                if (!targetClass) return null;

                return (
                  <div
                    key={off.id}
                    onClick={() => toggleClass(targetClass.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50/60 border-icms-academic-blue ring-1 ring-icms-academic-blue shadow-sm'
                        : 'bg-white border-icms-border hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isSelected
                            ? 'bg-icms-academic-blue border-icms-academic-blue text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-icms-academic-blue">
                            {off.course.code}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            Kelas {targetClass.name}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            {off.course.credits} SKS
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-icms-navy mt-0.5">{off.course.name}</h4>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                          <span>Dosen: {targetClass.lecturer?.user.fullName || 'Belum Ditentukan'}</span>
                          {targetClass.schedules[0] && (
                            <span>
                              Ruang: {targetClass.schedules[0].classroom.name} (
                              {targetClass.schedules[0].startTime} - {targetClass.schedules[0].endTime})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Kapasitas</span>
                      <span className="text-xs font-bold text-slate-700">
                        {targetClass.enrolledCount} / {targetClass.capacity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Registration Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-icms-border shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-icms-navy">Status KRS Anda</span>
                <StatusBadge status={status} />
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">NIM:</span>
                  <span className="font-bold text-icms-navy">{krsData?.student?.nim || '202601001'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Program Studi:</span>
                  <span className="font-bold text-icms-navy">
                    {krsData?.student?.studyProgram?.name || 'Teknik Informatika (S1)'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Dosen Pembimbing PA:</span>
                  <span className="font-bold text-icms-navy">
                    {krsData?.student?.advisor?.user.fullName || 'Dr. Ir. Budi Santoso, M.Kom.'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-t border-slate-100 pt-2">
                  <span className="text-slate-500">Batas Maksimum Beban:</span>
                  <span className="font-bold text-emerald-600">24 SKS</span>
                </div>
              </div>

              {status === 'SUBMITTED' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                  <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    KRS Anda sedang menunggu peninjauan dan persetujuan dari Dosen Pembimbing Akademik.
                  </span>
                </div>
              )}

              {status === 'APPROVED' && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span>
                    KRS telah disetujui resmi. Anda berhak mengikuti seluruh perkuliahan dan ujian semester ini.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* =================== LECTURER / ADMIN VIEW =================== */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-icms-border shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-icms-navy">
                Daftar Pengajuan KRS Mahasiswa Bimbingan
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Periksa kesesuaian mata kuliah dan batas SKS sebelum memberikan persetujuan resmi.
              </p>
            </div>
            <span className="text-xs font-bold text-icms-academic-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {submissions.length} Pengajuan Terdaftar
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-icms-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Mahasiswa</th>
                    <th className="py-3.5 px-4">Program Studi</th>
                    <th className="py-3.5 px-4 text-center">Beban SKS</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4">Waktu Pengajuan</th>
                    <th className="py-3.5 px-4 text-right">Aksi Persetujuan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub) => {
                    const isPending = sub.status === 'SUBMITTED';
                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-icms-navy">
                          <div>{sub.student.user.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{sub.student.nim}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {sub.student.studyProgram.name}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                          {sub.totalCredits} SKS
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <StatusBadge status={sub.status} />
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                          {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString('id-ID') : '-'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            {isPending ? (
                              <>
                                <button
                                  onClick={() => handleApprove(sub.id, true)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                                  title="Setujui KRS"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Setujui</span>
                                </button>
                                <button
                                  onClick={() => handleApprove(sub.id, false)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors"
                                  title="Tolak KRS"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Tolak</span>
                                </button>
                              </>
                            ) : sub.status === 'APPROVED' ? (
                              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                                Sudah Disetujui
                              </span>
                            ) : (
                              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                                Ditolak
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {submissions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Tidak ada pengajuan KRS yang menunggu persetujuan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
