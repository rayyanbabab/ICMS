import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '@icms/shared';
import {
  Search,
  BookOpen,
  Calendar,
  FileCheck2,
  Award,
  Wallet,
  Clock,
  BookMarked,
  Library,
  Megaphone,
  Briefcase,
  FlaskConical,
  Building,
  ShieldCheck,
  History,
  Settings,
  Users,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CornerDownLeft,
  X,
} from 'lucide-react';

interface CommandItem {
  id: string;
  category: 'Halaman & Modul' | 'Mahasiswa & Dosen' | 'Mata Kuliah' | 'Aksi Cepat Role';
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  onSelect: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setActiveRole } = useAuth();

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const items: CommandItem[] = [
    // Pages
    {
      id: 'p-dashboard',
      category: 'Halaman & Modul',
      title: 'Dashboard Utama',
      subtitle: 'Pusat kendali dan ikhtisar performa kampus',
      icon: ShieldCheck,
      onSelect: () => { navigate('/'); onClose(); },
    },
    {
      id: 'p-krs',
      category: 'Halaman & Modul',
      title: 'KRS Online',
      subtitle: 'Pengisian dan persetujuan rencana studi semester',
      icon: FileCheck2,
      onSelect: () => { navigate('/akademik/krs'); onClose(); },
    },
    {
      id: 'p-khs',
      category: 'Halaman & Modul',
      title: 'Nilai & KHS Mahasiswa',
      subtitle: 'Kartu hasil studi, transkrip, dan rekapitulasi IPK',
      icon: Award,
      onSelect: () => { navigate('/akademik/khs'); onClose(); },
    },
    {
      id: 'p-jadwal',
      category: 'Halaman & Modul',
      title: 'Jadwal Kuliah Mingguan',
      subtitle: 'Matriks perkuliahan, alokasi ruang kelas, dan dosen',
      icon: Calendar,
      onSelect: () => { navigate('/akademik/jadwal'); onClose(); },
    },
    {
      id: 'p-lms',
      category: 'Halaman & Modul',
      title: 'Kelas Digital (LMS)',
      subtitle: 'Materi kuliah multimedia dan pengumpulan tugas',
      icon: BookMarked,
      onSelect: () => { navigate('/operasional/lms'); onClose(); },
    },
    {
      id: 'p-keuangan',
      category: 'Halaman & Modul',
      title: 'Keuangan & Tagihan UKT',
      subtitle: 'Invoice SPP/UKT, Virtual Account, dan rekonsiliasi kas',
      icon: Wallet,
      onSelect: () => { navigate('/operasional/keuangan'); onClose(); },
    },
    {
      id: 'p-surat',
      category: 'Halaman & Modul',
      title: 'Administrasi Surat BAAK',
      subtitle: 'Surat aktif kuliah, izin riset, dan verifikasi barcode QR',
      icon: FileCheck2,
      onSelect: () => { navigate('/operasional/administrasi'); onClose(); },
    },
    {
      id: 'p-presensi',
      category: 'Halaman & Modul',
      title: 'Presensi Digital QR',
      subtitle: 'Manajemen kehadiran perkuliahan dengan token dinamis',
      icon: Clock,
      onSelect: () => { navigate('/operasional/presensi'); onClose(); },
    },
    {
      id: 'p-cbt',
      category: 'Halaman & Modul',
      title: 'Ujian CBT Simulator',
      subtitle: 'Evaluasi UTS/UAS online dengan countdown timer',
      icon: Award,
      onSelect: () => { navigate('/operasional/ujian'); onClose(); },
    },
    {
      id: 'p-perpustakaan',
      category: 'Halaman & Modul',
      title: 'Perpustakaan Digital OPAC',
      subtitle: 'Katalog buku fisik, e-book, dan peminjaman',
      icon: Library,
      onSelect: () => { navigate('/operasional/perpustakaan'); onClose(); },
    },
    {
      id: 'p-pengumuman',
      category: 'Halaman & Modul',
      title: 'Papan Pengumuman Kampus',
      subtitle: 'Warta akademik, info beasiswa, dan pengumuman rektorat',
      icon: Megaphone,
      onSelect: () => { navigate('/operasional/pengumuman'); onClose(); },
    },
    {
      id: 'p-fasilitas',
      category: 'Halaman & Modul',
      title: 'Sarana & Fasilitas Kampus',
      subtitle: 'Reservasi laboratorium komputer, auditorium, dan ruang rapat',
      icon: Building,
      onSelect: () => { navigate('/manajemen/fasilitas'); onClose(); },
    },
    {
      id: 'p-lppm',
      category: 'Halaman & Modul',
      title: 'Penelitian & LPPM',
      subtitle: 'Hibah riset dosen, publikasi Scopus, dan pengabdian',
      icon: FlaskConical,
      onSelect: () => { navigate('/manajemen/penelitian'); onClose(); },
    },
    {
      id: 'p-sdm',
      category: 'Halaman & Modul',
      title: 'SDM & Kepegawaian',
      subtitle: 'Beban Kerja Dosen (BKD) dan direktori fungsional dosen',
      icon: Briefcase,
      onSelect: () => { navigate('/manajemen/sdm'); onClose(); },
    },

    // People
    {
      id: 'u-ahmad',
      category: 'Mahasiswa & Dosen',
      title: 'Ahmad Fauzi (NIM: 202601001)',
      subtitle: 'Mahasiswa S1 Teknik Informatika • Semester 1 • IPK 3.85',
      icon: Users,
      onSelect: () => {
        setActiveRole(UserRole.STUDENT);
        navigate('/akademik/khs');
        onClose();
      },
    },
    {
      id: 'u-budi',
      category: 'Mahasiswa & Dosen',
      title: 'Dr. Ir. Budi Santoso, M.Kom. (NIDN: 0012058001)',
      subtitle: 'Dosen Pembimbing Akademik • Lektor Kepala • AI & Software',
      icon: GraduationCap,
      onSelect: () => {
        setActiveRole(UserRole.LECTURER);
        navigate('/akademik/krs');
        onClose();
      },
    },
    {
      id: 'u-hendra',
      category: 'Mahasiswa & Dosen',
      title: 'Prof. Dr. Ir. Hendra Setiawan, M.Eng.',
      subtitle: 'Rektor Universitas Indonesia Mandiri • Guru Besar Sistem Komputer',
      icon: GraduationCap,
      onSelect: () => {
        setActiveRole(UserRole.RECTOR);
        navigate('/');
        onClose();
      },
    },

    // Courses
    {
      id: 'c-if101',
      category: 'Mata Kuliah',
      title: 'IF101 - Algoritma & Pemrograman Lanjut (3 SKS)',
      subtitle: 'Kelas IF-1A • Dr. Ir. Budi Santoso, M.Kom. • LAB-KOM-01',
      icon: BookOpen,
      onSelect: () => { navigate('/akademik/jadwal'); onClose(); },
    },
    {
      id: 'c-if202',
      category: 'Mata Kuliah',
      title: 'IF202 - Struktur Data & Algoritma (3 SKS)',
      subtitle: 'Kelas IF-1A • Siti Nurhaliza, M.T. • R-TEORI-302',
      icon: BookOpen,
      onSelect: () => { navigate('/akademik/jadwal'); onClose(); },
    },
    {
      id: 'c-if301',
      category: 'Mata Kuliah',
      title: 'IF301 - Basis Data & Big Data Analytics (3 SKS)',
      subtitle: 'Kelas IF-1B • Dr. Ahmad Fauzi, M.Sc. • LAB-KOM-02',
      icon: BookOpen,
      onSelect: () => { navigate('/akademik/jadwal'); onClose(); },
    },

    // Role Actions
    {
      id: 'r-mhs',
      category: 'Aksi Cepat Role',
      title: 'Ganti Sudut Pandang: Portal Mahasiswa',
      subtitle: 'Lihat KRS, jadwal, tagihan UKT, dan nilai sebagai Mahasiswa',
      icon: Sparkles,
      onSelect: () => {
        setActiveRole(UserRole.STUDENT);
        onClose();
      },
    },
    {
      id: 'r-dosen',
      category: 'Aksi Cepat Role',
      title: 'Ganti Sudut Pandang: Dosen Pengampu & PA',
      subtitle: 'Buka presensi kelas, input nilai, dan setujui KRS bimbingan',
      icon: Sparkles,
      onSelect: () => {
        setActiveRole(UserRole.LECTURER);
        onClose();
      },
    },
    {
      id: 'r-baak',
      category: 'Aksi Cepat Role',
      title: 'Ganti Sudut Pandang: Loket BAAK Registrar',
      subtitle: 'Verifikasi surat resmi mahasiswa dan kalender universitas',
      icon: Sparkles,
      onSelect: () => {
        setActiveRole(UserRole.ACADEMIC_ADMIN);
        onClose();
      },
    },
    {
      id: 'r-bauk',
      category: 'Aksi Cepat Role',
      title: 'Ganti Sudut Pandang: Biro Keuangan BAUK',
      subtitle: 'Audit pembayaran UKT, rekonsiliasi kas, dan billing perbankan',
      icon: Sparkles,
      onSelect: () => {
        setActiveRole(UserRole.FINANCE_ADMIN);
        onClose();
      },
    },
    {
      id: 'r-rektor',
      category: 'Aksi Cepat Role',
      title: 'Ganti Sudut Pandang: Executive Rektorat',
      subtitle: 'Pantau kinerja fakultas, realisasi UKT, dan KPI strategis',
      icon: Sparkles,
      onSelect: () => {
        setActiveRole(UserRole.RECTOR);
        onClose();
      },
    },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()),
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].onSelect();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ketik untuk mencari modul, mahasiswa, dosen, atau tekan Esc..."
            className="w-full text-sm font-medium bg-transparent border-0 focus:outline-none placeholder:text-slate-400 text-icms-navy"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
              ESC
            </span>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-slate-50 p-2 scrollbar-thin">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.onSelect}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center justify-between ${
                    isSelected ? 'bg-blue-50 text-icms-academic-blue' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-icms-academic-blue text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold truncate text-slate-900">{item.title}</span>
                        <span className="text-[9px] font-semibold px-2 py-0.2 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pl-3">
                    {isSelected && (
                      <span className="text-[10px] font-bold text-icms-academic-blue flex items-center gap-1">
                        <span>Pilih</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Tidak ada hasil pencarian untuk "{query}".
            </div>
          )}
        </div>

        {/* Keyboard Helper Footer */}
        <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Navigasi: <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">↑</kbd> <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">↓</kbd></span>
            <span>Buka: <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">Enter</kbd></span>
          </div>
          <span className="font-semibold text-slate-500">ICMS Omnisearch Suite</span>
        </div>
      </div>
    </div>
  );
};

