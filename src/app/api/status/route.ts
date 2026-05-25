import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const OWNER_EMAIL_HASH = 'ff490a56a53b0ace81946843079a5ba1cde9e808c55bb99f51c4b89534d7ae45';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function hashEmail(email: string): string {
  return crypto.createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email || '';

    if (hashEmail(email) !== OWNER_EMAIL_HASH) {
      return NextResponse.json({ success: false, error: '无权操作' }, { status: 403 });
    }

    const { error } = await supabase
      .from('status_posts')
      .insert({ email, content: body.content });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Status API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
