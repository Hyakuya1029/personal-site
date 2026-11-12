import { NextResponse } from 'next/server';
import { getDailyGif } from '@/lib/dailyGif';

// 「每日」的答案每天都在变，必须每次请求实时计算，
// 否则会被构建期静态化，永远冻在部署那天的结果上。
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: getDailyGif() });
  } catch (error: any) {
    console.error('Daily GIF API Error:', error);
    return NextResponse.json({ success: false, error: '读取每日表情包失败' }, { status: 500 });
  }
}
