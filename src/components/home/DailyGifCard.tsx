'use client';

import { useState } from 'react';
import Card from './Card';
import { useApiData } from '@/hooks/useApiData';

interface DailyGifData {
  date: string;
  total: number;
  file: string | null;
  caption?: string;
  src: string | null;
}

interface DailyGifCardProps {
  isHovered?: boolean;
}

/*
 * 今日表情包卡片 —— 一颗还没戳开的小气泡。
 *
 * 收起态：皂泡质感的圆窗（高光 + 缓慢呼吸）+ 下方「点开看看」胶囊，
 *   让人一看就知道这颗能戳；此时不挂载 <img>，没点开的访客不会下载那张图。
 * 展开态：表情「啵」地弹出来（meme-pop），圆窗外圈提亮。
 *
 * 两态的圆窗同为 96px、下方文字槽同为 18px，所以切换时卡片内容不跳动。
 */
export default function DailyGifCard({ isHovered = false }: DailyGifCardProps) {
  const { data, error } = useApiData<DailyGifData>('/api/daily-gif');
  const [mediaFailed, setMediaFailed] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const hasMedia = Boolean(data?.src) && !mediaFailed && !error;
  // 按扩展名决定用 <video> 还是 <img>，mp4/webm 比动图更小
  const isVideo = Boolean(data?.file && /\.(mp4|webm)$/i.test(data.file));
  // 区分两种失败：接口挂了 vs 图取不到（文件被删/改名，或列表过期）
  // 图片失败时给一句「点一下重试」，别让卡片永久卡死
  const hint = mediaFailed
    ? '素材缺失，点一下重试'
    : error
      ? '读取失败'
      : data
        ? '今日暂无'
        : '加载中…';
  // 图注可选；没写就留空，不拿日期来顶替
  const caption = data?.caption ?? '';

  // 没有可展示的素材时只给一行说明，不做展开交互
  if (!hasMedia) {
    return (
      <Card
        className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/20"
        isHovered={isHovered}
      >
        <div
          className={`flex flex-col items-center text-center ${mediaFailed ? 'cursor-pointer' : ''}`}
          onClick={() => {
            // 重试：清掉失败标记，让 <img> 重新挂载再试一次
            if (mediaFailed) {
              setMediaFailed(false);
              setRevealed(true);
            }
          }}
        >
          <h3 className="mb-1 text-base font-semibold text-gray-800 dark:text-gray-200">今日表情包</h3>
          <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">{hint}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/20"
      isHovered={isHovered}
    >
      <div
        className="flex w-full cursor-pointer select-none flex-col items-center"
        role="button"
        tabIndex={0}
        aria-expanded={revealed}
        onClick={() => setRevealed((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setRevealed((v) => !v);
          }
        }}
      >
        <h3 className="mb-1.5 text-[13px] font-semibold leading-tight text-gray-800 dark:text-gray-200">
          今日表情包
        </h3>

        <div className="relative h-[94px] w-[94px] shrink-0">
          {revealed ? (
            /* ── 展开：表情啵地弹出来 ── */
            <div className="meme-reveal h-full w-full overflow-hidden rounded-full shadow-[inset_0_-4px_10px_-6px_rgba(0,0,0,0.25),0_8px_20px_-8px_rgba(16,185,129,0.55)] ring-1 ring-emerald-900/10 dark:ring-white/25">
              {isVideo ? (
                <video
                  className="h-full w-full object-cover dark:brightness-95"
                  src={data!.src!}
                  autoPlay
                  muted
                  loop
                  playsInline
                  onError={() => setMediaFailed(true)}
                />
              ) : (
                <img
                  className="h-full w-full object-cover dark:brightness-95"
                  src={data!.src!}
                  alt={data?.caption ?? '今日表情包'}
                  onError={() => setMediaFailed(true)}
                />
              )}
            </div>
          ) : (
            /* ── 收起：皂泡球体，缓慢呼吸 ── */
            <div className="meme-lid meme-orb h-full w-full overflow-hidden rounded-full ring-1 ring-white/60 dark:ring-white/10" />
          )}
        </div>

        {/* 固定 20px 高的文字槽：收起放提示胶囊，展开放图注（没有图注就留空） */}
        <div className="mt-1.5 flex h-5 items-center justify-center">
          {revealed ? (
            caption ? (
              <span className="block max-w-full truncate px-1 text-[10px] leading-none text-gray-500 dark:text-gray-400">
                {caption}
              </span>
            ) : null
          ) : (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-white px-2.5 py-[3px] text-[11px] font-semibold leading-none text-emerald-700 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.6)] ring-1 ring-emerald-300/70 dark:bg-emerald-100 dark:text-emerald-800 dark:ring-emerald-200/30">
              点开看看
              <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
