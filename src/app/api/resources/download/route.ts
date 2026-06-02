import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: '缺少 id 参数' }, { status: 400 });
    }

    // 从数据库查 file_url
    const { data, error } = await supabase
      .from('resources')
      .select('file_url, title')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ error: '资源不存在' }, { status: 404 });
    }

    // 服务端下载文件
    const fileRes = await fetch(data.file_url);
    if (!fileRes.ok) {
      return NextResponse.json({ error: '文件下载失败' }, { status: 502 });
    }

    // 从 URL 中提取文件名
    const urlObj = new URL(data.file_url);
    const fileName = urlObj.pathname.split('/').pop() || data.title;

    const headers = new Headers();
    headers.set('Content-Type', fileRes.headers.get('Content-Type') || 'application/octet-stream');
    headers.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`);
    headers.set('Content-Length', fileRes.headers.get('Content-Length') || '0');
    headers.set('Cache-Control', 'public, max-age=86400');

    return new NextResponse(fileRes.body, { headers });
  } catch (error: any) {
    console.error('Download API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
