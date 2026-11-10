import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { StatCard } from '../components/ui/StatCard';
import { 
  Megaphone, 
  Search, 
  Pin, 
  Calendar, 
  User, 
  Tag, 
  Sparkles, 
  Plus, 
  X,
  FileText,
  Bookmark,
  Share2
} from 'lucide-react';

export const AnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state
  const [titleInput, setTitleInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('AKADEMIK');
  const [contentInput, setContentInput] = useState('');
  const [isPinnedInput, setIsPinnedInput] = useState(false);

  const { data: announcements = [], isLoading, refetch } = useQuery({
    queryKey: ['announcements', selectedCategory, searchTerm],
    queryFn: async () => {
      const res = await api.get('/announcements', {
        params: {
          category: selectedCategory,
          search: searchTerm,
        },
      });
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/announcements', data);
      return res.data;
    },
    onSuccess: () => {
      setIsCreateModalOpen(false);
      setTitleInput('');
      setContentInput('');
      setIsPinnedInput(false);
      refetch();
    },
  });

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title: titleInput,
      content: contentInput,
      category: categoryInput,
      isPinned: isPinnedInput,
      authorName: user?.fullName || 'Biro Administrasi Kampus',
    });
  };

  const isStaffOrAdmin = user?.roles?.some((r: any) => 
    ['SUPER_ADMIN', 'RECTOR', 'ACADEMIC_ADMIN', 'HEAD_OF_PROGRAM'].includes(r)
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Papan Informasi & Broadcast Kampus
            </span>
            <span className="text-xs text-slate-300 font-medium">Universitas Indonesia Mandiri</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Pengumuman & Berita Sivitas Akademika
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Pusat siaran berita resmi rektorat, edaran akademik, informasi beasiswa nasional, dan agenda kegiatan mahasiswa.
          </p>
        </div>

        {isStaffOrAdmin && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 text-xs font-bold bg-white text-icms-navy hover:bg-slate-100 rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Terbitkan Pengumuman
            </button>
          </div>
        )}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Pengumuman"
          value={announcements.length}
          subtitle="Warta Kampus Aktif"
          icon={Megaphone}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Pengumuman Penting"
          value={announcements.filter((a: any) => a.isPinned).length}
          subtitle="Disematkan (Pinned)"
          icon={Pin}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Kategori Informasi"
          value="4 Bidang"
          subtitle="Akademik, Beasiswa, dll"
          icon={Tag}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Pembaruan Terkini"
          value="Hari Ini"
          subtitle="Sinkronisasi Real-Time"
          icon={Calendar}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: 'Semua Kategori' },
            { id: 'AKADEMIK', label: 'Akademik & Perkuliahan' },
            { id: 'BEASISWA', label: 'Beasiswa & Finansial' },
            { id: 'KEGIATAN', label: 'Kegiatan & Seminar' },
            { id: 'KARIR', label: 'Karir & Magang' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-icms-navy text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kata kunci berita..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-icms-academic-blue"
          />
        </div>
      </div>

      {/* Announcements List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {announcements.map((ann: any) => (
          <div
            key={ann.id}
            className={`bg-white rounded-2xl border p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between gap-4 ${
              ann.isPinned ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                  {ann.category}
                </span>
                {ann.isPinned && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Pin className="w-3 h-3" /> PENTING
                  </span>
                )}
              </div>

              <h4 className="font-bold text-base text-slate-900 line-clamp-2 leading-snug hover:text-icms-academic-blue transition-colors">
                {ann.title}
              </h4>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {ann.content}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate max-w-[140px]">{ann.authorName}</span>
                </div>
                <span>{new Date(ann.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>

              <button
                onClick={() => setSelectedAnnouncement(ann)}
                className="w-full text-center py-2 text-xs font-bold text-icms-academic-blue bg-blue-50/70 hover:bg-blue-100 rounded-xl transition-colors"
              >
                Baca Selengkapnya →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in duration-150 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {selectedAnnouncement.category}
                </span>
                <h3 className="font-bold text-base text-slate-900 leading-snug">{selectedAnnouncement.title}</h3>
                <div className="text-xs text-slate-400 flex items-center gap-3">
                  <span>Penerbit: <strong>{selectedAnnouncement.authorName}</strong></span>
                  <span>•</span>
                  <span>{new Date(selectedAnnouncement.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAnnouncement(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-700 leading-relaxed max-h-96 overflow-y-auto whitespace-pre-line py-2">
              {selectedAnnouncement.content}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-5 py-2 text-xs font-bold bg-icms-navy hover:bg-slate-800 text-white rounded-xl shadow-xs transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PUBLISH MODAL FOR ADMIN */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Terbitkan Pengumuman Baru</h3>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Judul Pengumuman</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jadwal Pelaksanaan Ujian Akhir Semester..."
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-icms-academic-blue"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Kategori Informasi</label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-icms-academic-blue"
                >
                  <option value="AKADEMIK">Akademik & Perkuliahan</option>
                  <option value="BEASISWA">Beasiswa & Bantuan Dana</option>
                  <option value="KEGIATAN">Kegiatan Mahasiswa & Seminar</option>
                  <option value="KARIR">Karir & Magang Industri</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Isi Berita / Siaran Pengumuman</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tuliskan isi pengumuman lengkap secara jelas..."
                  value={contentInput}
                  onChange={(e) => setContentInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-icms-academic-blue"
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPinnedInput}
                  onChange={(e) => setIsPinnedInput(e.target.checked)}
                  className="text-icms-academic-blue rounded"
                />
                <span>Sematkan di bagian teratas sebagai Pengumuman Penting</span>
              </label>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2 text-xs font-bold bg-icms-academic-blue hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {createMutation.isPending ? 'Menerbitkan...' : 'Terbitkan Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
