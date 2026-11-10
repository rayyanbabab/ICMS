import React from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { 
  BookOpen, 
  Library, 
  Clock, 
  CheckCircle2, 
  Bookmark, 
  Sparkles, 
  Search,
  BookCopy
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const LibrarianDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Unit Pelaksana Teknis (UPT) Perpustakaan
            </span>
            <span className="text-xs text-slate-300 font-medium">Sistem Sirkulasi & Repositori Ilmiah</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Dashboard Pengelola Perpustakaan (Librarian)
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Sirkulasi peminjaman pustaka fisik, integrasi katalog OPAC digital, inventaris buku teks, dan repositori karya ilmiah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/operasional/perpustakaan"
            className="px-4 py-2.5 text-xs font-bold bg-white text-icms-navy hover:bg-slate-100 rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Library className="w-4 h-4" /> Buka Katalog Pustaka
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Judul Katalog"
          value="1,840 Judul"
          subtitle="Buku Teks & Monograf"
          icon={BookOpen}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Buku Sedang Dipinjam"
          value="142 Eksemplar"
          subtitle="Masa Pinjam 14 Hari"
          icon={Clock}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Koleksi E-Book Digital"
          value="680 Judul"
          subtitle="Dapat Dibaca Online"
          icon={BookCopy}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Kepatuhan Pengembalian"
          value="98.6% Tepat"
          subtitle="Tingkat Denda Keterlambatan Rendah"
          icon={CheckCircle2}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
          <h3 className="font-bold text-base text-icms-navy">Sirkulasi & Peminjaman Mahasiswa</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Periksa transaksi peminjaman buku aktif, hitung denda keterlambatan secara otomatis, dan proses pengembalian eksemplar.
          </p>
          <Link to="/operasional/perpustakaan" className="inline-block px-4 py-2 text-xs font-bold text-white bg-icms-academic-blue hover:bg-blue-700 rounded-xl transition-colors">
            Kelola Sirkulasi Buku →
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
          <h3 className="font-bold text-base text-icms-navy">Fasilitas Ruang Baca & Smart Lab</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Kelola ketersediaan ruang baca tenang, ruang diskusi multimedia, dan laboratorium komputer perpustakaan pusat.
          </p>
          <Link to="/manajemen/fasilitas" className="inline-block px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            Cek Fasilitas Perpustakaan →
          </Link>
        </div>
      </div>
    </div>
  );
};

