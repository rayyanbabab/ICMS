import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '@icms/shared';
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
  Calendar,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

export const AdministrationLettersPage: React.FC = () => {
  const { user, activeRole } = useAuth();
  const queryClient = useQueryClient();
  const isBaakOrAdmin = [UserRole.ACADEMIC_ADMIN, UserRole.SUPER_ADMIN].includes(activeRole);

  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');
  const [selectedLetter, setSelectedLetter] = useState<any>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Form input state
  const [letterType, setLetterType] = useState('AKTIF_KULIAH');
  const [purposeInput, setPurposeInput] = useState('');

  const { data: adminLettersData, isLoading, refetch } = useQuery({
    queryKey: ['administration-letters', activeRole],
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

  const approveMutation = useMutation({
    mutationFn: async ({ letterId, isApproved }: { letterId: string; isApproved: boolean }) => {
      const res = await api.post(`/academic/letters/${letterId}/approve`, { isApproved });
      return res.data;
    },
    onSuccess: () => {
      refetch();
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

  const pendingCount = letters.filter((l) => l.status === 'PENDING').length;
  const displayedLetters = activeTab === 'pending' ? letters.filter((l) => l.status === 'PENDING') : letters;

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
            {isBaakOrAdmin ? 'Loket Verifikasi & Pengesahan Surat BAAK' : 'Layanan Surat Keterangan Mahasiswa'}
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            {isBaakOrAdmin
              ? 'Verifikasi permohonan surat mahasiswa, pengesahan tanda tangan elektronik, dan penerbitan nomor SK resmi.'
              : 'Pengajuan dan penerbitan surat keterangan aktif kuliah, izin riset tugas akhir, dan rekomendasi magang ber-barcode digital terverifikasi.'}
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
          title="Total Surat Terdaftar"
          value={letters.length}
          subtitle="Arsip Dokumen Resmi"
          icon={FileText}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Menunggu Verifikasi"
          value={pendingCount}
          subtitle="Antrean Loket BAAK"
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
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
          title="Keabsahan Dokumen"
          value="Terdaftar Resmi"
          subtitle="Biro Akademik UIM"
          icon={ShieldCheck}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Tab Filter for BAAK / Admin */}
      {isBaakOrAdmin && (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-icms-academic-blue text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Semua Surat ({letters.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Perlu Pengesahan BAAK</span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-white text-amber-700 font-extrabold">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Letters List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-icms-navy">
              {isBaakOrAdmin ? 'Daftar Seluruh Permohonan Surat Masuk' : 'Daftar Dokumen Surat Resmi Anda'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Dokumen surat yang telah disahkan dapat diunduh dan dicetak ber-barcode resmi.</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {displayedLetters.length} Dokumen
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {displayedLetters.map((ltr) => {
            const isApproved = ltr.status === 'APPROVED';
            return (
              <div key={ltr.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      No: {ltr.letterNumber}
                    </span>
                    {isApproved ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> DISETUJUI BAAK
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> MENUNGGU VERIFIKASI BAAK
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-base text-slate-900">{ltr.title}</h4>
                  <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                    <span>Pemohon: <strong className="text-slate-800">{ltr.studentName}</strong> ({ltr.studentNim})</span>
                    <span>Prodi: <strong className="text-slate-800">{ltr.studyProgram}</strong></span>
                    <span>Peruntukan: <strong className="text-slate-800">{ltr.purpose}</strong></span>
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-4 pt-1">
                    <span>Diajukan: {ltr.requestDate}</span>
                    {ltr.approvedDate && <span>Disahkan: {ltr.approvedDate}</span>}
                    {ltr.signedBy && <span>Penandatangan: {ltr.signedBy}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* BAAK Approval Actions */}
                  {isBaakOrAdmin && !isApproved && (
                    <button
                      onClick={() => approveMutation.mutate({ letterId: ltr.id, isApproved: true })}
                      className="px-3 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" /> Sahkan Surat
                    </button>
                  )}

                  {isApproved && (
                    <button
                      onClick={() => {
                        setSelectedLetter(ltr);
                        setIsPreviewModalOpen(true);
                      }}
                      className="px-4 py-2 text-xs font-bold bg-icms-academic-blue hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
                    >
                      <Printer className="w-3.5 h-3.5" /> Cetak Kop Surat
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {displayedLetters.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              Tidak ada dokumen surat pada kategori ini.
            </div>
          )}
        </div>
      </div>

      {/* New Letter Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-icms-navy">Formulir Permohonan Surat Mahasiswa</h3>
              <button onClick={() => setIsRequestModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Dokumen Surat</label>
                <select
                  value={letterType}
                  onChange={(e) => setLetterType(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-icms-academic-blue"
                >
                  <option value="AKTIF_KULIAH">Surat Keterangan Aktif Kuliah (SK-AK)</option>
                  <option value="PENGANTAR_RISET">Surat Pengantar Riset & Skripsi</option>
                  <option value="REKOMENDASI_MAGANG">Surat Rekomendasi Magang MBKM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tujuan / Keperluan Surat</label>
                <textarea
                  value={purposeInput}
                  onChange={(e) => setPurposeInput(e.target.value)}
                  placeholder="Contoh: Pengajuan Tunjangan Gaji Orang Tua (PNS), Persyaratan Beasiswa, Izin Penelitian di Lembaga..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-icms-academic-blue"
                  required
                />
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-[11px] text-blue-900 space-y-1">
                <p className="font-bold">Verifikasi Identitas Mahasiswa:</p>
                <p>Nama: {student?.name || 'Ahmad Fauzi'} • NIM: {student?.nim || '202601001'}</p>
                <p>Status: Mahasiswa Aktif Semester 1 (Ganjil 2026/2027)</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={requestMutation.isPending}
                  className="px-4 py-2 text-xs font-bold bg-icms-academic-blue hover:bg-blue-700 text-white rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Ajukan ke Loket BAAK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Letter Preview & Print Modal */}
      {isPreviewModalOpen && selectedLetter && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 space-y-6 text-slate-800">
            {/* Kop Surat Resmi */}
            <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1 relative">
              <div className="text-xs font-bold tracking-widest text-slate-500 uppercase">KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI</div>
              <h2 className="text-lg font-black text-icms-navy uppercase tracking-wider">UNIVERSITAS INDONESIA MANDIRI</h2>
              <p className="text-[11px] text-slate-600">Jl. Jenderal Sudirman Kav. 52-53, Jakarta Selatan • Telp: (021) 5892-0001 • info@icms.ac.id</p>
            </div>

            {/* Nomor & Judul */}
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base underline uppercase tracking-wide">{selectedLetter.title}</h3>
              <p className="text-xs font-mono font-medium text-slate-600">Nomor: {selectedLetter.letterNumber}</p>
            </div>

            {/* Isi Surat */}
            <div className="text-xs leading-relaxed space-y-3 text-justify">
              <p>Yang bertanda tangan di bawah ini, Kepala Biro Administrasi Akademik dan Kemahasiswaan (BAAK) Universitas Indonesia Mandiri, dengan ini menerangkan bahwa:</p>
              
              <div className="pl-6 space-y-1 font-medium">
                <div className="grid grid-cols-3"><span>Nama Mahasiswa</span><span className="col-span-2">: <strong>{selectedLetter.studentName}</strong></span></div>
                <div className="grid grid-cols-3"><span>Nomor Induk Mahasiswa (NIM)</span><span className="col-span-2 font-mono">: {selectedLetter.studentNim}</span></div>
                <div className="grid grid-cols-3"><span>Program Studi</span><span className="col-span-2">: {selectedLetter.studyProgram}</span></div>
                <div className="grid grid-cols-3"><span>Fakultas</span><span className="col-span-2">: {selectedLetter.faculty}</span></div>
                <div className="grid grid-cols-3"><span>Semester / Status</span><span className="col-span-2">: Semester Ganjil 2026/2027 (Aktif)</span></div>
              </div>

              <p>
                Adalah benar-benar mahasiswa terdaftar aktif pada Tahun Akademik 2026/2027 pada Universitas Indonesia Mandiri. Surat keterangan ini diterbitkan secara sah untuk keperluan: <strong>{selectedLetter.purpose}</strong>.
              </p>

              <p>Demikian surat keterangan ini dibuat dengan sebenar-benarnya untuk dipergunakan sebagaimana mestinya.</p>
            </div>

            {/* Tanda Tangan & QR */}
            <div className="flex items-end justify-between pt-4 border-t border-slate-100">
              <div className="text-center space-y-1">
                <div className="w-20 h-20 bg-slate-50 border border-slate-300 rounded-lg flex items-center justify-center p-1">
                  <QrCode className="w-16 h-16 text-slate-800" />
                </div>
                <span className="text-[9px] font-mono block text-slate-400">{selectedLetter.verificationCode}</span>
                <span className="text-[9px] font-bold text-emerald-600 block">TTE Sah Terverifikasi</span>
              </div>

              <div className="text-right text-xs space-y-1">
                <p>Jakarta, {selectedLetter.approvedDate || selectedLetter.requestDate}</p>
                <p className="font-medium text-slate-500">Kepala Biro Administrasi Akademik (BAAK)</p>
                <div className="h-12 flex items-center justify-end">
                  <span className="font-serif italic font-bold text-blue-900 border-b border-blue-900 pb-0.5">Dr. Hendra Wijaya, M.Pd.</span>
                </div>
                <p className="font-mono text-[10px] text-slate-400">NIP. 19750819 200212 1 003</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-bold bg-icms-academic-blue hover:bg-blue-700 text-white rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Cetak Dokumen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
