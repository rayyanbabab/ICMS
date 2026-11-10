import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Layers, ArrowLeft, ShieldAlert } from 'lucide-react';

export const ModulePlaceholderPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-icms-academic-blue/10 text-icms-academic-blue flex items-center justify-center mb-4">
        <Layers className="w-8 h-8" />
      </div>

      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-3">
        Dalam Tahap Perencanaan & Pengembangan
      </span>

      <h1 className="text-xl font-bold text-icms-navy">
        Modul: <span className="font-mono text-icms-academic-blue">{path}</span>
      </h1>

      <p className="text-xs text-slate-500 max-w-lg mx-auto mt-2 leading-relaxed">
        Sesuai dengan <strong>Master Blueprint & Development Instructions</strong>, modul ini masuk ke dalam fase
        pengembangan berjenjang (Phase 1 s/d Phase 6). Skema basis data domain dan kontrak REST API telah dipersiapkan
        di dalam Prisma Schema dan Shared Package.
      </p>

      <div className="mt-8 flex justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-icms-navy hover:bg-slate-800 text-white text-xs font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

