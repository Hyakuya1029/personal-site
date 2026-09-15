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
const MAX_CONTENT = 500;

/* ── GET：读取留言墙。只下发安全字段，email / ip_address 永不离开服务端 ── */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('id, name, content, country, region, created_at, email')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const ownerCache = new Map<string, boolean>();
    const messages: Record<string, unknown>[] = [];

    for (const row of (data ?? []) as Record<string, any>[]) {
      const { email, ...safe } = row;
      const key = String(email ?? '').trim().toLowerCase();
      if (!ownerCache.has(key)) ownerCache.set(key, await isOwnerEmail(key));
      messages.push({ ...safe, is_owner: ownerCache.get(key) === true });
    }

    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    console.error('Messages GET Error:', error);
    return NextResponse.json({ success: false, error: '读取留言失败' }, { status: 500 });
  }
}

/* ── POST：贴便签（服务端校验 + 限流） ── */
export async function POST(request: Request) {
  try {
    const ip = getClientIP(request);

    if (!rateLimit(`message:${ip}`, 5, 60_000)) {
      return NextResponse.json(
        { success: false, error: '提交太频繁了，请稍后再试' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: '请求格式不正确' }, { status: 400 });
    }

    const name = cleanText((body as any).name, MAX_NAME);
    const email = cleanText((body as any).email, MAX_EMAIL);
    const content = cleanText((body as any).content, MAX_CONTENT);
    const ownerPassword = cleanText((body as any).owner_password, 200);

    // 只有密码正确才写入站长邮箱；否则冒填站长邮箱会被清空
    const storedEmail = resolveStoredEmail(email, ownerPassword);

    if (!name) {
      return NextResponse.json({ success: false, error: '请填写昵称' }, { status: 400 });
    }
    if (!content) {
      return NextResponse.json({ success: false, error: '请填写留言内容' }, { status: 400 });
    }
    if (email && !isValidEmail(email)) {
      return NextResponse.json({ success: false, error: '邮箱格式不正确' }, { status: 400 });
    }

    const queryIp = getQueryIP(ip, process.env.NODE_ENV || 'production');
    const geoInfo = await getGeoInfo(queryIp);

    const { error } = await supabase
      .from('messages')
      .insert({
        name,
        email: storedEmail,
        content,
        ip_address: ip,
        country: geoInfo.country,
        region: geoInfo.region
      });

    if (error) throw error;

    await sendNotification({
      type: 'message',
      name,
      content,
      email,
      country: geoInfo.country,
      region: geoInfo.region,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Messages POST Error:', error);
    return NextResponse.json({ success: false, error: '提交失败，请稍后重试' }, { status: 500 });
  }
}
