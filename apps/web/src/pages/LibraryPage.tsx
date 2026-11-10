import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { 
  BookOpen, 
  Library, 
  BookMarked, 
  Clock, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Bookmark, 
  ArrowLeftRight,
  Sparkles,
  BookCopy
} from 'lucide-react';

export const LibraryPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'catalog' | 'my-loans'>('catalog');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [digitalOnly, setDigitalOnly] = useState<boolean>(false);

  // Borrow confirmation modal state
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);

  // Digital e-reader preview modal
  const [isReaderModalOpen, setIsReaderModalOpen] = useState(false);
  const [readerBook, setReaderBook] = useState<any>(null);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['library-categories'],
    queryFn: async () => {
      const res = await api.get('/library/categories');
      return res.data;
    },
  });

  // Fetch books catalog
  const { data: catalogData, isLoading: isCatalogLoading, refetch: refetchCatalog } = useQuery({
    queryKey: ['library-books', searchTerm, selectedCategoryId, digitalOnly],
    queryFn: async () => {
      const res = await api.get('/library/books', {
        params: {
          search: searchTerm,
          categoryId: selectedCategoryId,
          isDigital: digitalOnly ? true : undefined,
        },
      });
      return res.data;
    },
  });

  // Fetch current user loans
  const { data: myLoansData, isLoading: isLoansLoading, refetch: refetchLoans } = useQuery({
    queryKey: ['my-library-loans'],
    queryFn: async () => {
      const res = await api.get('/library/my-loans');
      return res.data;
    },
  });

  const borrowMutation = useMutation({
    mutationFn: async (bookId: string) => {
      const res = await api.post(`/library/books/${bookId}/borrow`);
      return res.data;
    },
    onSuccess: () => {
      setIsBorrowModalOpen(false);
      setSelectedBook(null);
      refetchCatalog();
      refetchLoans();
      setActiveTab('my-loans');
    },
  });

  const returnMutation = useMutation({
    mutationFn: async (loanId: string) => {
      const res = await api.post(`/library/loans/${loanId}/return`);
      return res.data;
    },
    onSuccess: () => {
      refetchCatalog();
      refetchLoans();
    },
  });

  const handleBorrow = () => {
    if (!selectedBook) return;
    borrowMutation.mutate(selectedBook.id);
  };

  const handleReturn = (loanId: string) => {
    if (confirm('Konfirmasi pengembalian buku ke perpustakaan?')) {
      returnMutation.mutate(loanId);
    }
  };

  const books = catalogData?.books || [];
  const loans = myLoansData?.loans || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Perpustakaan Digital & Fisik Terintegrasi
            </span>
            <span className="text-xs text-slate-300 font-medium">Katalog OPAC Terpusat</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">Perpustakaan & Repositori Digital</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Akses ribuan judul buku teks, publikasi ilmiah internasional, jurnal elektronik, dan manajemen peminjaman pustaka fisik secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-right">
            <span className="text-xs text-slate-300 block">Kode Anggota</span>
            <span className="text-sm font-bold font-mono text-emerald-400">
              {myLoansData?.memberCode || 'LIB-MEMBER'}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Judul Katalog"
          value={catalogData?.stats?.totalTitles || 0}
          subtitle="Buku Teks & Referensi"
          icon={BookOpen}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Koleksi E-Book Digital"
          value={catalogData?.stats?.digitalTitles || 0}
          subtitle="Dapat Dibaca Online"
          icon={BookMarked}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Stok Fisik Tersedia"
          value={catalogData?.stats?.availableStock || 0}
          subtitle="Siap Dipinjam di Perpustakaan"
          icon={BookCopy}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Buku Sedang Dipinjam"
          value={myLoansData?.activeLoansCount || 0}
          subtitle="Peminjaman Aktif Anda"
          icon={Clock}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Navigation Tabs & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'catalog'
                ? 'bg-icms-academic-blue text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Library className="w-3.5 h-3.5" />
            Katalog Buku ({books.length})
          </button>
          <button
            onClick={() => setActiveTab('my-loans')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'my-loans'
                ? 'bg-icms-academic-blue text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Peminjaman Saya ({myLoansData?.activeLoansCount || 0})
          </button>
        </div>

        {activeTab === 'catalog' && (
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari Judul, Penulis, ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-icms-academic-blue"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                checked={digitalOnly}
                onChange={(e) => setDigitalOnly(e.target.checked)}
                className="text-icms-academic-blue rounded"
              />
              <span>E-Book Saja</span>
            </label>
          </div>
        )}
      </div>

      {/* TAB 1: CATALOG VIEW */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategoryId('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategoryId === 'ALL'
                  ? 'bg-icms-navy text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              Semua Kategori
            </button>
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategoryId === cat.id
                    ? 'bg-icms-navy text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat.name} ({cat._count?.books || 0})
              </button>
            ))}
          </div>

          {/* Book Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {books.map((b: any) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Cover Image */}
                  <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={b.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900/80 text-white backdrop-blur-xs">
                        {b.category}
                      </span>
                      {b.isDigital && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600/90 text-white backdrop-blur-xs">
                          E-Book Tersedia
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-icms-academic-blue transition-colors">
                      {b.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      Oleh: <span className="font-semibold text-slate-700">{b.author}</span>
                    </p>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-between">
                      <span>{b.publisher} ({b.publishYear})</span>
                      <span className="font-mono">{b.isbn}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
                  <div className="text-xs">
                    <span className="text-slate-400 block text-[10px]">Stok Tersedia</span>
                    <span className={`font-bold font-mono ${
                      b.availableStock > 0 ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      {b.availableStock} / {b.totalStock} Eks.
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {b.isDigital && (
                      <button
                        onClick={() => {
                          setReaderBook(b);
                          setIsReaderModalOpen(true);
                        }}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        title="Baca E-Book Digital"
                      >
                        Baca Online
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedBook(b);
                        setIsBorrowModalOpen(true);
                      }}
                      disabled={b.availableStock <= 0}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-icms-academic-blue hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white shadow-xs transition-colors"
                    >
                      Pinjam
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MY LOANS VIEW */}
      {activeTab === 'my-loans' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-icms-navy">Riwayat Peminjaman Buku</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Masa pinjaman standar adalah 14 hari kalender. Denda keterlambatan Rp 1.000 / hari.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              {loans.length} Catatan
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {loans.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold">Anda belum memiliki riwayat peminjaman buku.</p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="mt-3 text-xs font-bold text-icms-academic-blue hover:underline"
                >
                  Jelajahi Katalog Buku →
                </button>
              </div>
            ) : (
              loans.map((loan: any) => {
                const dueDate = new Date(loan.dueDate);
                const isOverdue = loan.status === 'OVERDUE' || (loan.status === 'BORROWED' && dueDate < new Date());
                const isReturned = loan.status === 'RETURNED';

                return (
                  <div
                    key={loan.id}
                    className="p-5 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-14 h-18 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <img
                          src={loan.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'}
                          alt={loan.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {loan.category}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isReturned
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isOverdue
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {isReturned ? 'DIKEMBALIKAN' : isOverdue ? 'JATUH TEMPO (OVERDUE)' : 'SEDANG DIPINJAM'}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-slate-900">{loan.title}</h4>
                        <p className="text-xs text-slate-500">Penulis: {loan.author}</p>

                        <div className="text-xs text-slate-500 flex items-center gap-4 pt-1">
                          <span>
                            Dipinjam: {new Date(loan.borrowDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span>
                            Batas Kembali: <span className="font-semibold text-slate-700">{dueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                      {!isReturned && (
                        <button
                          onClick={() => handleReturn(loan.id)}
                          disabled={returnMutation.isPending}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5"
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5" /> Kembalikan Buku
                        </button>
                      )}
                      {loan.isDigital && (
                        <button
                          onClick={() => {
                            setReaderBook(loan);
                            setIsReaderModalOpen(true);
                          }}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                          Baca E-Book
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* BORROW CONFIRMATION MODAL */}
      {isBorrowModalOpen && selectedBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Konfirmasi Peminjaman Buku</h3>
              <button 
                onClick={() => setIsBorrowModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <img
                  src={selectedBook.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'}
                  alt={selectedBook.title}
                  className="w-12 h-16 object-cover rounded-md border border-slate-200 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{selectedBook.title}</h4>
                  <p className="text-xs text-slate-500">{selectedBook.author}</p>
                  <span className="text-[11px] font-mono text-slate-400 block mt-1">ISBN: {selectedBook.isbn}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/60 text-xs text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Ketentuan Masa Pinjam (14 Hari)
                </div>
                <p>
                  Buku dapat dipinjam sampai dengan <strong>{new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>. Silakan bawa bukti peminjaman digital ini ke meja sirkulasi Perpustakaan Kampus Thamrin.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBorrowModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleBorrow}
                  disabled={borrowMutation.isPending}
                  className="px-5 py-2.5 text-xs font-bold bg-icms-academic-blue hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {borrowMutation.isPending ? 'Memproses...' : 'Konfirmasi Peminjaman'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIGITAL E-READER PREVIEW MODAL */}
      {isReaderModalOpen && readerBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">E-Reader Kampus Terpadu</h3>
              </div>
              <button 
                onClick={() => setIsReaderModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center space-y-3">
              <img
                src={readerBook.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'}
                alt={readerBook.title}
                className="w-24 h-32 object-cover rounded-lg mx-auto shadow-md"
              />
              <h4 className="font-bold text-base text-slate-900">{readerBook.title}</h4>
              <p className="text-xs text-slate-500">Penulis: {readerBook.author}</p>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Anda memiliki akses penuh untuk membaca salinan digital e-book ini sebagai sivitas akademika Universitas Indonesia Mandiri.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-mono">Format: PDF/EPUB Interaktif</span>
              <a
                href={readerBook.digitalUrl || 'https://elibrary.icms.ac.id/reader/demo'}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
              >
                Buka Viewer Lengkap <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
