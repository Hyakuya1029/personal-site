import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAllPosts } from '@/lib/posts';

// 动态数据源：禁止构建期静态化
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/* 首页站点统计 + 最近活跃时间（由服务端聚合，前端不再直连数据库） */
export async function GET() {
  try {
    const [comments, messages, friends, statuses, lastComment, lastMessage, lastStatus] =
      await Promise.all([
        supabase.from('comments').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }),
        supabase
          .from('friend_applications')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'approved'),
        supabase.from('status_posts').select('id', { count: 'exact', head: true }),
        supabase
          .from('comments')
          .select('created_at')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('messages')
          .select('created_at')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('status_posts')
          .select('created_at')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

    const times = [lastComment.data?.created_at, lastMessage.data?.created_at, lastStatus.data?.created_at]
      .filter(Boolean)
      .map((t) => new Date(t as string).getTime())
      .filter((t) => !Number.isNaN(t));

    return NextResponse.json({
      success: true,
      data: {
        posts: getAllPosts().length,
        comments: comments.count ?? 0,
        messages: messages.count ?? 0,
        friends: friends.count ?? 0,
        statuses: statuses.count ?? 0,
        lastActive: times.length > 0 ? new Date(Math.max(...times)).toISOString() : null,
      },
    });
  } catch (error: any) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ success: false, error: '读取统计失败' }, { status: 500 });
  }
}
