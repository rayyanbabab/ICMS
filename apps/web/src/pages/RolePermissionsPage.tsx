import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { StatCard } from '../components/ui/StatCard';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Layers,
  Search
} from 'lucide-react';

export const RolePermissionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: permData, isLoading } = useQuery({
    queryKey: ['role-permissions'],
    queryFn: async () => {
      const res = await api.get('/system/permissions');
      return res.data;
    },
  });

  const roles: any[] = permData?.roles || [];
  const modules: string[] = permData?.modules || [];

  const filteredRoles = roles.filter((r) => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.description && r.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Role-Based Access Control (RBAC)
            </span>
            <span className="text-xs text-slate-300 font-medium">Matriks Hak Akses Terstandarisasi</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Role & Matriks Hak Akses Sistem
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Konfigurasi granular hak akses 14 role pengguna terhadap modul akademik, operasional, finansial, dan tata kelola kampus.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Peran Sistem"
          value={roles.length || 14}
          subtitle="Role Hierarki Resmi"
          icon={ShieldCheck}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Modul Terproteksi"
          value={modules.length || 14}
          subtitle="Guard & Middleware RBAC"
          icon={Lock}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Model Otorisasi"
          value="Granular RBAC"
          subtitle="CREATE, READ, UPDATE, DELETE"
          icon={Key}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Bypass Keamanan"
          value="Super Admin Only"
          subtitle="Akses Darurat Root"
          icon={Layers}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Search and Role Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h3 className="font-bold text-base text-icms-navy">Daftar Role & Cakupan Hak Akses</h3>
            <p className="text-xs text-slate-500 mt-0.5">Setiap role memiliki dasbor dan batasan data tersendiri sesuai kewenangan.</p>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari nama role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3.5 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-icms-academic-blue"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
          {filteredRoles.map((role) => (
            <div key={role.id} className="p-4 bg-white hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded bg-slate-900 text-white">
                    {role.name}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {role.description || 'Hak akses operasional universitas'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {role.permissionsCount || 12} Hak Izin Aktif
                </span>
                <span className="text-xs text-slate-400 font-mono">Status: Enabled</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
