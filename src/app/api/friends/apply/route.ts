import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getGeoInfo, getClientIP, getQueryIP } from '@/lib/geo';
import { sendNotification } from '@/lib/notify';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const ip = getClientIP(request);
    const queryIp = getQueryIP(ip, process.env.NODE_ENV || 'production');
    const geoInfo = await getGeoInfo(queryIp);

    const { error } = await supabase
      .from('friend_applications')
      .insert({
        name: body.name,
        email: body.email || '',
        url: body.url,
        avatar: body.avatar || '',
        description: body.description,
        tags: body.tags || [],
        ip_address: ip,
        country: geoInfo.country,
        region: geoInfo.region,
      });

    if (error) throw error;

    await sendNotification({
      type: 'friend_application',
      name: body.name,
      content: body.description,
      email: body.email,
      url: body.url,
      tags: body.tags,
      country: geoInfo.country,
      region: geoInfo.region,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Friends Apply API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
