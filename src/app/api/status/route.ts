import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 动态数据源：必须每次请求实时读取，否则会被构建期静态化后永久冻结
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('status_posts')
      .select('id, content, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Status API Error:', error);
    return NextResponse.json({ success: false, error: '读取动态失败' }, { status: 500 });
  }
}
