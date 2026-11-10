import React from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { 
  DollarSign, 
  Receipt, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FinanceAdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Biro Administrasi Umum & Keuangan (BAUK)
            </span>
            <span className="text-xs text-slate-300 font-medium">Rekonsiliasi Kas & Host-to-Host Bank</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Dashboard Pengelola Keuangan (BAUK)
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Monitoring penerimaan uang kuliah tunggal (UKT), verifikasi pembayaran Virtual Account & QRIS, serta piutang akademik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/operasional/keuangan"
            className="px-4 py-2.5 text-xs font-bold bg-white text-icms-navy hover:bg-slate-100 rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Receipt className="w-4 h-4" /> Buka Billing & Transaksi
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Target Penerimaan UKT"
          value="Rp 22.23 M"
          subtitle="Tahun Akademik 2026/2027"
          icon={DollarSign}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Realisasi Penerimaan Kas"
          value="Rp 18.65 M"
          subtitle="Tingkat Penyerapan 84.2%"
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Piutang Berjalan"
          value="Rp 3.58 M"
          subtitle="Tagihan Belum Lunas"
          icon={AlertCircle}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Transaksi Terverifikasi"
          value="2,840 Transaksi"
          subtitle="BCA, Mandiri, BNI & QRIS"
          icon={Receipt}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
          <h3 className="font-bold text-base text-icms-navy">Manajemen Tagihan & Invoice Mahasiswa</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Terbitkan tagihan semesteran massal, pantau mahasiswa yang belum melunasi biaya praktikum, serta unduh rekap laporan keuangan.
          </p>
          <Link to="/operasional/keuangan" className="inline-block px-4 py-2 text-xs font-bold text-white bg-icms-academic-blue hover:bg-blue-700 rounded-xl transition-colors">
            Lihat Rekapitulasi Tagihan →
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
          <h3 className="font-bold text-base text-icms-navy">Audit Log Transaksi Finansial</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Verifikasi jejak audit transaksi perbankan host-to-host dan pastikan tidak ada selisih pembayaran antara bank dan portal akademik.
          </p>
          <Link to="/sistem/audit-log" className="inline-block px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            Periksa Log Audit →
          </Link>
        </div>
      </div>
    </div>
  );
};
