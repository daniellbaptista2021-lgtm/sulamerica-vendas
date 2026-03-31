'use client';

import { useChat } from 'ai/react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Bot, User, Menu, X, BookOpen, Target, MessageSquare, TrendingUp, Sparkles, BarChart3, ShoppingCart, Image as ImageIcon, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';

const QUICK_ACTIONS = [
  { icon: BookOpen, label: 'Coberturas', prompt: 'Quais são todas as coberturas disponíveis no SulAmérica Vida Flex e seus limites de capital?' },
  { icon: Target, label: 'Quebrar Objeção', prompt: 'O cliente disse que "é muito caro". Como quebro essa objeção?' },
  { icon: MessageSquare, label: 'Script de Abordagem', prompt: 'Crie um script de abordagem para prospecção de novos clientes por WhatsApp para o Vida Flex.' },
  { icon: TrendingUp, label: 'Cotação', prompt: 'Preciso fazer uma cotação. Quais dados do cliente preciso informar?' },
  { icon: Sparkles, label: 'Dica de Venda', prompt: 'Me dê 5 dicas práticas para fechar mais vendas do Vida Flex esta semana.' },
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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-white">Flex IA</h1>
                  <p className="text-xs text-gray-400">SulAmérica Vida Flex</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Ações Rápidas</h2>
            <div className="space-y-2">
              {QUICK_ACTIONS.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <action.icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  {action.label}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Ferramentas</h2>
              <div className="space-y-1">
                <button onClick={() => router.push('/vendas')} className="w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  <ShoppingCart className="w-4 h-4 text-green-400 flex-shrink-0" />
                  Minhas Vendas
                </button>
                <button onClick={() => router.push('/imagens')} className="w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  <ImageIcon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  Gerar Imagens
                </button>
                <button onClick={() => router.push('/dashboard')} className="w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  <BarChart3 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  Dashboard
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Exemplos</h2>
              <div className="space-y-2 text-xs text-gray-500">
                <p>&quot;Cliente de 35 anos quer cobertura de morte e doenças graves, capital de 200 mil&quot;</p>
                <p>&quot;Como responder quando dizem que vão pensar?&quot;</p>
                <p>&quot;Crie um texto de divulgação para Instagram&quot;</p>
                <p>&quot;Quais benefícios inclusos posso usar como argumento?&quot;</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-800 space-y-2">
            <button onClick={logout} className="w-full flex items-center gap-2 p-2 rounded-lg text-xs text-gray-500 hover:bg-gray-800 hover:text-red-400 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Sair
            </button>
            <p className="text-xs text-gray-600 text-center">v1.0 - Base: SulAmérica Vida Flex</p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-3 bg-gray-900/50 backdrop-blur border-b border-gray-800">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">Flex IA</h1>
              <p className="text-xs text-green-400">Online - Pronto para ajudar</p>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Olá! Sou o Flex IA</h2>
              <p className="text-gray-400 max-w-md mb-6">
                Seu assistente inteligente para vendas do SulAmérica Vida Flex.
                Tire dúvidas, quebre objeções, faça cotações e muito mais.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {QUICK_ACTIONS.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickAction(action.prompt)}
                    className="flex items-center gap-2 p-3 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-300 hover:bg-gray-800 hover:border-gray-700 transition-all text-left"
                  >
                    <action.icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-gray-900 text-gray-200 border border-gray-800 rounded-bl-md'
                }`}
              >
                <div className="whitespace-pre-wrap prose prose-invert prose-sm max-w-none [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>h1]:text-base [&>h2]:text-sm [&>h3]:text-sm [&>table]:text-xs [&>p]:mb-2 [&>*:last-child]:mb-0">
                  {message.content}
                </div>
              </div>
              {message.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-3.5 h-3.5 text-gray-300" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur p-4">
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Digite sua dúvida, peça uma cotação, quebre uma objeção..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl px-4 py-3 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-center text-xs text-gray-600 mt-2">
            Flex IA pode cometer erros. Confirme informações importantes no portal SulAmérica.
          </p>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="lg:hidden border-t border-gray-800 bg-gray-900 flex">
          <button className="flex-1 flex flex-col items-center gap-0.5 py-2 text-blue-400">
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px]">Chat</span>
          </button>
          <button onClick={() => router.push('/vendas')} className="flex-1 flex flex-col items-center gap-0.5 py-2 text-gray-500 hover:text-white">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-[10px]">Vendas</span>
          </button>
          <button onClick={() => router.push('/imagens')} className="flex-1 flex flex-col items-center gap-0.5 py-2 text-gray-500 hover:text-white">
            <ImageIcon className="w-5 h-5" />
            <span className="text-[10px]">Imagens</span>
          </button>
          <button onClick={() => router.push('/dashboard')} className="flex-1 flex flex-col items-center gap-0.5 py-2 text-gray-500 hover:text-white">
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px]">Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
