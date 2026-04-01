'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface CotacaoResult {
  plano: string;
  base: number;
  extras: { label: string; valor: number }[];
  total: number;
  whatsappText: string;
}

export function CotacaoModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [conjuge, setConjuge] = useState(false);
  const [filhos, setFilhos] = useState<number[]>([]);
  const [novaIdadeFilho, setNovaIdadeFilho] = useState('');
  const [pais, setPais] = useState(false);
  const [sogros, setSogros] = useState(false);
  const [dependentesExtras, setDependentesExtras] = useState('0');
  const [result, setResult] = useState<CotacaoResult | null>(null);
  const [copied, setCopied] = useState(false);

  const addFilho = () => {
    const age = parseInt(novaIdadeFilho);
    if (!isNaN(age) && age >= 0 && age <= 100) {
      setFilhos([...filhos, age]);
      setNovaIdadeFilho('');
    }
  };

  const removeFilho = (index: number) => {
    setFilhos(filhos.filter((_, i) => i !== index));
  };

  const calcular = () => {
    const idadeTitular = parseInt(idade);
    if (isNaN(idadeTitular) || idadeTitular > 74) return;

    const plans: Record<string, { nome: string; base: number }> = {
      individual: { nome: 'Individual', base: 29.90 },
      casal: { nome: 'Titular + C\u00F4njuge', base: 59.90 },
      familiar: { nome: 'Familiar', base: 59.90 },
      ampliado: { nome: 'Familiar Ampliado', base: 89.90 },
    };

    const filhosMenores = filhos.filter(a => a <= 21);
    const filhosMaiores = filhos.filter(a => a > 21);
    const depExtras = parseInt(dependentesExtras) || 0;

    let planoKey = 'individual';
    if (pais || sogros) planoKey = 'ampliado';
    else if (conjuge && filhosMenores.length > 0) planoKey = 'familiar';
    else if (conjuge) planoKey = 'casal';
    else if (filhosMenores.length > 0) planoKey = 'familiar';

    const plano = plans[planoKey];
    let total = plano.base;
    const extras: { label: string; valor: number }[] = [];

    if (filhosMaiores.length > 0) {
      const extra = filhosMaiores.length * 8;
      total += extra;
      extras.push({ label: filhosMaiores.length + ' filho(s) acima de 21 anos', valor: extra });
    }

    if (depExtras > 0) {
      const extra = depExtras * 10;
      total += extra;
      extras.push({ label: depExtras + ' dependente(s) extra(s)', valor: extra });
    }

    // Build WhatsApp message
    const extrasText = extras.length > 0
      ? extras.map(e => '   * ' + e.label + ': +R$ ' + e.valor.toFixed(2).replace('.', ',')).join('\n')
      : '';
    const whatsappParts: string[] = [
      '*ASSISTENCIA FUNERAL SULAMERICA*',
      '--------------------',
      '',
      '*Cliente:* ' + (nome || 'Nao informado'),
      '*Idade:* ' + idadeTitular + ' anos',
      '',
      '*Plano:* ' + plano.nome,
      '*Valor:* R$ ' + total.toFixed(2).replace('.', ',') + '/mes',
    ];
    if (extrasText) {
      whatsappParts.push('', '*Adicionais:*', extrasText);
    }
    whatsappParts.push(
      '',
      '*O que esta incluso:*',
      '  - Assistencia Funeral completa (todo Brasil)',
      '  - Telemedicina 24h (ate 4 dependentes)',
      '  - Desconto em farmacias (ate 70%)',
      '  - R$ 50.000 por morte acidental',
      '  - Rede de Saude com ate 90% de desconto',
      '  - Sorteios mensais de R$ 5.000',
      '  - Clube de Vantagens SulA Mais',
      '',
      '*Formas de pagamento:*',
      '  PIX | Cartao | Debito | Boleto',
      '  *Sem taxa de adesao!*',
      '',
      '*Como funciona:*',
      '  1. Envio a proposta para voce analisar',
      '  2. Voce revisa tudo com calma',
      '  3. So paga depois de aprovar',
      '  4. Acesso ao Portal SulAmerica',
      '',
      'SulAmerica - Mais de 125 anos protegendo familias',
      '_A familia nao paga nada por fora!_',
      '',
      '--------------------',
      '*Quer saber mais? Fale comigo!*',
    );
    const whatsapp = whatsappParts.join('\n');
    setResult({ plano: plano.nome, base: plano.base, extras, total, whatsappText: whatsapp.trim() });
    setStep(3);
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.whatsappText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden animate-fade-in-up"
        style={{ background: 'linear-gradient(180deg, #0d1d38 0%, #0a1628 100%)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Header */}
        <div className="relative p-5" style={{ background: 'linear-gradient(135deg, rgba(0,84,166,0.3), rgba(245,130,32,0.1))' }}>
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#0054a6] via-[#1a7fd4] to-[#f58220]" />
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                {step === 3 ? '\u2705 Cota\u00E7\u00E3o Pronta!' : '\u{1F4CB} Nova Cota\u00E7\u00E3o'}
              </h2>
              <p className="text-xs text-white/40 mt-0.5">{"Assist\u00EAncia Funeral SulAm\u00E9rica"}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Step indicator */}
          {step < 3 && (
            <div className="flex gap-2 mt-4">
              {[1, 2].map(s => (
                <div key={s} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{
                    width: step >= s ? '100%' : '0%',
                    background: 'linear-gradient(90deg, #0054a6, #f58220)',
                  }} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 space-y-4">
          {/* Step 1: Basic info */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-xs text-white/50 mb-1.5 font-medium">{"Nome do Cliente"}</label>
                <input
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder="Ex: Jo\u00E3o Silva"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 input-glow outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5 font-medium">{"Idade do Titular *"}</label>
                <input
                  type="number"
                  value={idade}
                  onChange={e => setIdade(e.target.value)}
                  placeholder="Ex: 42"
                  max={74}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 input-glow outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
                {parseInt(idade) > 74 && (
                  <p className="text-xs text-red-400 mt-1">{"\u26A0\uFE0F Titular deve ter at\u00E9 74 anos. Acima disso, incluir como dependente."}</p>
                )}
              </div>
              <button
                onClick={() => { if (idade && parseInt(idade) <= 74) setStep(2); }}
                disabled={!idade || parseInt(idade) > 74}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all btn-shine disabled:opacity-30"
                style={{ background: 'linear-gradient(135deg, #0054a6, #1a7fd4)' }}
              >
                {"Pr\u00F3ximo \u2192"}
              </button>
            </>
          )}

          {/* Step 2: Dependents */}
          {step === 2 && (
            <>
              {/* C\u00F4njuge */}
              <button
                onClick={() => setConjuge(!conjuge)}
                className="w-full flex items-center justify-between p-3 rounded-xl transition-all"
                style={{
                  background: conjuge ? 'rgba(0,84,166,0.2)' : 'rgba(255,255,255,0.03)',
                  border: '1px solid ' + (conjuge ? 'rgba(0,84,166,0.4)' : 'rgba(255,255,255,0.06)'),
                }}
              >
                <span className="text-sm text-white/80">{"\u{1F491} Incluir C\u00F4njuge"}</span>
                <div className={'w-10 h-6 rounded-full p-0.5 transition-all ' + (conjuge ? 'bg-[#0054a6]' : 'bg-white/10')}>
                  <div className={'w-5 h-5 rounded-full bg-white shadow transition-transform ' + (conjuge ? 'translate-x-4' : '')} />
                </div>
              </button>

              {/* Filhos */}
              <div className="space-y-2">
                <p className="text-xs text-white/50 font-medium">{"\u{1F476} Filhos"}</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={novaIdadeFilho}
                    onChange={e => setNovaIdadeFilho(e.target.value)}
                    placeholder="Idade do filho"
                    className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onKeyDown={e => e.key === 'Enter' && addFilho()}
                  />
                  <button onClick={addFilho} className="px-4 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: 'rgba(0,84,166,0.3)', border: '1px solid rgba(0,84,166,0.3)' }}>
                    {"+ Adicionar"}
                  </button>
                </div>
                {filhos.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {filhos.map((age, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: age > 21 ? 'rgba(245,130,32,0.15)' : 'rgba(0,84,166,0.15)',
                          color: age > 21 ? '#f58220' : '#1a7fd4',
                          border: '1px solid ' + (age > 21 ? 'rgba(245,130,32,0.2)' : 'rgba(0,84,166,0.2)'),
                        }}
                      >
                        {age}{" anos "}{age > 21 && '(+R$8)'}
                        <button onClick={() => removeFilho(i)} className="hover:text-red-400">{"\u00D7"}</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Pais */}
              <button
                onClick={() => setPais(!pais)}
                className="w-full flex items-center justify-between p-3 rounded-xl transition-all"
                style={{
                  background: pais ? 'rgba(0,84,166,0.2)' : 'rgba(255,255,255,0.03)',
                  border: '1px solid ' + (pais ? 'rgba(0,84,166,0.4)' : 'rgba(255,255,255,0.06)'),
                }}
              >
                <span className="text-sm text-white/80">{"\u{1F468}\u200D\u{1F469}\u200D\u{1F466} Incluir Pais"}</span>
                <div className={'w-10 h-6 rounded-full p-0.5 transition-all ' + (pais ? 'bg-[#0054a6]' : 'bg-white/10')}>
                  <div className={'w-5 h-5 rounded-full bg-white shadow transition-transform ' + (pais ? 'translate-x-4' : '')} />
                </div>
              </button>

              {/* Sogros */}
              <button
                onClick={() => setSogros(!sogros)}
                className="w-full flex items-center justify-between p-3 rounded-xl transition-all"
                style={{
                  background: sogros ? 'rgba(0,84,166,0.2)' : 'rgba(255,255,255,0.03)',
                  border: '1px solid ' + (sogros ? 'rgba(0,84,166,0.4)' : 'rgba(255,255,255,0.06)'),
                }}
              >
                <span className="text-sm text-white/80">{"\u{1F474}\u{1F475} Incluir Sogros"}</span>
                <div className={'w-10 h-6 rounded-full p-0.5 transition-all ' + (sogros ? 'bg-[#0054a6]' : 'bg-white/10')}>
                  <div className={'w-5 h-5 rounded-full bg-white shadow transition-transform ' + (sogros ? 'translate-x-4' : '')} />
                </div>
              </button>

              {/* Dependentes extras */}
              <div>
                <label className="block text-xs text-white/50 mb-1.5 font-medium">{"\u{1F465} Dependentes Extras (irm\u00E3os, netos, etc.) \u2014 +R$10 cada"}</label>
                <input
                  type="number"
                  value={dependentesExtras}
                  onChange={e => setDependentesExtras(e.target.value)}
                  min="0"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>

              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-all" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {"\u2190 Voltar"}
                </button>
                <button onClick={calcular} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all btn-shine" style={{ background: 'linear-gradient(135deg, #0054a6, #f58220)' }}>
                  {"Calcular Cota\u00E7\u00E3o \u{1F9EE}"}
                </button>
              </div>
            </>
          )}

          {/* Step 3: Result */}
          {step === 3 && result && (
            <>
              {/* Summary card */}
              <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(0,84,166,0.1)', border: '1px solid rgba(0,84,166,0.2)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50">{"Plano"}</span>
                  <span className="text-sm font-semibold text-[#1a7fd4]">{result.plano}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50">{"Base"}</span>
                  <span className="text-sm text-white/80">{"R$ "}{result.base.toFixed(2).replace('.', ',')}</span>
                </div>
                {result.extras.map((e, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs text-[#f58220]/70">{e.label}</span>
                    <span className="text-sm text-[#f58220]">{"+R$ "}{e.valor.toFixed(2).replace('.', ',')}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{"TOTAL"}</span>
                  <span className="text-xl font-extrabold gradient-text">{"R$ "}{result.total.toFixed(2).replace('.', ',')}{"/m\u00EAs"}</span>
                </div>
              </div>

              {/* WhatsApp preview */}
              <div>
                <p className="text-xs text-white/50 mb-2 font-medium">{"\u{1F4F1} Mensagem para WhatsApp:"}</p>
                <div
                  className="rounded-xl p-4 text-xs text-white/70 whitespace-pre-wrap max-h-60 overflow-y-auto scrollbar-thin"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'monospace', lineHeight: '1.6' }}
                >
                  {result.whatsappText}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => { setStep(1); setResult(null); }}
                  className="flex-1 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {"Nova Cota\u00E7\u00E3o"}
                </button>
                <button
                  onClick={copyToClipboard}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all btn-shine"
                  style={{ background: copied ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #25d366, #128c7e)' }}
                >
                  {copied ? '\u2705 Copiado!' : '\u{1F4CB} Copiar para WhatsApp'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
