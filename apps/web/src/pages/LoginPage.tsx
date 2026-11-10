import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('AdminPassword123!');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      await login(identifier, password);
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login gagal. Periksa username dan password.');
    } finally {
      setSubmitting(false);
    }
  };

  const setCredentials = (user: string, pass: string) => {
    setIdentifier(user);
    setPassword(pass);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-icms-deep-navy via-slate-900 to-icms-academic-blue flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
        {/* Header Header */}
        <div className="bg-icms-navy p-6 text-white text-center border-b border-slate-800">
          <div className="w-12 h-12 mx-auto rounded-xl bg-icms-academic-blue border border-icms-gold/40 flex items-center justify-center font-bold text-xl text-white shadow-md mb-3">
            I
          </div>
          <h1 className="text-xl font-bold tracking-tight">ICMS CAMPUS SUITE</h1>
          <p className="text-xs text-icms-gold font-medium uppercase tracking-wider mt-0.5">
            Enterprise University Management Platform
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Username / Email / NIM / NIDN
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Masukkan username atau email"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-icms-academic-blue focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-icms-academic-blue focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 bg-icms-navy hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Kredensial...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Sistem</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="pt-4 border-t border-slate-100">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
              Pilih Akun Demo (1-Click Fill)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setCredentials('admin', 'AdminPassword123!')}
                className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all"
              >
                <div className="text-[11px] font-bold text-icms-navy">Admin</div>
                <div className="text-[9px] text-slate-500">Super Admin</div>
              </button>

              <button
                type="button"
                onClick={() => setCredentials('rektor', 'RektorPassword123!')}
                className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all"
              >
                <div className="text-[11px] font-bold text-icms-academic-blue">Rektor</div>
                <div className="text-[9px] text-slate-500">Pimpinan UIM</div>
              </button>

              <button
                type="button"
                onClick={() => setCredentials('dosen', 'DosenPassword123!')}
                className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all"
              >
                <div className="text-[11px] font-bold text-amber-700">Dosen</div>
                <div className="text-[9px] text-slate-500">Pengajar & PA</div>
              </button>

              <button
                type="button"
                onClick={() => setCredentials('mahasiswa', 'MahasiswaPassword123!')}
                className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all"
              >
                <div className="text-[11px] font-bold text-emerald-700">Mahasiswa</div>
                <div className="text-[9px] text-slate-500">Portal Belajar</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Argon2id + JWT Encrypted</span>
          </div>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
};

