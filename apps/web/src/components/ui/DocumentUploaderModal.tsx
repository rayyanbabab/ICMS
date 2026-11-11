import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Eye,
  FileCheck,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  category: string;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
}

interface DocumentUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  allowedTypes?: string[];
  maxSizeMB?: number;
  onUploadComplete?: (doc: UploadedDocument) => void;
}

export const DocumentUploaderModal: React.FC<DocumentUploaderModalProps> = ({
  isOpen,
  onClose,
  title = 'Unggah Berkas Akademik & Administrasi',
  allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'],
  maxSizeMB = 5,
  onUploadComplete,
}) => {
  if (!isOpen) return null;

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docCategory, setDocCategory] = useState<string>('IJAZAH_SKL');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([
    {
      id: 'doc-001',
      name: 'Ijazah_SMA_Legalisir.pdf',
      size: 2450000,
      type: 'application/pdf',
      uploadDate: '2026-09-01 10:15 WIB',
      category: 'Ijazah & SKL',
      status: 'VERIFIED',
    },
    {
      id: 'doc-002',
      name: 'KTP_Elektronik_Mahasiswa.pdf',
      size: 1120000,
      type: 'application/pdf',
      uploadDate: '2026-09-01 10:18 WIB',
      category: 'KTP / Identitas',
      status: 'VERIFIED',
    },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSelectFile = (file: File) => {
    setErrorMsg(null);
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(ext)) {
      setErrorMsg(`Format berkas tidak diizinkan. Gunakan format: ${allowedTypes.join(', ')}`);
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMsg(`Ukuran berkas melebihi batas maksimal ${maxSizeMB} MB`);
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const startUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            const newDoc: UploadedDocument = {
              id: 'doc-' + Date.now(),
              name: selectedFile.name,
              size: selectedFile.size,
              type: selectedFile.type,
              uploadDate: new Date().toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }) + ' WIB',
              category: getCategoryLabel(docCategory),
              status: 'PENDING',
            };
            setUploadedDocs((prevDocs) => [newDoc, ...prevDocs]);
            setSelectedFile(null);
            setUploadProgress(0);
            if (onUploadComplete) onUploadComplete(newDoc);
          }, 400);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'IJAZAH_SKL': return 'Ijazah & SKL';
      case 'KTP_KK': return 'KTP / Kartu Keluarga';
      case 'TRANSKRIP_ASAL': return 'Transkrip Nilai Asal';
      case 'SURAT_KESEHATAN': return 'Surat Bebas Narkoba / Kesehatan';
      case 'SERTIFIKAT_PRESTASI': return 'Sertifikat Prestasi & Portofolio';
      default: return 'Dokumen Pendukung';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    }
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{title}</h2>
              <p className="text-xs text-slate-500">
                Penyimpanan Berkas Terenkripsi Cloud Object Storage S3/GCS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Kategori Dokumen *
            </label>
            <select
              value={docCategory}
              onChange={(e) => setDocCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="IJAZAH_SKL">Ijazah & Surat Keterangan Lulus (SKL)</option>
              <option value="KTP_KK">Kartu Tanda Penduduk (KTP) / Kartu Keluarga</option>
              <option value="TRANSKRIP_ASAL">Transkrip Nilai Asal Sekolah / Kampus</option>
              <option value="SURAT_KESEHATAN">Surat Keterangan Bebas Narkoba / Sehat</option>
              <option value="SERTIFIKAT_PRESTASI">Sertifikat Prestasi, Portofolio & Kejuaraan</option>
            </select>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-50/50 scale-[1.01]'
                : selectedFile
                ? 'border-emerald-500 bg-emerald-50/20'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={allowedTypes.join(',')}
              onChange={handleFileInput}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-3">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                  selectedFile
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-blue-100 text-blue-600'
                }`}
              >
                {selectedFile ? (
                  <FileCheck className="w-7 h-7" />
                ) : (
                  <UploadCloud className="w-7 h-7" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {selectedFile ? selectedFile.name : 'Tarik & Letakkan Berkas di Sini'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedFile
                    ? `${formatFileSize(selectedFile.size)} • Siap untuk diunggah`
                    : `atau klik untuk memilih dari komputer (${allowedTypes.join(', ')} maks ${maxSizeMB} MB)`}
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  Mengunggah ke Cloud Storage Terenkripsi...
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Button for Selected File */}
          {selectedFile && !isUploading && (
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={startUpload}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                Mulai Unggah Berkas
              </button>
            </div>
          )}

          {/* List of Already Uploaded Documents */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Riwayat Berkas Tersimpan ({uploadedDocs.length})
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Validasi Digital Cloud
              </div>
            </div>

            <div className="space-y-2">
              {uploadedDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-white transition-all shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-blue-100/70 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {doc.name}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-medium text-slate-600">{doc.category}</span>
                        <span>•</span>
                        <span>{formatFileSize(doc.size)}</span>
                        <span>•</span>
                        <span>{doc.uploadDate}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {doc.status === 'VERIFIED' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Terverifikasi BAAK
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
                        Menunggu Verifikasi
                      </span>
                    )}
                    <button
                      title="Lihat Pratinjau Dokumen"
                      onClick={() => alert(`Pratinjau dokumen: ${doc.name}\nTersimpan aman di Cloud Storage.`)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Keamanan: Enkripsi AES-256 saat transit & diam</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

