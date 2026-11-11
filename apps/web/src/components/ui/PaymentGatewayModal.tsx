import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  CreditCard,
  Building2,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ExternalLink,
  Smartphone,
} from 'lucide-react';
import { api } from '../../services/api';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    id: string;
    invoiceNumber: string;
    title: string;
    amount: number;
    dueDate: string;
  };
  onSuccess: () => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [paymentChannel, setPaymentChannel] = useState<'QRIS' | 'VA_BCA' | 'VA_MANDIRI' | 'VA_BNI' | 'VA_BRI'>('QRIS');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(899); // 14:59 min

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getVaNumber = () => {
    switch (paymentChannel) {
      case 'VA_BCA': return '88001' + invoice.invoiceNumber.replace(/\D/g, '').slice(-8);
      case 'VA_MANDIRI': return '88002' + invoice.invoiceNumber.replace(/\D/g, '').slice(-8);
      case 'VA_BNI': return '88003' + invoice.invoiceNumber.replace(/\D/g, '').slice(-8);
      case 'VA_BRI': return '88004' + invoice.invoiceNumber.replace(/\D/g, '').slice(-8);
      default: return '88001202611001';
    }
  };

  const handleCopyVa = () => {
    navigator.clipboard.writeText(getVaNumber());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecutePayment = async () => {
    setIsProcessing(true);
    try {
      await api.post(`/finance/invoices/${invoice.id}/pay`, {
        paymentMethod: paymentChannel,
      });
      setIsProcessing(false);
      onSuccess();
      onClose();
    } catch {
      setIsProcessing(false);
      // Fallback close and notify
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold shadow-md">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base font-heading">Portal Pembayaran Terpadu (PGW)</h3>
              <p className="text-[11px] text-slate-300">Host-to-Host Virtual Account & QRIS Nasional</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Summary Banner */}
        <div className="bg-blue-50/70 border-b border-blue-100 p-4 px-6 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Tagihan: {invoice.title}</span>
            <span className="text-xl sm:text-2xl font-extrabold text-blue-900 font-mono">
              {formatCurrency(invoice.amount)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Batas Pembayaran</span>
            <div className="inline-flex items-center gap-1 text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Channel Selector Tabs */}
        <div className="p-5 sm:p-6 space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Pilih Kanal Pembayaran Online</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'QRIS', label: 'QRIS Realtime', icon: QrCode, badge: 'Semua Bank / E-Wallet' },
                { id: 'VA_BCA', label: 'BCA Virtual Account', icon: Building2, badge: 'Otomatis' },
                { id: 'VA_MANDIRI', label: 'Mandiri VA', icon: Building2, badge: 'Otomatis' },
                { id: 'VA_BNI', label: 'BNI Virtual Account', icon: Building2, badge: 'Otomatis' },
                { id: 'VA_BRI', label: 'BRI Virtual Account', icon: Building2, badge: 'Otomatis' },
              ].map((ch) => {
                const Icon = ch.icon;
                const isSelected = paymentChannel === ch.id;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setPaymentChannel(ch.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
                      <span className="text-xs font-bold text-slate-900 block truncate">{ch.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">{ch.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Channel Content Details */}
          {paymentChannel === 'QRIS' ? (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                <Smartphone className="w-3 h-3" />
                <span>Pindai menggunakan aplikasi Mobile Banking atau E-Wallet</span>
              </div>

              {/* QR Barcode Graphic */}
              <div className="w-44 h-44 mx-auto p-2.5 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center relative group">
                <QrCode className="w-36 h-36 text-slate-900" />
                <div className="absolute inset-x-0 bottom-1 text-[9px] font-mono font-bold text-slate-400 uppercase">
                  QRIS STANDAR NASIONAL
                </div>
              </div>

              <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                Buka GoPay, OVO, Dana, ShopeePay, BCA Mobile, Livin, atau Wondr lalu scan kode QR di atas.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-[11px] font-semibold text-slate-500 block">Nomor Rekening Virtual Account:</span>
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-base sm:text-lg font-mono font-extrabold text-blue-700 tracking-wider">
                  {getVaNumber()}
                </span>
                <button
                  type="button"
                  onClick={handleCopyVa}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
              <ul className="text-[11px] text-slate-500 space-y-1 list-disc pl-4">
                <li>Masukkan kartu ATM / buka aplikasi m-Banking.</li>
                <li>Pilih menu <strong>Transfer &gt; Virtual Account</strong>.</li>
                <li>Masukkan nomor VA di atas dan pastikan nama penerima adalah nama Anda.</li>
              </ul>
            </div>
          )}

          {/* Simulation & Payment Action */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Tutup
            </button>

            <button
              type="button"
              onClick={handleExecutePayment}
              disabled={isProcessing}
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Pelunasan Kas...</span>
                </>
              ) : (
                <>
                  <span>Simulasikan Pelunasan Sah</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Security Footer */}
        <div className="bg-slate-50 px-6 py-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Secured Payment Switch</span>
          </div>
          <span>Biro Administrasi Keuangan (BAUK)</span>
        </div>
      </div>
    </div>
  );
};

