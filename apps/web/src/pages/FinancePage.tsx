import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '@icms/shared';
import { exportToCsv } from '../utils/export';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Receipt, 
  Building2, 
  ArrowUpRight, 
  QrCode, 
  ShieldCheck, 
  Search,
  Filter,
  DollarSign,
  Printer,
  FileDown
} from 'lucide-react';

export const FinancePage: React.FC = () => {
  const { user, activeRole } = useAuth();
  const queryClient = useQueryClient();
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('VIRTUAL_ACCOUNT_BCA');
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  // Search & filter for admin view
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const isStudent = activeRole === UserRole.STUDENT;

  // Fetch student invoices if student
  const { data: studentFinance, isLoading: isStudentLoading, refetch: refetchStudent } = useQuery({
    queryKey: ['student-finance', activeRole],
    queryFn: async () => {
      const res = await api.get('/finance/my-invoices');
      return res.data;
    },
    enabled: isStudent,
  });

  // Fetch all invoices if admin or leadership
  const { data: allFinance, isLoading: isAdminLoading, refetch: refetchAdmin } = useQuery({
    queryKey: ['admin-finance', statusFilter, searchTerm, activeRole],
    queryFn: async () => {
      const res = await api.get('/finance/invoices', {
        params: { status: statusFilter, search: searchTerm },
      });
      return res.data;
    },
    enabled: !isStudent,
  });

  const payMutation = useMutation({
    mutationFn: async ({ invoiceId, method }: { invoiceId: string; method: string }) => {
      const res = await api.post(`/finance/invoices/${invoiceId}/pay`, { paymentMethod: method });
      return res.data;
    },
    onSuccess: (data) => {
      setIsPaymentModalOpen(false);
      setReceiptData(data);
      setIsReceiptModalOpen(true);
      if (isStudent) refetchStudent();
      else refetchAdmin();
    },
  });

  const handleProcessPayment = () => {
    if (!selectedInvoice) return;
    payMutation.mutate({
      invoiceId: selectedInvoice.id,
      method: paymentMethod,
    });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleExportFinance = () => {
    const list = isStudent ? (studentFinance?.invoices || []) : (allFinance?.invoices || []);
    const headers = ['Nomor Invoice', 'Judul Tagihan', 'Nominal (Rp)', 'Status', 'Jatuh Tempo', 'Tanggal Lunas'];
    const rows = list.map((inv: any) => [
      inv.invoiceNumber,
      inv.title,
      inv.amount,
      inv.status,
      inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('id-ID') : '-',
      inv.paidAt ? new Date(inv.paidAt).toLocaleDateString('id-ID') : '-',
    ]);
    exportToCsv(`Laporan_Keuangan_UKT_${new Date().toISOString().split('T')[0]}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Bank Host-to-Host Gateway
            </span>
            <span className="text-xs text-slate-300 font-medium">Sistem Keuangan & Billing Terpadu</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">Manajemen Keuangan & UKT Kampus</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            {isStudent 
              ? 'Informasi rincian biaya kuliah, tagihan semester aktif, histori transaksi, serta pembayaran instan melalui Virtual Account & QRIS.'
              : 'Pusat monitor pendapatan universitas, realisasi penerimaan SPP/UKT, piutang akademik, dan audit transaksi perbankan.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportFinance}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5 shadow-xs"
            title="Ekspor Rekap Keuangan ke CSV/Excel"
          >
            <FileDown className="w-4 h-4 text-emerald-400" />
            <span>Ekspor Kas (.csv)</span>
          </button>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-right">
            <span className="text-xs text-slate-300 block">Kanal Pembayaran</span>
            <span className="text-sm font-bold text-emerald-400">BCA • Mandiri • BNI • QRIS</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      {isStudent ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Tagihan Semester"
            value={formatCurrency(studentFinance?.summary?.totalBilled || 0)}
            subtitle="Tahun Akademik 2026/2027"
            icon={Receipt}
            iconBg="bg-blue-50"
            iconColor="text-icms-academic-blue"
          />
          <StatCard
            title="Total Telah Dibayar"
            value={formatCurrency(studentFinance?.summary?.totalPaid || 0)}
            subtitle="Terverifikasi Otomatis"
            icon={CheckCircle2}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <StatCard
            title="Sisa Kewajiban Pembayaran"
            value={formatCurrency(studentFinance?.summary?.totalOutstanding || 0)}
            subtitle={(studentFinance?.summary?.totalOutstanding || 0) > 0 ? 'Menunggu Pelunasan' : 'Bebas Tanggungan SPP'}
            icon={CreditCard}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Target Penerimaan"
            value={formatCurrency(allFinance?.stats?.totalRevenueTarget || 0)}
            subtitle="Ketetapan Billing TA 2026"
            icon={DollarSign}
            iconBg="bg-blue-50"
            iconColor="text-icms-academic-blue"
          />
          <StatCard
            title="Realisasi Penerimaan"
            value={formatCurrency(allFinance?.stats?.totalCollected || 0)}
            subtitle={`Tingkat Penyerapan ${allFinance?.stats?.collectionRate || 0}%`}
            icon={CheckCircle2}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <StatCard
            title="Total Piutang Berjalan"
            value={formatCurrency(allFinance?.stats?.totalOutstanding || 0)}
            subtitle="Belum Dibayar Mahasiswa"
            icon={AlertCircle}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
          <StatCard
            title="Tagihan Lunas vs Pending"
            value={`${allFinance?.stats?.totalPaidCount || 0} / ${allFinance?.stats?.totalUnpaidCount || 0}`}
            subtitle="Invoice Lunas vs Belum"
            icon={Receipt}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
        </div>
      )}

      {/* STUDENT INVOICE LIST */}
      {isStudent && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-icms-navy">Daftar Tagihan Mahasiswa</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                NIM: <span className="font-semibold text-slate-700">{studentFinance?.student?.nim}</span> • Program Studi: {studentFinance?.student?.studyProgram}
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              {studentFinance?.invoices?.length || 0} Tagihan
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {(!studentFinance?.invoices || studentFinance.invoices.length === 0) ? (
              <div className="p-12 text-center text-slate-400">
                <Receipt className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold">Tidak ada tagihan aktif untuk akun Anda.</p>
              </div>
            ) : (
              studentFinance.invoices.map((inv: any) => {
                const isPaid = inv.status === 'PAID';
                return (
                  <div key={inv.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-mono">
                          {inv.invoiceNumber}
                        </span>
                        <StatusBadge status={inv.status} />
                        <span className="text-xs text-slate-500">
                          Semester: <span className="font-semibold">{inv.semesterName}</span>
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-base text-slate-900">{inv.title}</h4>
                        <div className="text-xs text-slate-500 flex items-center gap-4 mt-1">
                          <span>
                            Jatuh Tempo: <span className="font-semibold text-slate-700">{new Date(inv.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          </span>
                          {inv.paidAt && (
                            <span className="text-emerald-700">
                              Lunas pada: {new Date(inv.paidAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Items breakdown */}
                      <div className="bg-slate-50 rounded-xl p-3 max-w-xl space-y-1.5 border border-slate-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Rincian Komponen Biaya:</span>
                        {inv.items.map((it: any) => (
                          <div key={it.id} className="flex justify-between text-xs text-slate-600">
                            <span>• {it.name}</span>
                            <span className="font-semibold text-slate-800">{formatCurrency(it.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Amount & Actions */}
                    <div className="flex flex-col md:items-end justify-between gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Total Pembayaran</span>
                        <span className="text-xl font-bold font-mono text-icms-navy">
                          {formatCurrency(inv.amount)}
                        </span>
                      </div>

                      <div>
                        {isPaid ? (
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setReceiptData({ invoice: inv, referenceNo: inv.payments?.[0]?.referenceNo || 'REF-VERIFIED' });
                              setIsReceiptModalOpen(true);
                            }}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5"
                          >
                            <Receipt className="w-3.5 h-3.5" /> Cetak Bukti Bayar
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setIsPaymentModalOpen(true);
                            }}
                            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-icms-academic-blue hover:bg-blue-700 shadow-xs transition-colors flex items-center gap-1.5"
                          >
                            <CreditCard className="w-4 h-4" /> Bayar Sekarang
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ADMIN INVOICE LIST */}
      {!isStudent && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-icms-navy">Semua Tagihan & Transaksi Mahasiswa</h3>
              <p className="text-xs text-slate-500 mt-0.5">Kelola penagihan uang kuliah tunggal dan layanan akademik universitas.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari NIM, Nama, No. Invoice..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-icms-academic-blue"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 font-semibold focus:outline-hidden"
              >
                <option value="ALL">Semua Status</option>
                <option value="PAID">Lunas (Paid)</option>
                <option value="UNPAID">Belum Lunas (Unpaid)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">No. Invoice</th>
                  <th className="px-4 py-3">Mahasiswa</th>
                  <th className="px-4 py-3">Peruntukan</th>
                  <th className="px-4 py-3">Nominal</th>
                  <th className="px-4 py-3">Jatuh Tempo</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(!allFinance?.invoices || allFinance.invoices.length === 0) ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      Tidak ada catatan tagihan ditemukan.
                    </td>
                  </tr>
                ) : (
                  allFinance.invoices.map((inv: any) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-800">{inv.invoiceNumber}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{inv.studentName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{inv.studentNim} • {inv.studyProgram}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-700 max-w-xs truncate">{inv.title}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">{formatCurrency(inv.amount)}</td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(inv.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        {inv.status === 'UNPAID' ? (
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setIsPaymentModalOpen(true);
                            }}
                            className="text-xs font-semibold text-icms-academic-blue hover:underline"
                          >
                            Set Lunas (Manual)
                          </button>
                        ) : (
                          <span className="text-[11px] font-semibold text-emerald-600">✓ Terverifikasi</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PAYMENT GATEWAY MODAL */}
      {isPaymentModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Pembayaran Tagihan Online</h3>
              <button 
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-xs text-slate-500 block">Total yang Harus Dibayar</span>
                <span className="text-2xl font-bold font-mono text-icms-navy">
                  {formatCurrency(selectedInvoice.amount)}
                </span>
                <div className="text-xs text-slate-600 mt-1 font-medium">{selectedInvoice.title}</div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Pilih Kanal Pembayaran Host-to-Host</label>
                <div className="space-y-2">
                  {[
                    { id: 'VIRTUAL_ACCOUNT_BCA', label: 'BCA Virtual Account', code: '88001' },
                    { id: 'VIRTUAL_ACCOUNT_MANDIRI', label: 'Mandiri Virtual Account', code: '88002' },
                    { id: 'VIRTUAL_ACCOUNT_BNI', label: 'BNI Virtual Account', code: '88003' },
                    { id: 'QRIS', label: 'QRIS Real-Time (GoPay, OVO, Dana, LinkAja)', code: 'QRIS' },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-icms-academic-blue bg-blue-50/50 text-icms-navy'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment_method"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-icms-academic-blue"
                        />
                        <span className="text-xs font-bold text-slate-800">{method.label}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {method.code}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Pembayaran Sandbox Terintegrasi
                </div>
                <p>Klik tombol di bawah untuk menyimulasikan notifikasi sukses pembayaran dari bank host-to-host.</p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleProcessPayment}
                  disabled={payMutation.isPending}
                  className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {payMutation.isPending ? 'Memproses...' : 'Konfirmasi & Lunasi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {isReceiptModalOpen && receiptData && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Bukti Pembayaran Sah</h3>
              <p className="text-xs text-slate-500">Universitas Indonesia Mandiri — Biro Administrasi Keuangan</p>
            </div>

            <div className="mt-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-slate-500">No. Referensi:</span>
                <span className="font-bold text-slate-800">{receiptData.referenceNo}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-slate-500">No. Invoice:</span>
                <span className="font-bold text-slate-800">{receiptData.invoice?.invoiceNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-slate-500">Peruntukan:</span>
                <span className="font-bold text-slate-800 text-right">{receiptData.invoice?.title}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-600">LUNAS (PAID)</span>
              </div>
              <div className="flex justify-between py-1 text-sm font-bold text-slate-900 pt-1">
                <span>Total Bayar:</span>
                <span>{formatCurrency(receiptData.invoice?.amount || 0)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-5 border-t border-slate-100 mt-4">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Cetak Struk
              </button>
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="px-5 py-2 text-xs font-bold bg-icms-navy hover:bg-slate-800 text-white rounded-xl shadow-xs transition-colors"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
