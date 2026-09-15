import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 动态数据源：禁止构建期静态化
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/* 已通过审核的友链，仅返回公开展示所需字段（不含 email / ip_address） */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('friend_applications')
      .select('id, name, avatar, url, description, tags')
      .eq('status', 'approved')
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (error: any) {
    console.error('Friends GET Error:', error);
    return NextResponse.json({ success: false, error: '读取友链失败' }, { status: 500 });
  }
}
