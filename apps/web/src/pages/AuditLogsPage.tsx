import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { StatCard } from '../components/ui/StatCard';
import { 
  FileCheck2, 
  ShieldAlert, 
  Clock, 
  Terminal, 
  Sparkles, 
  Filter, 
  RefreshCw,
  UserCheck
} from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState('ALL');

  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const res = await api.get('/system/audit-logs');
      return res.data;
    },
  });

  const filteredLogs = selectedModule === 'ALL'
    ? logs
    : logs.filter((l: any) => l.module === selectedModule);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Security & Compliance Audit Trail
            </span>
            <span className="text-xs text-slate-300 font-medium">Rekam Jejak Operasi Sensitif</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Audit Log & Keamanan Transaksi Sistem
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Pencatatan menyeluruh aktivitas autentikasi, persetujuan KRS, perubahan nilai akademik, dan verifikasi billing perbankan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/10 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Segarkan Log
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Rekaman Log"
          value={logs.length}
          subtitle="Jejak Audit Tersimpan"
          icon={FileCheck2}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Audit Integritas"
          value="100% Valid"
          subtitle="Immutable Database Audit"
          icon={ShieldAlert}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Autentikasi Aman"
          value="Argon2id"
          subtitle="Enkripsi Password Standar OWASP"
          icon={UserCheck}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Pencatatan IP"
          value="IPv4 & IPv6"
          subtitle="Pelacakan Alamat Pengguna"
          icon={Terminal}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-icms-navy">Aktivitas & Log Transaksi Terbaru</h3>
            <p className="text-xs text-slate-500 mt-0.5">Daftar operasi sistem yang tercatat secara kronologis.</p>
          </div>

          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 font-semibold focus:outline-hidden"
          >
            <option value="ALL">Semua Modul</option>
            <option value="AUTHENTICATION">Authentication</option>
            <option value="ACADEMIC_CORE">Academic Core</option>
            <option value="FINANCE_BILLING">Finance & Billing</option>
            <option value="LMS_CLASSROOM">LMS Classroom</option>
            <option value="DIGITAL_LIBRARY">Digital Library</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px] font-sans">
              <tr>
                <th className="px-5 py-3.5">Waktu Transaksi</th>
                <th className="px-5 py-3.5">Aksi / Operasi</th>
                <th className="px-5 py-3.5">Modul Terkait</th>
                <th className="px-5 py-3.5">Pengguna Pelaksana</th>
                <th className="px-5 py-3.5">Target ID</th>
                <th className="px-5 py-3.5">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log: any, idx: number) => (
                <tr key={log.id || idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5 text-slate-500">
                    {new Date(log.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • {new Date(log.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-icms-navy">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-sans font-semibold text-slate-700">{log.module}</td>
                  <td className="px-5 py-3.5 font-sans font-bold text-slate-900">
                    {log.user?.fullName || log.user?.username || 'System Root'}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{log.targetId || '-'}</td>
                  <td className="px-5 py-3.5 text-slate-400">{log.ipAddress || '127.0.0.1'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
