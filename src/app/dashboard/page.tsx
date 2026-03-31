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

    // Get profile for role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role || 'vendedor';
    setUserRole(role);

    const res = await fetch('/api/dashboard', {
      headers: {
        'x-user-id': user.id,
        'x-user-role': role,
      },
    });
    const json = await res.json();
    setData(json);
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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const maxBar = Math.max(...data.monthlyData.map(m => m.total), 1);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Dashboard
            </h1>
            <p className="text-xs text-gray-500">{userRole === 'admin' || userRole === 'supervisor' ? 'Visao geral da equipe' : 'Suas vendas'}</p>
          </div>
        </div>
        <button onClick={loadDashboard} className="text-gray-400 hover:text-white p-2">
          <RefreshCw className="w-4 h-4" />
        </button>
      </header>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <Users className="w-3.5 h-3.5" /> Total Vendas
            </div>
            <p className="text-2xl font-bold">{data.stats.totalSales}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-green-400 text-xs mb-1">
              <CheckCircle className="w-3.5 h-3.5" /> Aprovadas
            </div>
            <p className="text-2xl font-bold text-green-400">{data.stats.approved}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-yellow-400 text-xs mb-1">
              <Clock className="w-3.5 h-3.5" /> Pendentes
            </div>
            <p className="text-2xl font-bold text-yellow-400">{data.stats.pending}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-400 text-xs mb-1">
              <TrendingUp className="w-3.5 h-3.5" /> Conversao
            </div>
            <p className="text-2xl font-bold text-blue-400">{data.stats.conversionRate}%</p>
          </div>
        </div>

        {/* Premium & Capital */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <DollarSign className="w-3.5 h-3.5" /> Premio Mensal Total
            </div>
            <p className="text-xl font-bold text-green-400">{formatCurrency(data.stats.totalPremium)}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <DollarSign className="w-3.5 h-3.5" /> Capital Segurado Total
            </div>
            <p className="text-xl font-bold">{formatCurrency(data.stats.totalCapital)}</p>
          </div>
        </div>

        {/* Monthly Chart (simple bar chart) */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Vendas por Mes</h2>
          <div className="flex items-end gap-2 h-40">
            {data.monthlyData.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500">{m.total}</span>
                <div className="w-full flex flex-col gap-0.5">
                  <div
                    className="w-full bg-blue-500/30 rounded-t"
                    style={{ height: `${(m.total / maxBar) * 120}px` }}
                  >
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${m.total > 0 ? (m.approved / m.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-gray-500">{m.month}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-[10px] text-gray-500">
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded" /> Aprovadas</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500/30 rounded" /> Total</div>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-300 mb-3">Vendas Recentes</h2>
          {data.recentSales.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Nenhuma venda registrada ainda.</p>
          ) : (
            <div className="space-y-2">
              {data.recentSales.map((sale: any) => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{sale.client_name}</p>
                    <p className="text-xs text-gray-500">
                      {sale.plan_type} - {sale.coverages?.join(', ') || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[sale.status] || ''}`}>
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
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-gray-300 mb-3">Top Vendedores</h2>
            <div className="space-y-2">
              {data.topSellers.map((seller: any, i: number) => (
                <div key={seller.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-blue-400 w-6">#{i + 1}</span>
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
