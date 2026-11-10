import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { StatCard } from '../components/ui/StatCard';
import { 
  FlaskConical, 
  Award, 
  BookOpen, 
  DollarSign, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Clock,
  ExternalLink
} from 'lucide-react';

export const ResearchLppmPage: React.FC = () => {
  const { data: researchData, isLoading } = useQuery({
    queryKey: ['research-lppm'],
    queryFn: async () => {
      const res = await api.get('/management/research');
      return res.data;
    },
  });

  const proposals: any[] = researchData?.proposals || [];
  const stats = researchData?.stats;

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Tridharma Perguruan Tinggi
            </span>
            <span className="text-xs text-slate-300 font-medium">Lembaga Penelitian & Pengabdian Masyarakat (LPPM)</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Penelitian, Hibah Riset & Publikasi Ilmiah
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Pusat pengelolaan proposal riset dosen, pemantauan dana hibah eksternal/internal, serta repositori luaran jurnal terindeks Scopus dan Sinta.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Dana Hibah Riset"
          value={formatIDR(stats?.totalFundingIDR || 1850000000)}
          subtitle="Tahun Anggaran 2026"
          icon={DollarSign}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Proposal Riset Aktif"
          value={stats?.activeGrants || 14}
          subtitle="Proyek Riset Berjalan"
          icon={FlaskConical}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Publikasi Scopus"
          value={stats?.scopusIndexed || 42}
          subtitle="Artikel Jurnal Q1 & Q2"
          icon={BookOpen}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Jurnal Nasional Sinta"
          value={stats?.sinta12Indexed || 68}
          subtitle="Akreditasi Sinta 1 & 2"
          icon={Award}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Research Proposals Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-icms-navy">Daftar Proyek Penelitian & Pengabdian Berjalan</h3>
            <p className="text-xs text-slate-500 mt-0.5">Pemantauan progres dan pencapaian target luaran penelitian dosen.</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {proposals.length} Riset
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {proposals.map((res) => (
            <div key={res.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {res.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{res.scheme}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    res.status === 'ONGOING' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {res.status === 'ONGOING' ? 'BERJALAN' : 'SELESAI'}
                  </span>
                </div>

                <h4 className="font-bold text-base text-slate-900 leading-snug">{res.title}</h4>
                <p className="text-xs text-slate-600">
                  Ketua Peneliti: <strong className="text-slate-800">{res.leadResearcher}</strong>
                </p>

                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">Target Luaran:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {res.outputs?.map((out: string, idx: number) => (
                      <span key={idx} className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        ✓ {out}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-slate-400 block">Total Dana Disetujui</span>
                <span className="text-lg font-bold font-mono text-emerald-700 block">
                  {formatIDR(res.funding)}
                </span>
                <span className="text-[11px] text-slate-400">Tahun Pelaksanaan: {res.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

