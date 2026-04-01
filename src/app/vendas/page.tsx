'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X, Save, ShoppingCart } from 'lucide-react';

const COVERAGES = [
  'Morte', 'Morte Acidental', 'IPA', 'Doencas Graves', 'IFPD',
  'DIT', 'DIH', 'DMHO', 'Funeral Individual', 'Morte Conjuge',
];

const PAYMENT_METHODS = ['PIX', 'Cartao de Credito', 'Debito Automatico'];

export default function VendasPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState('');
  const router = useRouter();

  const [form, setForm] = useState({
    client_name: '',
    client_cpf: '',
    client_age: '',
    client_phone: '',
    client_email: '',
    plan_type: 'Vida Flex',
    coverages: [] as string[],
    capital: '',
    monthly_premium: '',
    payment_method: '',
    notes: '',
    status: 'proposta',
  });

  useEffect(() => { loadSales(); }, []);

  async function loadSales() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    setUserId(user.id);

    const res = await fetch('/api/sales', {
      headers: { 'x-user-id': user.id },
    });
    const data = await res.json();
    setSales(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      seller_id: userId,
      client_age: form.client_age ? parseInt(form.client_age) : null,
      capital: form.capital ? parseFloat(form.capital) : null,
      monthly_premium: form.monthly_premium ? parseFloat(form.monthly_premium) : null,
    };

    const res = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowForm(false);
      setForm({
        client_name: '', client_cpf: '', client_age: '', client_phone: '',
        client_email: '', plan_type: 'Vida Flex', coverages: [], capital: '',
        monthly_premium: '', payment_method: '', notes: '', status: 'proposta',
      });
      loadSales();
    }
    setSaving(false);
  }

  async function updateStatus(id: string, status: string) {
    await fetch('/api/sales', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    loadSales();
  }

  function toggleCoverage(c: string) {
    setForm(f => ({
      ...f,
      coverages: f.coverages.includes(c)
        ? f.coverages.filter(x => x !== c)
        : [...f.coverages, c],
    }));
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const statusColor: Record<string, string> = {
    proposta: 'bg-[#f58220]/10 text-[#f58220] border-[#f58220]/20',
    analise: 'bg-[#0054a6]/10 text-[#1a7fd4] border-[#0054a6]/20',
    aprovada: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    recusada: 'bg-red-500/10 text-red-400 border-red-500/20',
    cancelada: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  const statusLabel: Record<string, string> = {
    proposta: 'Proposta',
    analise: 'Analise',
    aprovada: 'Aprovada',
    recusada: 'Recusada',
    cancelada: 'Cancelada',
  };

  const inputClasses = "w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0054a6]/50 input-glow transition-all duration-300";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a1628] to-blue-950 text-white">
      {/* Header */}
      <header className="glass-strong sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#0054a6] via-[#1a7fd4] to-[#f58220]" />
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0054a6] to-[#1a7fd4] flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <span className="gradient-text">Minhas Vendas</span>
          </h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-shine bg-gradient-to-r from-[#0054a6] to-[#1a7fd4] hover:from-[#0054a6] hover:to-[#f58220] text-white text-sm font-medium rounded-lg px-4 py-2 flex items-center gap-1.5 transition-all duration-300 shadow-lg shadow-[#0054a6]/20"
        >
          <Plus className="w-4 h-4" /> Nova Venda
        </button>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        {/* Sales List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="relative">
              <div className="w-8 h-8 border-2 border-[#0054a6] border-t-[#f58220] rounded-full animate-spin" />
              <div className="absolute inset-0 w-8 h-8 rounded-full animate-pulse-glow" />
            </div>
          </div>
        ) : sales.length === 0 ? (
          <div className="text-center py-16 animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0054a6]/20 to-[#f58220]/20 flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-500">Nenhuma venda registrada</p>
            <button onClick={() => setShowForm(true)} className="text-[#1a7fd4] text-sm mt-2 hover:text-[#f58220] transition-colors">
              Registrar primeira venda
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sales.map((sale: any, idx: number) => (
              <div
                key={sale.id}
                className="glass rounded-xl p-4 animate-fade-in-up hover:bg-white/[0.04] hover:border-[#0054a6]/20 transition-all duration-300 group"
                style={{ animationDelay: `${idx * 60}ms`, opacity: 0 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold group-hover:text-[#1a7fd4] transition-colors">{sale.client_name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {sale.client_age ? `${sale.client_age} anos` : ''}
                      {sale.client_phone ? ` | ${sale.client_phone}` : ''}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {sale.coverages?.map((c: string) => (
                        <span key={c} className="text-[10px] bg-[#0054a6]/10 text-[#1a7fd4] px-1.5 py-0.5 rounded border border-[#0054a6]/10">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusColor[sale.status] || ''}`}>
                      {statusLabel[sale.status] || sale.status}
                    </span>
                    {sale.monthly_premium && (
                      <p className="text-sm font-semibold text-emerald-400 mt-1.5">
                        {formatCurrency(parseFloat(sale.monthly_premium))}/mes
                      </p>
                    )}
                    {sale.capital && (
                      <p className="text-[10px] text-gray-500">
                        Capital: {formatCurrency(parseFloat(sale.capital))}
                      </p>
                    )}
                  </div>
                </div>
                {/* Status Actions */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-white/[0.06]">
                  {['proposta', 'analise', 'aprovada', 'recusada', 'cancelada'].map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(sale.id, s)}
                      className={`text-[10px] px-2.5 py-1 rounded-md transition-all duration-200 ${
                        sale.status === s
                          ? 'bg-gradient-to-r from-[#0054a6] to-[#1a7fd4] text-white shadow-md shadow-[#0054a6]/20'
                          : 'glass text-gray-500 hover:text-gray-300 hover:border-white/[0.12]'
                      }`}
                    >
                      {statusLabel[s] || s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Sale Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-start justify-center p-4 pt-12 overflow-y-auto">
          <div
            className="glass-strong rounded-2xl w-full max-w-lg p-6 animate-fade-in-up shadow-2xl shadow-[#0054a6]/10"
            style={{ opacity: 0, animationDelay: '50ms' }}
          >
            {/* Gradient header bar */}
            <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-[#0054a6] via-[#1a7fd4] to-[#f58220]" />

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold gradient-text">Nova Venda</h2>
              <button onClick={() => setShowForm(false)} className="glass rounded-lg p-1.5 text-gray-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-medium">Nome do Cliente *</label>
                <input
                  required value={form.client_name}
                  onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))}
                  className={inputClasses}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1 font-medium">CPF</label>
                  <input
                    value={form.client_cpf}
                    onChange={e => setForm(f => ({ ...f, client_cpf: e.target.value }))}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 font-medium">Idade</label>
                  <input
                    type="number" value={form.client_age}
                    onChange={e => setForm(f => ({ ...f, client_age: e.target.value }))}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1 font-medium">Telefone</label>
                  <input
                    value={form.client_phone}
                    onChange={e => setForm(f => ({ ...f, client_phone: e.target.value }))}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 font-medium">Email</label>
                  <input
                    type="email" value={form.client_email}
                    onChange={e => setForm(f => ({ ...f, client_email: e.target.value }))}
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Coverages */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Coberturas</label>
                <div className="flex flex-wrap gap-1.5">
                  {COVERAGES.map(c => (
                    <button
                      key={c} type="button"
                      onClick={() => toggleCoverage(c)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all duration-200 ${
                        form.coverages.includes(c)
                          ? 'bg-gradient-to-r from-[#0054a6] to-[#1a7fd4] border-[#0054a6]/50 text-white shadow-md shadow-[#0054a6]/20'
                          : 'glass text-gray-400 hover:border-white/[0.15] hover:text-gray-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1 font-medium">Capital Segurado (R$)</label>
                  <input
                    type="number" value={form.capital}
                    onChange={e => setForm(f => ({ ...f, capital: e.target.value }))}
                    placeholder="200000"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 font-medium">Premio Mensal (R$)</label>
                  <input
                    type="number" step="0.01" value={form.monthly_premium}
                    onChange={e => setForm(f => ({ ...f, monthly_premium: e.target.value }))}
                    placeholder="89.90"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1 font-medium">Pagamento</label>
                <select
                  value={form.payment_method}
                  onChange={e => setForm(f => ({ ...f, payment_method: e.target.value }))}
                  className={inputClasses}
                >
                  <option value="">Selecione</option>
                  {PAYMENT_METHODS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1 font-medium">Observacoes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  className={`${inputClasses} resize-none`}
                />
              </div>

              <button
                type="submit" disabled={saving}
                className="w-full btn-shine bg-gradient-to-r from-[#0054a6] to-[#1a7fd4] hover:from-[#0054a6] hover:to-[#f58220] disabled:opacity-50 text-white font-medium rounded-lg px-4 py-2.5 text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-[#0054a6]/20"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Save className="w-4 h-4" /> Salvar Venda</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
