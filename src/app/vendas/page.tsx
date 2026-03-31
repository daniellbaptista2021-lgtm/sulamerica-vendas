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
    proposta: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    analise: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    aprovada: 'bg-green-500/10 text-green-400 border-green-500/20',
    recusada: 'bg-red-500/10 text-red-400 border-red-500/20',
    cancelada: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-400" />
            Minhas Vendas
          </h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg px-3 py-2 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Nova Venda
        </button>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        {/* Sales List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sales.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">Nenhuma venda registrada</p>
            <button onClick={() => setShowForm(true)} className="text-blue-400 text-sm mt-2 hover:underline">
              Registrar primeira venda
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sales.map((sale: any) => (
              <div key={sale.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{sale.client_name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {sale.client_age ? `${sale.client_age} anos` : ''}
                      {sale.client_phone ? ` | ${sale.client_phone}` : ''}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {sale.coverages?.map((c: string) => (
                        <span key={c} className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full border ${statusColor[sale.status] || ''}`}>
                      {sale.status}
                    </span>
                    {sale.monthly_premium && (
                      <p className="text-sm font-semibold text-green-400 mt-1">
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
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-800">
                  {['proposta', 'analise', 'aprovada', 'recusada', 'cancelada'].map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(sale.id, s)}
                      className={`text-[10px] px-2 py-1 rounded ${
                        sale.status === s
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {s}
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-12 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Nova Venda</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Nome do Cliente *</label>
                <input
                  required value={form.client_name}
                  onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">CPF</label>
                  <input
                    value={form.client_cpf}
                    onChange={e => setForm(f => ({ ...f, client_cpf: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Idade</label>
                  <input
                    type="number" value={form.client_age}
                    onChange={e => setForm(f => ({ ...f, client_age: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Telefone</label>
                  <input
                    value={form.client_phone}
                    onChange={e => setForm(f => ({ ...f, client_phone: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Email</label>
                  <input
                    type="email" value={form.client_email}
                    onChange={e => setForm(f => ({ ...f, client_email: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Coverages */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Coberturas</label>
                <div className="flex flex-wrap gap-1.5">
                  {COVERAGES.map(c => (
                    <button
                      key={c} type="button"
                      onClick={() => toggleCoverage(c)}
                      className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
                        form.coverages.includes(c)
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Capital Segurado (R$)</label>
                  <input
                    type="number" value={form.capital}
                    onChange={e => setForm(f => ({ ...f, capital: e.target.value }))}
                    placeholder="200000"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Premio Mensal (R$)</label>
                  <input
                    type="number" step="0.01" value={form.monthly_premium}
                    onChange={e => setForm(f => ({ ...f, monthly_premium: e.target.value }))}
                    placeholder="89.90"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Pagamento</label>
                <select
                  value={form.payment_method}
                  onChange={e => setForm(f => ({ ...f, payment_method: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Selecione</option>
                  {PAYMENT_METHODS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Observacoes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit" disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-medium rounded-lg px-4 py-2.5 text-sm flex items-center justify-center gap-2"
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
