import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getGeoInfo, getClientIP, getQueryIP } from '@/lib/geo';
import { sendNotification } from '@/lib/notify';
import { cleanText, cleanTagList, isValidEmail, isValidHttpUrl } from '@/lib/validate';
import { rateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const ip = getClientIP(request);

    if (!rateLimit(`friend:${ip}`, 3, 300_000)) {
      return NextResponse.json(
        { success: false, error: '提交太频繁了，请稍后再试' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: '请求格式不正确' }, { status: 400 });
    }

    const name = cleanText((body as any).name, 40);
    const url = cleanText((body as any).url, 300);
    const description = cleanText((body as any).description, 300);
    const email = cleanText((body as any).email, 120);
    const avatar = cleanText((body as any).avatar, 300);
    const tags = cleanTagList((body as any).tags, 8, 20);

    if (!name) {
      return NextResponse.json({ success: false, error: '请填写网站名称' }, { status: 400 });
    }
    if (!url || !isValidHttpUrl(url)) {
      return NextResponse.json(
        { success: false, error: '网站链接必须是 http(s) 开头的完整地址' },
        { status: 400 }
      );
    }
    if (!description) {
      return NextResponse.json({ success: false, error: '请填写网站描述' }, { status: 400 });
    }
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ success: false, error: '请填写正确的联系邮箱' }, { status: 400 });
    }
    if (avatar && !isValidHttpUrl(avatar)) {
      return NextResponse.json(
        { success: false, error: '头像链接必须是 http(s) 开头的完整地址' },
        { status: 400 }
      );
    }

    const queryIp = getQueryIP(ip, process.env.NODE_ENV || 'production');
    const geoInfo = await getGeoInfo(queryIp);

    const { error } = await supabase
      .from('friend_applications')
      .insert({
        name,
        email,
        url,
        avatar,
        description,
        tags,
        ip_address: ip,
        country: geoInfo.country,
        region: geoInfo.region,
      });

    if (error) throw error;

    await sendNotification({
      type: 'friend_application',
      name,
      content: description,
      email,
      url,
      tags,
      country: geoInfo.country,
      region: geoInfo.region,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Friends Apply POST Error:', error);
    return NextResponse.json({ success: false, error: '提交失败，请稍后重试' }, { status: 500 });
  }
}
