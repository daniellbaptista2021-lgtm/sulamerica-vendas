'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { LogIn, Eye, EyeOff, Shield } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Email ou senha incorretos. Tente novamente.');
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <>
      {/* Global keyframes */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(-3deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-15px) rotate(8deg) scale(1.05); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(40px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 84, 166, 0.3), 0 0 60px rgba(0, 84, 166, 0.1); }
          50% { box-shadow: 0 0 30px rgba(0, 84, 166, 0.5), 0 0 80px rgba(0, 84, 166, 0.2); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in-up-delay {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
          opacity: 0;
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .login-btn-gradient {
          background: linear-gradient(135deg, #0054a6 0%, #0070d4 40%, #f58220 100%);
          background-size: 200% 200%;
          transition: all 0.4s ease;
        }
        .login-btn-gradient:hover {
          background-position: 100% 50%;
          transform: translateY(-1px);
          box-shadow: 0 8px 30px rgba(0, 84, 166, 0.4), 0 4px 15px rgba(245, 130, 32, 0.2);
        }
        .login-btn-gradient:active {
          transform: translateY(0px);
        }
        .input-glass {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s ease;
        }
        .input-glass:focus {
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(0, 84, 166, 0.5);
          box-shadow: 0 0 0 3px rgba(0, 84, 166, 0.15), 0 0 20px rgba(0, 84, 166, 0.1);
        }
        .brand-text-gradient {
          background: linear-gradient(135deg, #ffffff 0%, #93c5fd 50%, #f58220 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">

        {/* Geometric background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />

        {/* Floating shapes */}
        <div className="absolute top-[10%] left-[8%] w-72 h-72 rounded-full bg-blue-500/[0.07] blur-3xl animate-float-slow" />
        <div className="absolute bottom-[15%] right-[10%] w-96 h-96 rounded-full bg-[#0054a6]/[0.08] blur-3xl animate-float-medium" />
        <div className="absolute top-[50%] left-[60%] w-48 h-48 rounded-full bg-[#f58220]/[0.05] blur-3xl animate-float-fast" />

        {/* Abstract geometric accents */}
        <div className="absolute top-[15%] right-[20%] w-20 h-20 border border-white/[0.04] rounded-2xl rotate-12 animate-float-medium" />
        <div className="absolute bottom-[25%] left-[15%] w-14 h-14 border border-[#0054a6]/[0.08] rounded-xl -rotate-6 animate-float-slow" />
        <div className="absolute top-[60%] right-[8%] w-10 h-10 border border-[#f58220]/[0.06] rounded-lg rotate-45 animate-float-fast" />

        {/* Spinning ring accent */}
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] animate-spin-slow opacity-[0.02]">
          <div className="w-full h-full rounded-full border-2 border-dashed border-white" />
        </div>

        {/* Main content */}
        <div className="w-full max-w-[420px] relative z-10">

          {/* Logo and branding area */}
          <div className="text-center mb-10 animate-fade-in-up">
            {/* Logo icon with glow */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute inset-0 w-20 h-20 rounded-2xl bg-[#0054a6]/30 blur-xl" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0054a6] to-[#0070d4] flex items-center justify-center shadow-2xl shadow-blue-500/20 animate-pulse-glow">
                <Shield className="w-10 h-10 text-white drop-shadow-lg" />
              </div>
            </div>

            {/* Brand name */}
            <h1 className="text-4xl font-serif font-bold tracking-tight brand-text-gradient mb-2">
              SulAm&eacute;rica
            </h1>
            <p className="text-blue-200/60 text-sm font-light tracking-[0.2em] uppercase mb-1">
              PV Corretora
            </p>
            <p className="text-[#f58220]/70 text-xs font-medium tracking-wider">
              Assist&ecirc;ncia Funeral SulAm&eacute;rica
            </p>
          </div>

          {/* Glass-morphism login card */}
          <div className="animate-fade-in-up-delay">
            <form
              onSubmit={handleLogin}
              className="relative bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 space-y-5 shadow-2xl shadow-black/20"
            >
              {/* Subtle top accent line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Welcome text */}
              <div className="text-center pb-2">
                <h2 className="text-white text-lg font-semibold tracking-tight">
                  Bem-vindo de volta
                </h2>
                <p className="text-white/40 text-sm mt-1">
                  Acesse sua conta para continuar
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 text-sm text-red-300 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Email field */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-blue-200/50 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="input-glass w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none"
                />
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-blue-200/50 uppercase tracking-wider">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="input-glass w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="login-btn-gradient w-full text-white font-semibold rounded-xl px-4 py-3.5 text-sm flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Entrar
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center animate-fade-in-up-delay">
            <p className="text-white/20 text-xs tracking-wide">
              Primeiro acesso? Fale com seu gestor.
            </p>
            <div className="mt-3 flex items-center justify-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-[#0054a6]/40" />
              <div className="w-1 h-1 rounded-full bg-white/10" />
              <div className="w-1 h-1 rounded-full bg-[#f58220]/40" />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
