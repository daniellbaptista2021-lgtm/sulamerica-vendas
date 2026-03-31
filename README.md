# Flex IA - Assistente de Vendas SulAmérica Vida Flex

Chatbot inteligente para equipe de vendedores SulAmérica Vida Flex. Powered by Claude AI.

## Funcionalidades

- **Chat IA** — Tira dúvidas, quebra objeções, cria scripts de abordagem
- **Base de Conhecimento** — Regras de contratação, coberturas, capitais, benefícios
- **Cotação Assistida** — Estimativas baseadas nos dados do cliente
- **Ações Rápidas** — Coberturas, objeções, scripts, cotações com 1 clique
- **Multi-vendedor** — Auth com Supabase, suporta 100+ vendedores
- **Gestão de Vendas** — Registro e acompanhamento de propostas

## Deploy na Vercel

### 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. Vá em **SQL Editor** e execute o conteúdo de `src/lib/supabase-schema.sql`
3. Vá em **Authentication > Settings** e configure email/password
4. Crie os vendedores em **Authentication > Users**
5. Copie as chaves em **Settings > API**

### 2. Deploy na Vercel

1. Faça push do código para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com) e importe o repositório
3. Configure as variáveis de ambiente:

```
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

4. Clique em Deploy

### 3. Cadastrar vendedores

No painel do Supabase:
1. **Authentication > Users > Add User**
2. Adicione email e senha para cada vendedor
3. Na tabela `profiles`, adicione nome e equipe

## Desenvolvimento local

```bash
cp .env.example .env
# Preencha as variáveis no .env

npm install
npm run dev
# Acesse http://localhost:3000
```

## Tech Stack

- Next.js 14 (App Router)
- Vercel AI SDK + Claude (Anthropic)
- Supabase (Auth + Database)
- Tailwind CSS
- TypeScript
