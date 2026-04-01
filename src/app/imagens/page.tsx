'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Image as ImageIcon, Download, Sparkles, Loader2 } from 'lucide-react';

const TEMPLATES = [
  { label: 'Protecao Familiar', prompt: 'Happy Brazilian family feeling protected and secure, warm colors, family life insurance concept' },
  { label: 'Seguranca Financeira', prompt: 'Financial security and protection concept, shield protecting money and family, professional insurance theme' },
  { label: 'Vida Saudavel', prompt: 'Healthy active lifestyle, person exercising outdoors in Brazil, wellness and life insurance connection' },
  { label: 'Futuro dos Filhos', prompt: 'Children future education and protection, kids playing happily, parents watching with peace of mind' },
  { label: 'Aposentadoria Tranquila', prompt: 'Happy retired couple enjoying life in Brazil, peaceful retirement, financial freedom concept' },
  { label: 'Profissional Protegido', prompt: 'Professional person confident at work, workplace safety and income protection concept' },
];

export default function ImagensPage() {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<{ url: string; prompt: string }[]>([]);
  const router = useRouter();

  async function generateImage(customPrompt?: string) {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt.trim()) return;

    setGenerating(true);
    setError('');
    setImageUrl('');

    try {
      const res = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao gerar imagem');
        return;
      }

      setImageUrl(data.url);
      setHistory(prev => [{ url: data.url, prompt: finalPrompt }, ...prev].slice(0, 12));
    } catch (err) {
      setError('Erro de conexao. Tente novamente.');
    } finally {
      setGenerating(false);
    }
  }

  function handleTemplate(template: typeof TEMPLATES[0]) {
    setPrompt(template.label);
    generateImage(template.prompt);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a1628] to-blue-950 text-white">
      {/* Header */}
      <header className="glass-strong sticky top-0 z-30 px-4 py-3 flex items-center gap-3">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#0054a6] via-[#1a7fd4] to-[#f58220]" />
        <button onClick={() => router.push('/')} className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#f58220] to-amber-400 flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-white" />
          </div>
          <span className="gradient-text">Gerar Imagens</span>
        </h1>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Templates */}
        <div className="animate-fade-in-up" style={{ opacity: 0, animationDelay: '100ms' }}>
          <h2 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#f58220] to-amber-400" />
            Templates Prontos
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TEMPLATES.map((t, i) => (
              <button
                key={i}
                onClick={() => handleTemplate(t)}
                disabled={generating}
                className="glass rounded-xl p-3.5 text-sm text-left transition-all duration-300 disabled:opacity-50 group hover:bg-white/[0.04] hover:border-[#f58220]/30 hover:shadow-lg hover:shadow-[#f58220]/5"
              >
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#0054a6]/20 to-[#f58220]/20 flex items-center justify-center mb-2 group-hover:from-[#0054a6]/30 group-hover:to-[#f58220]/30 transition-all duration-300">
                  <Sparkles className="w-3.5 h-3.5 text-[#f58220]" />
                </div>
                <span className="group-hover:text-white transition-colors">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom prompt */}
        <div className="animate-fade-in-up" style={{ opacity: 0, animationDelay: '200ms' }}>
          <h2 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#0054a6] to-[#1a7fd4]" />
            Ou descreva o que precisa
          </h2>
          <form
            onSubmit={e => { e.preventDefault(); generateImage(); }}
            className="flex gap-2"
          >
            <input
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Ex: Familia feliz com protecao do seguro de vida..."
              className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0054a6]/50 input-glow transition-all duration-300"
              disabled={generating}
            />
            <button
              type="submit"
              disabled={generating || !prompt.trim()}
              className="btn-shine bg-gradient-to-r from-[#0054a6] to-[#1a7fd4] hover:from-[#0054a6] hover:to-[#f58220] disabled:opacity-40 disabled:hover:from-[#0054a6] disabled:hover:to-[#1a7fd4] text-white rounded-xl px-5 py-3 flex items-center gap-2 text-sm font-medium transition-all duration-300 shadow-lg shadow-[#0054a6]/20"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Gerar
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="glass rounded-lg p-3 text-sm text-red-400 border-red-500/20 animate-fade-in-up" style={{ opacity: 0 }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {generating && (
          <div className="flex flex-col items-center py-16 animate-fade-in-up" style={{ opacity: 0 }}>
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-2 border-[#0054a6] border-t-[#f58220] animate-spin" />
              <div className="absolute inset-0 w-14 h-14 rounded-full animate-pulse-glow" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#f58220]" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">Gerando sua imagem...</p>
            <p className="text-xs text-gray-600 mt-1">Isso pode levar ate 30 segundos</p>
          </div>
        )}

        {/* Generated Image */}
        {imageUrl && !generating && (
          <div
            className="glass rounded-xl p-4 animate-fade-in-up animate-pulse-glow"
            style={{ opacity: 0, animationDelay: '100ms' }}
          >
            <img
              src={imageUrl}
              alt="Imagem gerada"
              className="w-full rounded-lg mb-3 shadow-2xl shadow-[#0054a6]/10"
            />
            <div className="flex gap-2">
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex-1 btn-shine bg-gradient-to-r from-[#0054a6] to-[#1a7fd4] hover:from-[#0054a6] hover:to-[#f58220] text-white text-sm font-medium rounded-lg px-4 py-2.5 flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-[#0054a6]/20"
              >
                <Download className="w-4 h-4" /> Baixar Imagem
              </a>
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 1 && (
          <div className="animate-fade-in-up" style={{ opacity: 0, animationDelay: '150ms' }}>
            <h2 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#0054a6] to-[#f58220]" />
              Imagens Recentes
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {history.slice(1).map((h, i) => (
                <div key={i} className="relative group glass rounded-lg overflow-hidden">
                  <img src={h.url} alt={h.prompt} className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105" />
                  <a
                    href={h.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/90 via-[#0a1628]/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg flex flex-col items-center justify-end pb-4"
                  >
                    <Download className="w-5 h-5 text-white mb-1" />
                    <span className="text-[10px] text-gray-300 px-2 text-center line-clamp-1">{h.prompt}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
