-- Tabela de perfis de vendedores (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  team TEXT,
  role TEXT DEFAULT 'vendedor' CHECK (role IN ('vendedor', 'supervisor', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de vendas registradas
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_cpf TEXT,
  client_age INTEGER,
  client_phone TEXT,
  client_email TEXT,
  plan_type TEXT NOT NULL,
  coverages TEXT[] DEFAULT '{}',
  capital DECIMAL(12,2),
  monthly_premium DECIMAL(10,2),
  payment_method TEXT,
  status TEXT DEFAULT 'proposta' CHECK (status IN ('proposta', 'analise', 'aprovada', 'recusada', 'cancelada')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de histórico de conversas com a IA
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]',
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Vendedores podem ver só seus próprios dados
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Vendedores podem ver e criar suas próprias vendas
CREATE POLICY "Users can view own sales" ON sales FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Users can insert own sales" ON sales FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Users can update own sales" ON sales FOR UPDATE USING (auth.uid() = seller_id);

-- Chat history
CREATE POLICY "Users can manage own chats" ON chat_history FOR ALL USING (auth.uid() = user_id);

-- Supervisores podem ver vendas da equipe
CREATE POLICY "Supervisors can view team sales" ON sales FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('supervisor', 'admin')
    )
  );

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER sales_updated_at BEFORE UPDATE ON sales FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER chat_history_updated_at BEFORE UPDATE ON chat_history FOR EACH ROW EXECUTE FUNCTION update_updated_at();
