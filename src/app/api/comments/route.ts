import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getGeoInfo, getClientIP, getQueryIP } from '@/lib/geo';
import { sendNotification } from '@/lib/notify';
import { isOwnerEmail, resolveStoredEmail } from '@/lib/owner';
import { cleanText, isValidEmail } from '@/lib/validate';
import { rateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MAX_NAME = 40;
const MAX_EMAIL = 120;
const MAX_CONTENT = 1000;

/* ── GET：读取评论。只下发安全字段，email / ip_address 永不离开服务端 ── */
export async function GET(request: Request) {
  try {
    const postId = new URL(request.url).searchParams.get('post_id');
    if (!postId) {
      return NextResponse.json({ success: false, error: '缺少 post_id 参数' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('comments')
      .select('id, post_id, name, content, created_at, parent_id, country, region, email')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // 站长标识在服务端算好，前端只拿布尔值，无需接触邮箱
    const ownerCache = new Map<string, boolean>();
    const comments: Record<string, unknown>[] = [];

    for (const row of (data ?? []) as Record<string, any>[]) {
      const { email, ...safe } = row;
      const key = String(email ?? '').trim().toLowerCase();
      if (!ownerCache.has(key)) ownerCache.set(key, await isOwnerEmail(key));
      comments.push({ ...safe, is_owner: ownerCache.get(key) === true });
    }

    return NextResponse.json({ success: true, data: comments });
  } catch (error: any) {
    console.error('Comments GET Error:', error);
    return NextResponse.json({ success: false, error: '读取评论失败' }, { status: 500 });
  }
}

/* ── POST：提交评论（服务端校验 + 限流，防止刷屏与邮件轰炸） ── */
export async function POST(request: Request) {
  try {
    const ip = getClientIP(request);

    if (!rateLimit(`comment:${ip}`, 5, 60_000)) {
      return NextResponse.json(
        { success: false, error: '提交太频繁了，请稍后再试' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: '请求格式不正确' }, { status: 400 });
    }

    const postId = cleanText((body as any).post_id, 120);
    const name = cleanText((body as any).name, MAX_NAME);
    const email = cleanText((body as any).email, MAX_EMAIL);
    const content = cleanText((body as any).content, MAX_CONTENT);
    const parentId = cleanText((body as any).parent_id, 64);
    const ownerPassword = cleanText((body as any).owner_password, 200);

    // 只有密码正确才写入站长邮箱；否则冒填站长邮箱会被清空
    const storedEmail = resolveStoredEmail(email, ownerPassword);

    if (!postId) {
      return NextResponse.json({ success: false, error: '缺少文章 ID' }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ success: false, error: '请填写昵称' }, { status: 400 });
    }
    if (!content) {
      return NextResponse.json({ success: false, error: '请填写评论内容' }, { status: 400 });
    }
    if (email && !isValidEmail(email)) {
      return NextResponse.json({ success: false, error: '邮箱格式不正确' }, { status: 400 });
    }

    const queryIp = getQueryIP(ip, process.env.NODE_ENV || 'production');
    const geoInfo = await getGeoInfo(queryIp);

    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        name,
        email: storedEmail,
        content,
        parent_id: parentId || null,
        ip_address: ip,
        country: geoInfo.country,
        region: geoInfo.region
      });

    if (error) throw error;

    await sendNotification({
      type: 'comment',
      name,
      content,
      email,
      postId,
      country: geoInfo.country,
      region: geoInfo.region,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Comments POST Error:', error);
    return NextResponse.json({ success: false, error: '提交失败，请稍后重试' }, { status: 500 });
  }
}
