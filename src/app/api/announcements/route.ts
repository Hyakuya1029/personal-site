import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 动态数据源：禁止构建期静态化
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const LOCATIONS = ['banner', 'card'] as const;
type Location = (typeof LOCATIONS)[number];

/*
 * location=banner → 顶部公告条
 * location=card   → 首页公告栏卡片
 * 两者都会带上同时作用于两处的 'both'
 */
export async function GET(request: Request) {
  try {
    const location = new URL(request.url).searchParams.get('location') as Location | null;

    if (!location || !LOCATIONS.includes(location)) {
      return NextResponse.json(
        { success: false, error: 'location 必须是 banner 或 card' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('announcements')
      .select('id, content')
      .eq('active', true)
      .in('location', [location, 'both'])
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (error: any) {
    console.error('Announcements GET Error:', error);
    return NextResponse.json({ success: false, error: '读取公告失败' }, { status: 500 });
  }
}
