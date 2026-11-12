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
 * 不带 location  → 返回全部启用中的公告（含 location 字段）。
 *   顶部公告条和首页公告卡都用这个 URL，靠 hook 的请求去重合成 1 次请求。
 * location=banner → 只要作用于顶部公告条的（含同时作用于两处的 'both'）
 * location=card   → 只要作用于首页公告卡的（同上）
 */
export async function GET(request: Request) {
  try {
    const raw = new URL(request.url).searchParams.get('location');

    let query = supabase
      .from('announcements')
      .select('id, content, location')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (raw) {
      if (!LOCATIONS.includes(raw as Location)) {
        return NextResponse.json(
          { success: false, error: 'location 必须是 banner 或 card' },
          { status: 400 }
        );
      }
      query = query.in('location', [raw, 'both']);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (error: any) {
    console.error('Announcements GET Error:', error);
    return NextResponse.json({ success: false, error: '读取公告失败' }, { status: 500 });
  }
}
