import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket';
import {
  Bell,
  CheckCircle2,
  FileCheck2,
  Wallet,
  Clock,
  Megaphone,
  Check,
  X,
  ExternalLink,
  Sparkles,
  Wifi,
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'AKADEMIK' | 'KEUANGAN' | 'PRESENSI' | 'PENGUMUMAN';
  timestamp: string;
  isRead: boolean;
  link: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isConnected, incomingAlert, clearAlert } = useSocket();

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Surat Keterangan Disetujui BAAK',
      message: 'Surat Keterangan Mahasiswa Aktif Kuliah Anda telah disahkan dengan Nomor SK: 042/BAAK/UIM/X/2026.',
      category: 'AKADEMIK',
      timestamp: '5 menit yang lalu',
      isRead: false,
      link: '/operasional/administrasi',
    },
    {
      id: 'notif-2',
      title: 'Pembayaran UKT Terverifikasi Sah',
      message: 'Transaksi pelunasan UKT Rp 7.500.000 melalui Virtual Account telah masuk ke kas universitas.',
      category: 'KEUANGAN',
      timestamp: '25 menit yang lalu',
      isRead: false,
      link: '/operasional/keuangan',
    },
    {
      id: 'notif-3',
      title: 'Persetujuan KRS Dosen Pembimbing',
      message: 'Dosen Pembimbing Akademik Dr. Ir. Budi Santoso menyetujui beban studi 20 SKS Anda.',
      category: 'AKADEMIK',
      timestamp: '1 jam yang lalu',
      isRead: false,
      link: '/akademik/krs',
    },
    {
      id: 'notif-4',
      title: 'Sesi Presensi Perkuliahan Dibuka',
      message: 'Sesi presensi untuk kelas IF101 Algoritma & Pemrograman Lanjut telah dibuka dengan token QR.',
      category: 'PRESENSI',
      timestamp: '2 jam yang lalu',
      isRead: true,
      link: '/operasional/presensi',
    },
    {
      id: 'notif-5',
      title: 'Jadwal Pelaksanaan UTS CBT Ganjil',
      message: 'Ujian Tengah Semester TA 2026/2027 akan diselenggarakan mulai 15 November 2026 secara online CBT.',
      category: 'PENGUMUMAN',
      timestamp: 'Kemarin',
      isRead: true,
      link: '/operasional/ujian',
    },
  ]);

  useEffect(() => {
    if (incomingAlert) {
      setNotifications((prev) => [
        {
          id: incomingAlert.id || `alert-${Date.now()}`,
          title: incomingAlert.title,
          message: incomingAlert.message,
          category: incomingAlert.category || 'PENGUMUMAN',
          timestamp: 'Baru saja',
          isRead: false,
          link: incomingAlert.link || '/operasional/pengumuman',
        },
        ...prev,
      ]);
      clearAlert();
    }
  }, [incomingAlert, clearAlert]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleItemClick = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)),
    );
    navigate(item.link);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute right-0 top-12 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-icms-academic-blue" />
            <h3 className="font-bold text-xs text-icms-navy">Pusat Notifikasi</h3>
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              isConnected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
            }`}>
              <Wifi className="w-2.5 h-2.5" />
              <span>{isConnected ? 'Real-Time' : 'Online'}</span>
            </span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-600 text-white">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[11px] font-semibold text-icms-academic-blue hover:text-blue-800 transition-colors"
            >
              Tandai semua dibaca
            </button>
          )}
        </div>

        {/* List of Notifications */}
        <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto scrollbar-thin">
          {notifications.map((item) => {
            const getIcon = () => {
              switch (item.category) {
                case 'AKADEMIK':
                  return <FileCheck2 className="w-4 h-4 text-icms-academic-blue" />;
                case 'KEUANGAN':
                  return <Wallet className="w-4 h-4 text-emerald-600" />;
                case 'PRESENSI':
                  return <Clock className="w-4 h-4 text-amber-600" />;
                default:
                  return <Megaphone className="w-4 h-4 text-purple-600" />;
              }
            };

            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${
                  !item.isRead ? 'bg-blue-50/40' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                  {getIcon()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-xs truncate ${
                        !item.isRead ? 'font-bold text-icms-navy' : 'font-medium text-slate-700'
                      }`}
                    >
                      {item.title}
                    </h4>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-icms-academic-blue shrink-0"></span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                    {item.message}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                    {item.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={() => {
              navigate('/operasional/pengumuman');
              onClose();
            }}
            className="text-xs font-bold text-icms-academic-blue hover:underline flex items-center justify-center gap-1.5 w-full"
          >
            <span>Buka Papan Pengumuman Lengkap</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>
  );
};

