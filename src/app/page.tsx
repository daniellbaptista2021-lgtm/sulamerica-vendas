'use client';

import { useChat } from 'ai/react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Bot, User, Menu, X, BookOpen, Target, MessageSquare, TrendingUp, Sparkles, BarChart3, ShoppingCart, Image as ImageIcon, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';

const QUICK_ACTIONS = [
  { icon: TrendingUp, label: 'Fazer Cotação', prompt: 'Preciso fazer uma cotação de Assistência Funeral SulAmérica. Me pergunte os dados do cliente.' },
  { icon: BookOpen, label: 'Planos e Preços', prompt: 'Quais são todos os planos disponíveis, seus preços e o que cada um inclui?' },
  { icon: Target, label: 'Quebrar Objeção', prompt: 'O cliente disse que "é muito caro". Como quebro essa objeção?' },
  { icon: MessageSquare, label: 'Script WhatsApp', prompt: 'Crie um script de abordagem para prospectar clientes por WhatsApp para a Assistência Funeral SulAmérica.' },
  { icon: Sparkles, label: 'Dica de Venda', prompt: 'Me dê 5 dicas práticas para fechar mais vendas de Assistência Funeral esta semana.' },
];

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(145deg, #0a1628 0%, #0f2140 40%, #0a1628 100%)' }}>
        <div className="flex flex-col items-center gap-5 animate-fade-in-up">
          <div className="relative w-14 h-14">
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, #0054a6, #f58220)',
                animation: 'pulse-glow 2s ease-in-out infinite',
              }}
            />
            <div className="absolute inset-[2px] rounded-2xl bg-[#0a1628] flex items-center justify-center">
              <Bot className="w-7 h-7 text-[#f58220]" />
            </div>
          </div>
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0054a6]" style={{ animation: 'fade-in-up 0.6s ease-in-out infinite alternate', animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-[#1a7fd4]" style={{ animation: 'fade-in-up 0.6s ease-in-out infinite alternate', animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-[#f58220]" style={{ animation: 'fade-in-up 0.6s ease-in-out infinite alternate', animationDelay: '300ms' }} />
          </div>
          <p className="text-sm text-white/40 font-light tracking-wider" style={{ fontFamily: 'var(--font-body)' }}>
            Carregando...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'linear-gradient(160deg, #0a1628 0%, #0d1d38 35%, #0f2140 60%, #0a1628 100%)' }}>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col transform transition-transform duration-300 ease-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(180deg, #0d1d38 0%, #0a1628 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Sidebar Header */}
        <div
          className="relative p-5 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(0,84,166,0.25) 0%, rgba(245,130,32,0.08) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Decorative orb */}
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #f58220, transparent 70%)' }} />

          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0054a6, #1a7fd4)' }}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0d1d38]" />
              </div>
              <div>
                <h1 className="text-base font-extrabold text-white tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                  Flex IA
                </h1>
                <p className="text-[11px] text-white/40 font-light tracking-wide" style={{ fontFamily: 'var(--font-body)' }}>
                  PV Corretora &middot; SulAm&eacute;rica
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25 mb-3 px-1" style={{ fontFamily: 'var(--font-body)' }}>
            Acoes Rapidas
          </p>
          <div className="space-y-1">
            {QUICK_ACTIONS.map((action, i) => (
              <button
                key={i}
                onClick={() => handleQuickAction(action.prompt)}
                className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-105" style={{ background: 'rgba(0,84,166,0.15)' }}>
                  <action.icon className="w-4 h-4 text-[#1a7fd4] group-hover:text-[#f58220] transition-colors duration-200" />
                </div>
                <span className="font-medium">{action.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25 mb-3 px-1" style={{ fontFamily: 'var(--font-body)' }}>
              Ferramentas
            </p>
            <div className="space-y-1">
              <button onClick={() => router.push('/vendas')} className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-all duration-200" style={{ fontFamily: 'var(--font-body)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-105" style={{ background: 'rgba(16,185,129,0.12)' }}>
                  <ShoppingCart className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="font-medium">Minhas Vendas</span>
              </button>
              <button onClick={() => router.push('/imagens')} className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-all duration-200" style={{ fontFamily: 'var(--font-body)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-105" style={{ background: 'rgba(168,85,247,0.12)' }}>
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                </div>
                <span className="font-medium">Gerar Imagens</span>
              </button>
              <button onClick={() => router.push('/dashboard')} className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-all duration-200" style={{ fontFamily: 'var(--font-body)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-105" style={{ background: 'rgba(6,182,212,0.12)' }}>
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="font-medium">Dashboard</span>
              </button>
            </div>
          </div>

          <div className="mt-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25 mb-3 px-1" style={{ fontFamily: 'var(--font-body)' }}>
              Exemplos
            </p>
            <div className="space-y-2.5 px-1" style={{ fontFamily: 'var(--font-body)' }}>
              <p className="text-xs text-white/25 leading-relaxed italic">&quot;Cliente de 42 anos, casado, 2 filhos de 8 e 15. Faz a cotação?&quot;</p>
              <p className="text-xs text-white/25 leading-relaxed italic">&quot;Como responder quando dizem que vão pensar?&quot;</p>
              <p className="text-xs text-white/25 leading-relaxed italic">&quot;Qual a diferença entre Familiar e Familiar Ampliado?&quot;</p>
              <p className="text-xs text-white/25 leading-relaxed italic">&quot;Crie um texto de divulgação para Instagram&quot;</p>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <LogOut className="w-3.5 h-3.5" /> Sair
          </button>
          <p className="text-[10px] text-white/15 text-center" style={{ fontFamily: 'var(--font-body)' }}>
            v1.0 &middot; Base: SulAm&eacute;rica Vida Flex
          </p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">

        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, #0054a6, transparent 70%)' }} />
          <div className="absolute bottom-32 left-0 w-72 h-72 rounded-full opacity-[0.02]" style={{ background: 'radial-gradient(circle, #f58220, transparent 70%)' }} />
        </div>

        {/* Header */}
        <header
          className="relative flex items-center gap-3 px-5 py-3.5 z-10"
          style={{
            background: 'linear-gradient(90deg, rgba(0,84,166,0.08) 0%, rgba(15,33,64,0.9) 30%, rgba(15,33,64,0.9) 70%, rgba(245,130,32,0.05) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center animate-pulse-glow"
                style={{ background: 'linear-gradient(135deg, #0054a6, #1a7fd4)' }}
              >
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0f2140]" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Flex IA
              </h1>
              <p className="text-[11px] font-light text-emerald-400/80 tracking-wide" style={{ fontFamily: 'var(--font-body)' }}>
                Online &mdash; Pronto para ajudar
              </p>
            </div>
          </div>
          {/* Brand accent line */}
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <span className="text-[10px] text-white/20 uppercase tracking-widest font-light" style={{ fontFamily: 'var(--font-body)' }}>SulAm&eacute;rica</span>
            <div className="w-5 h-[2px] rounded-full" style={{ background: 'linear-gradient(90deg, #0054a6, #f58220)' }} />
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 scrollbar-thin relative z-10">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-fade-in-up">
              {/* Hero icon */}
              <div className="relative mb-6">
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center animate-pulse-glow"
                  style={{ background: 'linear-gradient(135deg, #0054a6 0%, #1a7fd4 50%, #f58220 100%)' }}
                >
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -inset-3 rounded-[28px] opacity-20" style={{ background: 'linear-gradient(135deg, #0054a6, #f58220)', filter: 'blur(12px)' }} />
              </div>

              {/* Welcome text */}
              <h2
                className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Ola! Sou o{' '}
                <span className="gradient-text">Flex IA</span>
              </h2>
              <p
                className="text-white/40 max-w-md mb-8 text-sm sm:text-base font-light leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Seu assistente de vendas PV Corretora - Assistencia Funeral SulAmerica.
                Faca cotacoes, tire duvidas, quebre objecoes e muito mais.
              </p>

              {/* Quick Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-2xl stagger-children">
                {QUICK_ACTIONS.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickAction(action.prompt)}
                    className="group relative flex items-center gap-3 p-4 rounded-2xl text-left text-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 animate-fade-in-up btn-shine"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      fontFamily: 'var(--font-body)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0,84,166,0.3)';
                      e.currentTarget.style.background = 'rgba(0,84,166,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0,84,166,0.2), rgba(0,84,166,0.05))',
                      }}
                    >
                      <action.icon className="w-5 h-5 text-[#1a7fd4] group-hover:text-[#f58220] transition-colors duration-300" />
                    </div>
                    <span className="font-semibold text-white/70 group-hover:text-white transition-colors duration-200">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end chat-user' : 'justify-start chat-assistant'}`}
            >
              {message.role === 'assistant' && (
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #0054a6, #1a7fd4)' }}
                >
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                  message.role === 'user'
                    ? 'rounded-br-lg'
                    : 'rounded-bl-lg'
                }`}
                style={
                  message.role === 'user'
                    ? {
                        background: 'linear-gradient(135deg, #0054a6, #1a7fd4)',
                        color: 'white',
                        fontFamily: 'var(--font-body)',
                        boxShadow: '0 4px 20px rgba(0,84,166,0.25)',
                      }
                    : {
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        color: 'rgba(255,255,255,0.85)',
                        fontFamily: 'var(--font-body)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                      }
                }
              >
                <div className="whitespace-pre-wrap prose prose-invert prose-sm max-w-none [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>h1]:text-base [&>h2]:text-sm [&>h3]:text-sm [&>table]:text-xs [&>p]:mb-2 [&>*:last-child]:mb-0">
                  {message.content}
                </div>
              </div>
              {message.role === 'user' && (
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <User className="w-4 h-4 text-white/60" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 chat-assistant">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                style={{ background: 'linear-gradient(135deg, #0054a6, #1a7fd4)' }}
              >
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div
                className="rounded-2xl rounded-bl-lg px-5 py-4"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: '#0054a6', animation: 'fade-in-up 0.8s ease-in-out infinite alternate', animationDelay: '0ms' }}
                    />
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: '#1a7fd4', animation: 'fade-in-up 0.8s ease-in-out infinite alternate', animationDelay: '200ms' }}
                    />
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: '#f58220', animation: 'fade-in-up 0.8s ease-in-out infinite alternate', animationDelay: '400ms' }}
                    />
                  </div>
                  <span className="text-xs text-white/25 font-light" style={{ fontFamily: 'var(--font-body)' }}>
                    Pensando...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div
          className="relative z-10 p-4 pb-2"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(10,22,40,0.8) 30%, rgba(10,22,40,0.95) 100%)',
            borderTop: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative group">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Digite sua duvida, peca uma cotacao, quebre uma objecao..."
                className="w-full rounded-2xl px-5 py-3.5 text-sm text-white placeholder-white/25 focus:outline-none transition-all duration-300 input-glow"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontFamily: 'var(--font-body)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,84,166,0.4)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-2xl px-5 py-3.5 transition-all duration-300 disabled:opacity-30 hover:scale-105 hover:shadow-lg active:scale-95 btn-shine"
              style={{
                background: isLoading || !input.trim()
                  ? 'rgba(255,255,255,0.05)'
                  : 'linear-gradient(135deg, #0054a6, #1a7fd4)',
                color: 'white',
                boxShadow: isLoading || !input.trim() ? 'none' : '0 4px 15px rgba(0,84,166,0.3)',
              }}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-center text-[11px] text-white/15 mt-2.5 mb-1 font-light" style={{ fontFamily: 'var(--font-body)' }}>
            Flex IA pode cometer erros. Confirme informacoes importantes no portal SulAmerica.
          </p>
        </div>

        {/* Mobile Bottom Nav */}
        <div
          className="lg:hidden flex relative z-10"
          style={{
            background: 'rgba(10,22,40,0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <button className="relative flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[#1a7fd4] transition-colors">
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] font-semibold" style={{ fontFamily: 'var(--font-body)' }}>Chat</span>
            {/* Active indicator */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full"
              style={{ background: 'linear-gradient(90deg, #0054a6, #f58220)', animation: 'fade-in-up 0.3s ease-out' }}
            />
          </button>
          <button onClick={() => router.push('/vendas')} className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-white/30 hover:text-white/60 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-[10px]" style={{ fontFamily: 'var(--font-body)' }}>Vendas</span>
          </button>
          <button onClick={() => router.push('/imagens')} className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-white/30 hover:text-white/60 transition-colors">
            <ImageIcon className="w-5 h-5" />
            <span className="text-[10px]" style={{ fontFamily: 'var(--font-body)' }}>Imagens</span>
          </button>
          <button onClick={() => router.push('/dashboard')} className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-white/30 hover:text-white/60 transition-colors">
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px]" style={{ fontFamily: 'var(--font-body)' }}>Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
