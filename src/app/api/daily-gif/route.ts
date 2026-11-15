import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { dayKey, pickForDay, secondsUntilNextDay, type MemeFile } from '@/lib/dailyGif';

// 每天的答案不同，且文件列表随时可能变，禁止构建期静态化
export const dynamic = 'force-dynamic';
// 连 fetch 层也一起关掉缓存：Next 会把请求结果落到 .next/cache，
// 删了文件之后接口仍在返回旧文件名，表现为卡片「素材缺失」。
export const fetchCache = 'force-no-store';

const BUCKET = 'daily-gif';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false },
    // 双保险：客户端内部所有请求都显式 no-store
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        fetch(input, { ...init, cache: 'no-store' }),
    },
  }
);

/*
 * 文件列表在进程内缓存 60 秒。
 * 不加这一层的话，每个访客每天都会去列一次 Storage；
 * 缓存之后同一实例上每分钟内的请求都复用同一份列表。
 */
let cached: { at: number; files: MemeFile[] } | null = null;
const LIST_TTL_MS = 60_000;

async function listMemes(): Promise<MemeFile[]> {
  if (cached && Date.now() - cached.at < LIST_TTL_MS) return cached.files;

  const { data, error } = await supabase.storage.from(BUCKET).list('', { limit: 200 });
  if (error) throw error;

  const files: MemeFile[] = (data ?? [])
    // 列目录时文件夹也会出现在结果里（id 为 null），过滤掉
    .filter((f) => f.id !== null && !f.name.startsWith('.'))
    .map((f) => ({
      name: f.name,
      url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
    }))
    // 按文件名排序：保证同一份文件列表每次得到的顺序完全一致，否则日期哈希会漂
    .sort((a, b) => a.name.localeCompare(b.name));

  cached = { at: Date.now(), files };
  return files;
}

export async function GET() {
  try {
    const files = await listMemes();
    const date = dayKey();
    const meme = pickForDay(files);

    // 今天的答案到上海时间零点才变，让 CDN 缓存到那时候；
    // 但上限压到 5 分钟 —— 一旦 bucket 里的文件被改名/删除，
    // 缓存的旧地址最多拖 5 分钟就能自愈，不用等一小时。
    const maxAge = Math.min(secondsUntilNextDay(), 300);

    return NextResponse.json(
      {
        success: true,
        data: {
          date,
          total: files.length,
          file: meme?.name ?? null,
          src: meme?.url ?? null,
        },
      },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=600`,
        },
      }
    );
  } catch (error: any) {
    console.error('Daily GIF API Error:', error);
    return NextResponse.json({ success: false, error: '读取今日表情包失败' }, { status: 500 });
  }
}
