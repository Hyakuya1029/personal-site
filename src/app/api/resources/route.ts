import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 动态数据源：禁止构建期静态化
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const postId = request.nextUrl.searchParams.get('post_id');

    // 只返回前端需要的字段：file_url 由 /api/resources/download 在服务端解析，不下发给浏览器
    let query = supabase
      .from('resources')
      .select('id, title, description, tags, file_type, post_id, created_at')
      .order('created_at', { ascending: false });

    if (postId) {
      query = query.eq('post_id', postId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Resources API Error:', error);
    return NextResponse.json({ success: false, error: '读取资源失败' }, { status: 500 });
  }
}
