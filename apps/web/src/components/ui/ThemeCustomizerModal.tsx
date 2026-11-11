import React, { useState, useEffect } from 'react';
import {
  X,
  Palette,
  Check,
  Building2,
  Sparkles,
  Layout,
  Sliders,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';

export interface ThemeConfig {
  palette: 'NAVY_BLUE' | 'EMERALD_MINT' | 'CRIMSON_MAROON' | 'SAPPHIRE_INDIGO';
  universityName: string;
  accreditation: string;
  sidebarMode: 'EXPANDED' | 'SLIM';
}

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeChange?: (theme: ThemeConfig) => void;
}

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  palette: 'NAVY_BLUE',
  universityName: 'UNIVERSITAS INDONESIA MANDIRI',
  accreditation: 'Akreditasi Unggul (BAN-PT)',
  sidebarMode: 'EXPANDED',
};

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  onClose,
  onThemeChange,
}) => {
  if (!isOpen) return null;

  const [config, setConfig] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem('icms_theme_config');
      return saved ? JSON.parse(saved) : DEFAULT_THEME_CONFIG;
    } catch {
      return DEFAULT_THEME_CONFIG;
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const palettes = [
    {
      id: 'NAVY_BLUE',
      name: 'Royal Navy & Blue',
      desc: 'Standar resmi institusi pendidikan tinggi terkemuka',
      primary: '#17233F',
      accent: '#2563EB',
      preview: 'from-slate-900 to-blue-700',
    },
    {
      id: 'EMERALD_MINT',
      name: 'Emerald & Mint',
      desc: 'Nuansa hijau kampus lestari, segar & harmonis',
      primary: '#064E3B',
      accent: '#10B981',
      preview: 'from-emerald-950 to-teal-600',
    },
    {
      id: 'CRIMSON_MAROON',
      name: 'Crimson & Gold',
      desc: 'Wibawa akademik klasik, prestisius & elegan',
      primary: '#7F1D1D',
      accent: '#F59E0B',
      preview: 'from-rose-950 to-amber-600',
    },
    {
      id: 'SAPPHIRE_INDIGO',
      name: 'Sapphire & Indigo',
      desc: 'Modern teknologi mutakhir, futuristik & berfokus data',
      primary: '#1E1B4B',
      accent: '#6366F1',
      preview: 'from-indigo-950 to-indigo-600',
    },
  ];

  const handleSave = () => {
    localStorage.setItem('icms_theme_config', JSON.stringify(config));
    if (onThemeChange) {
      onThemeChange(config);
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    setConfig(DEFAULT_THEME_CONFIG);
    localStorage.setItem('icms_theme_config', JSON.stringify(DEFAULT_THEME_CONFIG));
    if (onThemeChange) {
      onThemeChange(DEFAULT_THEME_CONFIG);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Kustomisasi Tampilan & Identitas</h2>
              <p className="text-xs text-slate-500">
                Sesuaikan tema warna, nama kampus, dan tata letak navigasi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Palette Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Pilihan Skema Warna Kampus
            </label>
            <div className="grid grid-cols-2 gap-3">
              {palettes.map((p) => {
                const isSelected = config.palette === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setConfig({ ...config, palette: p.id as any })}
                    className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/30 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-4 h-4 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: p.primary }}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: p.accent }}
                        />
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-3" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{p.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{p.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Institutional Identity */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Identitas Institusi & Akreditasi
            </label>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Nama Perguruan Tinggi
              </label>
              <input
                type="text"
                value={config.universityName}
                onChange={(e) => setConfig({ ...config, universityName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="UNIVERSITAS INDONESIA MANDIRI"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Status Akreditasi Institusi
              </label>
              <input
                type="text"
                value={config.accreditation}
                onChange={(e) => setConfig({ ...config, accreditation: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Akreditasi Unggul (BAN-PT)"
              />
            </div>
          </div>

          {/* Layout Mode */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Mode Tata Letak Sidebar Navigasi
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfig({ ...config, sidebarMode: 'EXPANDED' })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  config.sidebarMode === 'EXPANDED'
                    ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Expanded (256px)</span>
                  {config.sidebarMode === 'EXPANDED' && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500">Ikon dan teks menu terlihat lengkap</p>
              </button>

              <button
                type="button"
                onClick={() => setConfig({ ...config, sidebarMode: 'SLIM' })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  config.sidebarMode === 'SLIM'
                    ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Slim Mini (72px)</span>
                  {config.sidebarMode === 'SLIM' && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500">Hanya ikon dengan ruang kerja luas</p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Default
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Tersimpan!
                </>
              ) : (
                'Terapkan Tema'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

