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
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.push('/')} className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-blue-400" />
          Gerar Imagens
        </h1>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Templates */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 mb-2">Templates Prontos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TEMPLATES.map((t, i) => (
              <button
                key={i}
                onClick={() => handleTemplate(t)}
                disabled={generating}
                className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-left hover:bg-gray-800 hover:border-gray-700 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-blue-400 mb-1" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom prompt */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 mb-2">Ou descreva o que precisa</h2>
          <form
            onSubmit={e => { e.preventDefault(); generateImage(); }}
            className="flex gap-2"
          >
            <input
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Ex: Familia feliz com protecao do seguro de vida..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={generating}
            />
            <button
              type="submit"
              disabled={generating || !prompt.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white rounded-xl px-4 py-3 flex items-center gap-2 text-sm font-medium"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Gerar
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Loading */}
        {generating && (
          <div className="flex flex-col items-center py-12">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin mb-3" />
            <p className="text-sm text-gray-400">Gerando sua imagem...</p>
            <p className="text-xs text-gray-600 mt-1">Isso pode levar ate 30 segundos</p>
          </div>
        )}

        {/* Generated Image */}
        {imageUrl && !generating && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <img
              src={imageUrl}
              alt="Imagem gerada"
              className="w-full rounded-lg mb-3"
            />
            <div className="flex gap-2">
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg px-4 py-2.5 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Baixar Imagem
              </a>
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 1 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-400 mb-2">Imagens Recentes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {history.slice(1).map((h, i) => (
                <div key={i} className="relative group">
                  <img src={h.url} alt={h.prompt} className="w-full aspect-square object-cover rounded-lg" />
                  <a
                    href={h.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
                  >
                    <Download className="w-5 h-5 text-white" />
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
