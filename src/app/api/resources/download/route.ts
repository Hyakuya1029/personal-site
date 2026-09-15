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
    let fileName = data.title;
    try {
      const urlObj = new URL(data.file_url);
      fileName = urlObj.pathname.split('/').pop() || data.title;
    } catch {
      // file_url 非法时退回使用标题
    }

    const headers = new Headers();
    headers.set('Content-Type', fileRes.headers.get('Content-Type') || 'application/octet-stream');
    headers.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`);

    // 仅在源站确实返回了 Content-Length 时才声明它。
    // 之前回退成 '0' 会让"声明 0 字节却带响应体"的畸形响应截断下载。
    const contentLength = fileRes.headers.get('Content-Length');
    if (contentLength) headers.set('Content-Length', contentLength);

    headers.set('Cache-Control', 'public, max-age=86400');

    return new NextResponse(fileRes.body, { headers });
  } catch (error: any) {
    console.error('Download API Error:', error);
    return NextResponse.json({ error: '文件下载失败' }, { status: 500 });
  }
}
