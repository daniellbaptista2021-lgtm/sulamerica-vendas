'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { BarChart3, TrendingUp, DollarSign, Users, CheckCircle, Clock, XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

interface Stats {
  totalSales: number;
  approved: number;
  pending: number;
  rejected: number;
  cancelled: number;
  totalPremium: number;
  totalCapital: number;
  conversionRate: string;
}

interface MonthlyData {
  month: string;
  total: number;
  approved: number;
  premium: number;
}

interface DashboardData {
  stats: Stats;
  monthlyData: MonthlyData[];
  recentSales: any[];
  topSellers: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('vendedor');
  const router = useRouter();

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    const res = await fetch('/api/dashboard', {
      headers: { 'x-user-id': user.id },
    });
    const json = await res.json();
    setData(json);
    setUserRole(json.role || 'vendedor');
    setLoading(false);
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const statusColor: Record<string, string> = {
    proposta: 'bg-yellow-500/10 text-yellow-400',
    analise: 'bg-blue-500/10 text-blue-400',
    aprovada: 'bg-green-500/10 text-green-400',
    recusada: 'bg-red-500/10 text-red-400',
    cancelada: 'bg-gray-500/10 text-gray-400',
  };

  const statusLabel: Record<string, string> = {
    proposta: 'Proposta',
    analise: 'Analise',
    aprovada: 'Aprovada',
    recusada: 'Recusada',
    cancelada: 'Cancelada',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a1628] to-blue-950 flex items-center justify-center">
        <div className="relative">
          <div className="w-10 h-10 border-2 border-[#0054a6] border-t-[#f58220] rounded-full animate-spin" />
          <div className="absolute inset-0 w-10 h-10 rounded-full animate-pulse-glow" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const maxBar = Math.max(...data.monthlyData.map(m => m.total), 1);

  const statsCards = [
    { label: 'Total Vendas', value: data.stats.totalSales, icon: Users, color: 'from-[#0054a6] to-[#1a7fd4]', textColor: 'text-white' },
    { label: 'Aprovadas', value: data.stats.approved, icon: CheckCircle, color: 'from-emerald-600 to-emerald-400', textColor: 'text-emerald-400' },
    { label: 'Pendentes', value: data.stats.pending, icon: Clock, color: 'from-[#f58220] to-amber-400', textColor: 'text-[#f58220]' },
    { label: 'Conversao', value: `${data.stats.conversionRate}%`, icon: TrendingUp, color: 'from-[#0054a6] to-[#f58220]', textColor: 'text-[#1a7fd4]' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a1628] to-blue-950 text-white">
      {/* Header */}
      <header className="glass-strong sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#0054a6] via-[#1a7fd4] to-[#f58220]" />
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0054a6] to-[#1a7fd4] flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-xs text-gray-500">{userRole === 'admin' || userRole === 'supervisor' ? 'Visao geral da equipe' : 'Suas vendas'}</p>
          </div>
        </div>
        <button onClick={loadDashboard} className="glass rounded-lg p-2 text-gray-400 hover:text-white transition-colors hover:border-[#0054a6]/30">
          <RefreshCw className="w-4 h-4" />
        </button>
      </header>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statsCards.map((card, i) => (
            <div
              key={card.label}
              className="glass rounded-xl p-4 animate-fade-in-up group hover:border-[#0054a6]/30 transition-all duration-300"
              style={{ animationDelay: `${i * 80}ms`, opacity: 0 }}
            >
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                  <card.icon className="w-3 h-3 text-white" />
                </div>
                {card.label}
              </div>
              <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Premium & Capital */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div
            className="glass rounded-xl p-4 animate-fade-in-up hover:border-emerald-500/20 transition-all duration-300"
            style={{ animationDelay: '320ms', opacity: 0 }}
          >
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center">
                <DollarSign className="w-3 h-3 text-white" />
              </div>
              Premio Mensal Total
            </div>
            <p className="text-xl font-bold text-emerald-400">{formatCurrency(data.stats.totalPremium)}</p>
          </div>
          <div
            className="glass rounded-xl p-4 animate-fade-in-up hover:border-[#0054a6]/30 transition-all duration-300"
            style={{ animationDelay: '400ms', opacity: 0 }}
          >
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#0054a6] to-[#f58220] flex items-center justify-center">
                <DollarSign className="w-3 h-3 text-white" />
              </div>
              Capital Segurado Total
            </div>
            <p className="text-xl font-bold">{formatCurrency(data.stats.totalCapital)}</p>
          </div>
        </div>

        {/* Monthly Chart */}
        <div
          className="glass rounded-xl p-5 animate-fade-in-up"
          style={{ animationDelay: '480ms', opacity: 0 }}
        >
          <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#0054a6] to-[#f58220]" />
            Vendas por Mes
          </h2>
          <div className="flex items-end gap-2 h-40">
            {data.monthlyData.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500 font-medium">{m.total}</span>
                <div className="w-full flex flex-col gap-0.5">
                  <div
                    className="w-full rounded-t-md relative overflow-hidden"
                    style={{
                      height: `${(m.total / maxBar) * 120}px`,
                      background: 'rgba(0, 84, 166, 0.15)',
                    }}
                  >
                    <div
                      className="w-full rounded-t-md absolute bottom-0"
                      style={{
                        height: `${m.total > 0 ? (m.approved / m.total) * 100 : 0}%`,
                        background: 'linear-gradient(to top, #0054a6, #1a7fd4)',
                      }}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-gray-500">{m.month}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-[10px] text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded" style={{ background: 'linear-gradient(to top, #0054a6, #1a7fd4)' }} /> Aprovadas
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-[#0054a6]/20" /> Total
            </div>
          </div>
        </div>

        {/* Recent Sales */}
        <div
          className="glass rounded-xl p-5 animate-fade-in-up"
          style={{ animationDelay: '560ms', opacity: 0 }}
        >
          <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#0054a6] to-[#f58220]" />
            Vendas Recentes
          </h2>
          {data.recentSales.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Nenhuma venda registrada ainda.</p>
          ) : (
            <div className="space-y-2">
              {data.recentSales.map((sale: any, idx: number) => (
                <div
                  key={sale.id}
                  className="glass rounded-lg p-3 flex items-center justify-between hover:bg-white/[0.04] hover:border-[#0054a6]/20 transition-all duration-300 cursor-default"
                >
                  <div>
                    <p className="text-sm font-medium">{sale.client_name}</p>
                    <p className="text-xs text-gray-500">
                      {sale.plan_type} - {sale.coverages?.join(', ') || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full ${statusColor[sale.status] || ''}`}>
                      {statusLabel[sale.status] || sale.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {sale.monthly_premium ? formatCurrency(parseFloat(sale.monthly_premium)) + '/mes' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Sellers (admin only) */}
        {data.topSellers.length > 0 && (
          <div
            className="glass rounded-xl p-5 animate-fade-in-up"
            style={{ animationDelay: '640ms', opacity: 0 }}
          >
            <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#f58220] to-amber-400" />
              Top Vendedores
            </h2>
            <div className="space-y-2">
              {data.topSellers.map((seller: any, i: number) => (
                <div
                  key={seller.id}
                  className="glass rounded-lg p-3 flex items-center justify-between hover:bg-white/[0.04] hover:border-[#f58220]/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        background: i === 0
                          ? 'linear-gradient(135deg, #f58220, #f5a623)'
                          : i === 1
                          ? 'linear-gradient(135deg, #94a3b8, #cbd5e1)'
                          : i === 2
                          ? 'linear-gradient(135deg, #b45309, #d97706)'
                          : 'linear-gradient(135deg, #0054a6, #1a7fd4)',
                      }}
                    >
                      #{i + 1}
                    </span>
                    <p className="text-sm font-medium">{seller.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{seller.count} vendas</p>
                    <p className="text-xs text-gray-500">{formatCurrency(seller.premium)}/mes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
