import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const postId = request.nextUrl.searchParams.get('post_id');

    let query = supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (postId) {
      query = query.eq('post_id', postId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Resources API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
