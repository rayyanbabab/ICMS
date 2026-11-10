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
  const { user } = useAuth();
  const isStudent = user?.roles?.includes(UserRole.STUDENT);
  const isLecturerOrAdmin = user?.roles?.includes(UserRole.LECTURER) || user?.roles?.includes(UserRole.SUPER_ADMIN);

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
      const [offeringRes, krsRes] = await Promise.all([
        apiRequest<Offering[]>('/academic/offerings').catch(() => null),
        apiRequest<KrsData>('/academic/krs/student').catch(() => null),
      ]);

      if (offeringRes?.data) setOfferings(offeringRes.data);
      if (krsRes?.data) {
        setKrsData(krsRes.data);
        if (krsRes.data.registration?.details) {
          setSelectedClasses(krsRes.data.registration.details.map((d) => d.classId));
        }
      }

      if (isLecturerOrAdmin) {
        const subRes = await apiRequest<any[]>('/academic/krs/submissions').catch(() => null);
        if (subRes?.data) setSubmissions(subRes.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const toggleClass = (classId: string) => {
    if (selectedClasses.includes(classId)) {
      setSelectedClasses(selectedClasses.filter((id) => id !== classId));
    } else {
      setSelectedClasses([...selectedClasses, classId]);
    }
  };

  // Calculate selected SKS
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
            Pengisian & Persetujuan KRS
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Semester Ganjil 2026/2027 • Pemilihan mata kuliah & validasi batas beban SKS
          </p>
        </div>

        {/* Live SKS Counter Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shrink-0">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total SKS Dipilih
            </div>
            <div className="text-2xl font-extrabold text-icms-navy">
              {selectedSks} <span className="text-xs text-slate-500 font-normal">/ 24 SKS Max</span>
            </div>
          </div>
          <StatusBadge status={status} label={status === 'APPROVED' ? 'Disetujui' : status === 'SUBMITTED' ? 'Menunggu Approval' : 'Draft'} />
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Advisor View: Submitted KRS List */}
      {isLecturerOrAdmin && submissions.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-icms-navy font-heading flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" />
              Daftar Antrean Pengajuan KRS Mahasiswa Bimbingan
            </h3>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              {submissions.length} Pengajuan
            </span>
          </div>

          <div className="space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-icms-navy">{sub.student.user.fullName}</span>
                    <span className="font-mono text-xs text-slate-500">NIM: {sub.student.nim}</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {sub.student.studyProgram.name} • Total SKS: <strong>{sub.totalCredits} SKS</strong>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Mata Kuliah:{' '}
                    {sub.details.map((d: any) => `${d.class.offering.course.name} (${d.class.name})`).join(', ')}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={sub.status} />
                  {sub.status !== 'APPROVED' ? (
                    <button
                      onClick={() => handleApprove(sub.id, true)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-sm flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Setujui KRS
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Telah Disetujui
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Offerings Course Selection Table */}
      <div className="bg-white rounded-2xl border border-icms-border shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-icms-navy font-heading">
              Daftar Paket Kelas Kuliah yang Ditawarkan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Centang kelas perkuliahan yang ingin Anda ambil pada semester aktif ini.
            </p>
          </div>

          <button
            onClick={handleEnrollSubmit}
            disabled={submitting || status === 'APPROVED'}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-sm transition-all disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{status === 'APPROVED' ? 'KRS Telah Dikunci & Disetujui' : 'Ajukan KRS ke Dosen PA'}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 text-center w-12">Pilih</th>
                <th className="py-3 px-4">Kode MK</th>
                <th className="py-3 px-4">Nama Mata Kuliah</th>
                <th className="py-3 px-4 text-center">SKS</th>
                <th className="py-3 px-4">Kelas Paralel</th>
                <th className="py-3 px-4">Dosen Pengajar</th>
                <th className="py-3 px-4">Jadwal & Ruang</th>
                <th className="py-3 px-4 text-center">Kapasitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {offerings.map((offering) => {
                const targetClass = offering.classes[0];
                const isSelected = targetClass ? selectedClasses.includes(targetClass.id) : false;

                return (
                  <tr
                    key={offering.id}
                    className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-blue-50/40' : ''}`}
                  >
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={status === 'APPROVED'}
                        onChange={() => targetClass && toggleClass(targetClass.id)}
                        className="w-4 h-4 text-icms-academic-blue rounded focus:ring-icms-academic-blue cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-icms-academic-blue">
                      {offering.course.code}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      <div>{offering.course.name}</div>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Sem {offering.course.semester} • {offering.course.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-icms-navy">
                      {offering.course.credits} SKS
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] font-semibold text-slate-700">
                      {targetClass?.name || '-'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {targetClass?.lecturer?.user?.fullName || 'Tim Dosen FTI'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {targetClass?.schedules?.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Senin {s.startTime}-{s.endTime}</span>
                          <span className="text-slate-400">({s.classroom.code})</span>
                        </div>
                      )) || 'Jadwal Ditentukan'}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600 text-[11px]">
                      {targetClass?.enrolledCount || 1} / {targetClass?.capacity || 40}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

