import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 动态数据源：禁止构建期静态化
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/* 启用的歌曲列表（audio_url 指向 Supabase Storage 公共桶） */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('music')
      .select('title, artist, audio_url')
      .eq('active', true)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (error: any) {
    console.error('Music GET Error:', error);
    return NextResponse.json({ success: false, error: '读取歌单失败' }, { status: 500 });
  }
}
