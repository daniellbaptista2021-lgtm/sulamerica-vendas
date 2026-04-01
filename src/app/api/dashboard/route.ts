import { createServerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    const role = profile?.role || 'vendedor';
    const isAdmin = role === 'supervisor' || role === 'admin';

    // Get sales
    let salesQuery = supabase.from('sales').select('*');
    if (!isAdmin) {
      salesQuery = salesQuery.eq('seller_id', userId);
    }

    const { data: sales } = await salesQuery.order('created_at', { ascending: false });
    const allSales = sales || [];

    const totalSales = allSales.length;
    const approved = allSales.filter(s => s.status === 'aprovada').length;
    const pending = allSales.filter(s => s.status === 'proposta' || s.status === 'analise').length;
    const rejected = allSales.filter(s => s.status === 'recusada').length;
    const cancelled = allSales.filter(s => s.status === 'cancelada').length;

    const totalPremium = allSales
      .filter(s => s.status === 'aprovada')
      .reduce((sum, s) => sum + (parseFloat(s.monthly_premium) || 0), 0);

    const totalCapital = allSales
      .filter(s => s.status === 'aprovada')
      .reduce((sum, s) => sum + (parseFloat(s.capital) || 0), 0);

    // Monthly data (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString('pt-BR', { month: 'short' });
      const year = date.getFullYear();
      const monthNum = date.getMonth();

      const monthSales = allSales.filter(s => {
        const d = new Date(s.created_at);
        return d.getMonth() === monthNum && d.getFullYear() === year;
      });

      monthlyData.push({
        month: `${month}/${year.toString().slice(2)}`,
        total: monthSales.length,
        approved: monthSales.filter(s => s.status === 'aprovada').length,
        premium: monthSales.filter(s => s.status === 'aprovada').reduce((sum, s) => sum + (parseFloat(s.monthly_premium) || 0), 0),
      });
    }

    const recentSales = allSales.slice(0, 10);

    // Top sellers (admin only)
    let topSellers: any[] = [];
    if (isAdmin) {
      const sellerMap = new Map<string, { count: number; premium: number }>();
      allSales.filter(s => s.status === 'aprovada').forEach(s => {
        const current = sellerMap.get(s.seller_id) || { count: 0, premium: 0 };
        sellerMap.set(s.seller_id, {
          count: current.count + 1,
          premium: current.premium + (parseFloat(s.monthly_premium) || 0),
        });
      });

      const sellerIds = Array.from(sellerMap.keys());
      if (sellerIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', sellerIds);

        topSellers = sellerIds.map(id => ({
          id,
          name: profiles?.find(p => p.id === id)?.full_name || 'Vendedor',
          ...sellerMap.get(id),
        })).sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, 10);
      }
    }

    return NextResponse.json({
      stats: { totalSales, approved, pending, rejected, cancelled, totalPremium, totalCapital, conversionRate: totalSales > 0 ? ((approved / totalSales) * 100).toFixed(1) : '0' },
      monthlyData,
      recentSales,
      topSellers,
      role,
    });
  } catch (err: any) {
    console.error('Dashboard error:', err);
    return NextResponse.json({
      stats: { totalSales: 0, approved: 0, pending: 0, rejected: 0, cancelled: 0, totalPremium: 0, totalCapital: 0, conversionRate: '0' },
      monthlyData: [],
      recentSales: [],
      topSellers: [],
      role: 'vendedor',
    });
  }
}
