import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '@icms/shared';
import {
  X,
  QrCode,
  Search,
  FileText,
  CreditCard,
  Palette,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Users,
} from 'lucide-react';

interface MobileQuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  onOpenTheme: () => void;
}

export const MobileQuickActionsModal: React.FC<MobileQuickActionsModalProps> = ({
  isOpen,
  onClose,
  onOpenSearch,
  onOpenTheme,
}) => {
  const { activeRole } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleAction = (path?: string, customFn?: () => void) => {
    onClose();
    if (customFn) {
      customFn();
    } else if (path) {
      navigate(path);
    }
  };

  const actions = [
    {
      id: 'search',
      title: 'Pencarian Cepat (Command Palette)',
      desc: 'Cari modul, mahasiswa, dosen, matkul',
      icon: Search,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      fn: onOpenSearch,
    },
    {
      id: 'presence',
      title: activeRole === UserRole.STUDENT ? 'Check-in Presensi Kuliah' : 'Presensi QR Kelas',
      desc: activeRole === UserRole.STUDENT ? 'Presensi kehadiran matkul hari ini' : 'Buka QR Code presensi mahasiswa',
      icon: QrCode,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      path: activeRole === UserRole.STUDENT ? '/' : '/dosen/presensi',
    },
    {
      id: 'krs',
      title: activeRole === UserRole.STUDENT ? 'Kartu Rencana Studi (KRS)' : 'Persetujuan KRS Mahasiswa',
      desc: activeRole === UserRole.STUDENT ? 'Lihat mata kuliah & status approval KRS' : 'Validasi rencana studi mahasiswa PA',
      icon: GraduationCap,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      path: '/akademik/krs',
    },
    {
      id: 'letter',
      title: 'Layanan Surat Akademik',
      desc: 'Ajukan atau verifikasi surat aktif/rekomendasi',
      icon: FileText,
      color: 'bg-sky-50 text-sky-600 border-sky-200',
      path: '/akademik/surat',
    },
    {
      id: 'finance',
      title: activeRole === UserRole.STUDENT ? 'Bayar Tagihan UKT' : 'Manajemen Transaksi Kasir',
      desc: 'Simulasi gateway pembayaran digital & kasir',
      icon: CreditCard,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      path: '/keuangan/ukt',
    },
    {
      id: 'theme',
      title: 'Kustomisasi Warna & Branding',
      desc: 'Ubah tema institusi & logo universitas',
      icon: Palette,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      fn: onOpenTheme,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sheet Container */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl p-5 sm:p-6 z-10 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-6 duration-250">
        {/* Handle Pill for Mobile */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-icms-navy font-heading">
                Pusat Tindakan Cepat
              </h3>
              <p className="text-[11px] text-slate-500">
                Pintasan instan fitur utama untuk peran {activeRole}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                type="button"
                onClick={() => handleAction(act.path, act.fn)}
                className="w-full text-left p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 bg-white transition-all flex items-start gap-3 group shadow-2xs active:scale-[0.98]"
              >
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${act.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 flex items-center justify-between">
                    <span className="truncate">{act.title}</span>
                    <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-600 shrink-0 ml-1" />
                  </div>
                  <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {act.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* System Info Pill */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Sistem Real-Time Online</span>
          </div>
          <span className="font-mono text-[10px]">ICMS Mobile Suite</span>
        </div>
      </div>
    </div>
  );
};

