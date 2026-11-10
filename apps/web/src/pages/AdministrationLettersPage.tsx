import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { StatCard } from '../components/ui/StatCard';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  Clock, 
  Download, 
  Printer, 
  Sparkles, 
  Plus, 
  QrCode, 
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';

export const AdministrationLettersPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedLetter, setSelectedLetter] = useState<any>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Form input state
  const [letterType, setLetterType] = useState('AKTIF_KULIAH');
  const [purposeInput, setPurposeInput] = useState('');

  const { data: adminLettersData, isLoading, refetch } = useQuery({
    queryKey: ['administration-letters'],
    queryFn: async () => {
      const res = await api.get('/academic/letters');
      return res.data;
    },
  });

  const requestMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/academic/letters/request', data);
      return res.data;
    },
    onSuccess: (newLetter) => {
      setIsRequestModalOpen(false);
      setPurposeInput('');
      refetch();
      setSelectedLetter(newLetter);
      setIsPreviewModalOpen(true);
    },
  });

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestMutation.mutate({
      type: letterType,
      purpose: purposeInput,
    });
  };

  const letters: any[] = adminLettersData?.letters || [];
  const student = adminLettersData?.student;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Layanan Administrasi Mandiri Digital
            </span>
            <span className="text-xs text-slate-300 font-medium">Biro Administrasi Akademik & Kemahasiswaan (BAAK)</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Layanan Surat Keterangan Mahasiswa
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Pengajuan dan penerbitan surat keterangan aktif kuliah, izin riset tugas akhir, dan rekomendasi magang ber-barcode digital terverifikasi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="px-4 py-2.5 text-xs font-bold bg-white text-icms-navy hover:bg-slate-100 rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Ajukan Surat Baru
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Surat Terbit"
          value={letters.length}
          subtitle="Arsip Dokumen Resmi"
          icon={FileText}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Verifikasi Digital"
          value="QR Code Sah"
          subtitle="Tanda Tangan Elektronik"
          icon={QrCode}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Waktu Penerbitan"
          value="Instan (< 1 Mnt)"
          subtitle="Validasi Status Mahasiswa"
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Keabsahan Dokumen"
          value="Terdaftar Resmi"
          subtitle="Biro Akademik UIM"
          icon={ShieldCheck}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Letters List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-icms-navy">Daftar Dokumen Surat Resmi Anda</h3>
            <p className="text-xs text-slate-500 mt-0.5">Dokumen surat yang telah disetujui dapat diunduh dan dicetak kapan saja.</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {letters.length} Dokumen
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {letters.map((ltr) => (
            <div key={ltr.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    No: {ltr.letterNumber}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> DISETUJUI BAAK
                  </span>
                </div>

                <h4 className="font-bold text-base text-slate-900">{ltr.title}</h4>
                <p className="text-xs text-slate-600">Peruntukan: <strong className="text-slate-800">{ltr.purpose}</strong></p>

                <div className="text-xs text-slate-400 flex items-center gap-4 pt-1">
                  <span>Diajukan: {ltr.requestDate}</span>
                  <span>Disahkan: {ltr.approvedDate}</span>
                  <span>Penandatangan: {ltr.signedBy}</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedLetter(ltr);
                    setIsPreviewModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-icms-academic-blue hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Buka & Cetak Surat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REQUEST MODAL */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Pengajuan Surat Keterangan Digital</h3>
              <button 
                onClick={() => setIsRequestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Jenis Surat</label>
                <select
                  value={letterType}
                  onChange={(e) => setLetterType(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-icms-academic-blue"
                >
                  <option value="AKTIF_KULIAH">Surat Keterangan Mahasiswa Aktif Kuliah</option>
                  <option value="PENGANTAR_RISET">Surat Pengantar Riset & Skripsi Lapangan</option>
                  <option value="REKOMENDASI_MAGANG">Surat Rekomendasi Magang MBKM Industri</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Keperluan / Instansi Tujuan</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Contoh: Pengajuan Beasiswa Pendidikan / Tunjangan Gaji Orang Tua ke PT PLN Persero..."
                  value={purposeInput}
                  onChange={(e) => setPurposeInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-icms-academic-blue"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Penerbitan Otomatis Terverifikasi
                </div>
                <p>
                  Sistem ICMS memvalidasi status registrasi semester aktif Anda secara real-time dan langsung menerbitkan dokumen resmi ber-barcode verifikasi BAAK.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={requestMutation.isPending}
                  className="px-5 py-2 text-xs font-bold bg-icms-academic-blue hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {requestMutation.isPending ? 'Memproses...' : 'Ajukan & Terbitkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFICIAL LETTER PRINT PREVIEW MODAL */}
      {isPreviewModalOpen && selectedLetter && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 my-8 space-y-6">
            {/* Action Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preview Dokumen Resmi BAAK</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-bold bg-icms-academic-blue hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Cetak / Unduh PDF
                </button>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold p-1 text-base"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Official Letter Document Canvas */}
            <div className="border border-slate-300 p-8 rounded-xl bg-white shadow-inner space-y-6 font-serif">
              {/* Kop Surat */}
              <div className="text-center border-b-2 border-black pb-4 space-y-1">
                <h2 className="text-xl font-bold font-heading text-slate-950 tracking-wider">UNIVERSITAS INDONESIA MANDIRI</h2>
                <h3 className="text-sm font-semibold tracking-wide text-slate-800">BIRO ADMINISTRASI AKADEMIK & KEMAHASISWAAN (BAAK)</h3>
                <p className="text-[11px] text-slate-600 font-sans">
                  Jl. M.H. Thamrin No. 88, Menteng, Jakarta Pusat 10350 • Telp: (021) 390-1234 • Email: baak@icms.ac.id
                </p>
              </div>

              {/* Letter Heading */}
              <div className="text-center space-y-1">
                <h4 className="text-base font-bold underline uppercase tracking-wide">
                  {selectedLetter.title}
                </h4>
                <p className="text-xs font-sans text-slate-600 font-mono">Nomor: {selectedLetter.letterNumber}</p>
              </div>

              {/* Body Content */}
              <div className="text-xs text-slate-800 space-y-3 leading-relaxed font-sans">
                <p>
                  Yang bertanda tangan di bawah ini, Kepala Biro Administrasi Akademik & Kemahasiswaan (BAAK) Universitas Indonesia Mandiri menerangkan dengan sesungguhnya bahwa:
                </p>

                <div className="pl-6 space-y-1.5 py-1 font-sans">
                  <div className="flex"><span className="w-36 font-semibold">Nama Lengkap</span>: <span>{selectedLetter.studentName}</span></div>
                  <div className="flex"><span className="w-36 font-semibold">NIM</span>: <span>{selectedLetter.studentNim}</span></div>
                  <div className="flex"><span className="w-36 font-semibold">Program Studi</span>: <span>{selectedLetter.studyProgram}</span></div>
                  <div className="flex"><span className="w-36 font-semibold">Fakultas</span>: <span>{selectedLetter.faculty}</span></div>
                  <div className="flex"><span className="w-36 font-semibold">Status Akademik</span>: <span className="font-bold text-emerald-700">AKTIF (Semester Ganjil 2026/2027)</span></div>
                </div>

                <p>
                  Adalah benar yang bersangkutan merupakan mahasiswa aktif Universitas Indonesia Mandiri Tahun Akademik 2026/2027. Surat keterangan ini diterbitkan untuk dipergunakan sebagai: <strong>{selectedLetter.purpose}</strong>.
                </p>

                <p>
                  Demikian surat keterangan ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya.
                </p>
              </div>

              {/* Tanda Tangan & QR Code Verifikasi */}
              <div className="pt-6 flex justify-between items-end font-sans">
                <div className="text-center space-y-1">
                  <div className="w-20 h-20 bg-slate-100 border border-slate-300 rounded-lg flex flex-col items-center justify-center mx-auto p-1">
                    <QrCode className="w-12 h-12 text-slate-800" />
                    <span className="text-[8px] font-mono text-slate-500">KODE SAH</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">{selectedLetter.verificationCode}</span>
                </div>

                <div className="text-right text-xs space-y-1">
                  <p>Jakarta, {new Date(selectedLetter.approvedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="font-semibold text-slate-600">Kepala BAAK UIM,</p>
                  <div className="h-14 flex items-center justify-end">
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      [Tanda Tangan Elektronik Sah]
                    </span>
                  </div>
                  <p className="font-bold underline text-slate-900">{selectedLetter.signedBy}</p>
                  <p className="text-[10px] text-slate-500">NIP. 19780412 200312 1 002</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

