import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { StatusBadge } from '../components/ui/StatusBadge';
import { UserRole } from '@icms/shared';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Shield,
  Lock,
  Mail,
  User,
  Phone,
  X,
  Loader2,
  Check,
} from 'lucide-react';

interface UserItem {
  id: string;
  email: string;
  username: string;
  fullName: string;
  phoneNumber?: string;
  isActive: boolean;
  roles: UserRole[];
  createdAt: string;
}

interface UsersPageProps {
  defaultRole?: UserRole;
  titleOverride?: string;
  subtitleOverride?: string;
}

export const UsersPage: React.FC<UsersPageProps> = ({
  defaultRole,
  titleOverride,
  subtitleOverride,
}) => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState(defaultRole || '');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    phoneNumber: '',
    role: UserRole.LECTURER,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);

      const res = await apiRequest<{ items: UserItem[] }>(`/users?${params.toString()}`);
      if (res.data?.items) {
        setUsers(res.data.items);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await apiRequest(`/users/${id}/toggle-status`, { method: 'PATCH' });
      fetchUsers();
    } catch {
      alert('Gagal mengubah status pengguna.');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          username: form.username,
          password: form.password,
          phoneNumber: form.phoneNumber || undefined,
          roles: [form.role],
        }),
      });

      setModalOpen(false);
      setForm({
        fullName: '',
        email: '',
        username: '',
        password: '',
        phoneNumber: '',
        role: UserRole.LECTURER,
      });
      fetchUsers();
      setFeedback('Pengguna baru berhasil dibuat!');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal membuat pengguna');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-icms-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-icms-academic-blue text-[11px] font-bold uppercase tracking-wider border border-blue-200">
            <Shield className="w-3.5 h-3.5" />
            <span>Manajemen Pengguna & Otorisasi RBAC</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-icms-navy mt-1">
            {titleOverride || 'Daftar Pengguna Sistem'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {subtitleOverride || 'Kelola akun, hak akses role, serta status aktif seluruh sivitas akademika universitas.'}
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-icms-academic-blue hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-icms-border shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, email, username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-icms-academic-blue"
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs border border-slate-200 rounded-lg bg-slate-50 font-semibold focus:outline-none"
            >
              <option value="">Semua Peran</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              <option value="RECTOR">RECTOR</option>
              <option value="DEAN">DEAN</option>
              <option value="HEAD_OF_PROGRAM">HEAD_OF_PROGRAM</option>
              <option value="LECTURER">LECTURER</option>
              <option value="STUDENT">STUDENT</option>
              <option value="FINANCE_ADMIN">FINANCE_ADMIN</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Data Container: Responsive Cards on Mobile & Full Table on Desktop */}
      <div className="bg-white rounded-2xl border border-icms-border shadow-sm overflow-hidden">
        {/* Mobile View: High-Touch App Cards */}
        <div className="block md:hidden divide-y divide-slate-100">
          {loading ? (
            <div className="py-8 text-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-icms-academic-blue mb-2" />
              <span>Memuat data pengguna...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              Tidak ada pengguna ditemukan.
            </div>
          ) : (
            users.map((item) => (
              <div key={item.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-sm shrink-0">
                      {item.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-icms-navy">{item.fullName}</div>
                      <div className="text-[11px] text-slate-500">{item.email}</div>
                      <div className="text-[10px] text-slate-400 font-mono">@{item.username}</div>
                    </div>
                  </div>
                  <StatusBadge
                    status={item.isActive ? 'ACTIVE' : 'INACTIVE'}
                    label={item.isActive ? 'Aktif' : 'Nonaktif'}
                  />
                </div>

                <div className="flex flex-wrap gap-1">
                  {item.roles.map((r) => (
                    <span
                      key={r}
                      className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-50 text-icms-academic-blue font-bold border border-blue-100"
                    >
                      {r}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    Dibuat: {new Date(item.createdAt).toLocaleDateString('id-ID')}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(item.id)}
                    className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      item.isActive
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {item.isActive ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Full Data Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">Nama Lengkap</th>
                <th className="py-3 px-5">Username / Email</th>
                <th className="py-3 px-5">Role Akses</th>
                <th className="py-3 px-5 text-center">Status</th>
                <th className="py-3 px-5">Tanggal Dibuat</th>
                <th className="py-3 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-icms-academic-blue mb-2" />
                    <span>Memuat data pengguna dari database...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ada pengguna ditemukan.
                  </td>
                </tr>
              ) : (
                users.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-5 font-bold text-icms-navy flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                        {item.fullName.charAt(0)}
                      </div>
                      <span>{item.fullName}</span>
                    </td>
                    <td className="py-3 px-5 text-slate-600">
                      <div>{item.email}</div>
                      <div className="text-[10px] text-slate-400 font-mono">@{item.username}</div>
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex flex-wrap gap-1">
                        {item.roles.map((r) => (
                          <span
                            key={r}
                            className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-50 text-icms-academic-blue font-bold border border-blue-100"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-5 text-center">
                      <StatusBadge
                        status={item.isActive ? 'ACTIVE' : 'INACTIVE'}
                        label={item.isActive ? 'Aktif' : 'Nonaktif'}
                      />
                    </td>
                    <td className="py-3 px-5 text-slate-500 text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-3 px-5 text-center">
                      <button
                        onClick={() => handleToggleStatus(item.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-all ${
                          item.isActive
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {item.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Tambah Pengguna Baru */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-icms-navy font-heading">Tambah Pengguna Baru</h3>
                <p className="text-xs text-slate-500">Buat akun sivitas akademika & tentukan perannya</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dr. Ir. Dian Kusuma, M.Kom."
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-icms-academic-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="nama@icms.ac.id"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-icms-academic-blue"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="username_unik"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-icms-academic-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password Awal</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimal 8 karakter"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-icms-academic-blue"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. Handphone (Opsional)</label>
                  <input
                    type="text"
                    placeholder="08123456789"
                    value={form.phoneNumber}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-icms-academic-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Peran (Role Utama)</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:outline-none"
                >
                  <option value={UserRole.LECTURER}>LECTURER (Dosen)</option>
                  <option value={UserRole.STUDENT}>STUDENT (Mahasiswa)</option>
                  <option value={UserRole.DEAN}>DEAN (Dekan Fakultas)</option>
                  <option value={UserRole.HEAD_OF_PROGRAM}>HEAD_OF_PROGRAM (Kaprodi)</option>
                  <option value={UserRole.ACADEMIC_ADMIN}>ACADEMIC_ADMIN (BAAK)</option>
                  <option value={UserRole.FINANCE_ADMIN}>FINANCE_ADMIN (BAUK)</option>
                  <option value={UserRole.LIBRARIAN}>LIBRARIAN (Pustakawan)</option>
                  <option value={UserRole.HR_ADMIN}>HR_ADMIN (Kepegawaian)</option>
                  <option value={UserRole.SUPER_ADMIN}>SUPER_ADMIN (Administrator)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-icms-academic-blue hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Simpan Pengguna</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

