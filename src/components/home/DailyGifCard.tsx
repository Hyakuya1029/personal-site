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
 * 每日表情包卡片。
 * 图片/视频用 absolute 铺满卡片（Card 本身是 rounded-full + overflow-hidden），
 * 所以内容会被裁成一个圆 —— 素材构图请把主体放在中间。
 */
export default function DailyGifCard({ isHovered = false }: DailyGifCardProps) {
  const { data, error } = useApiData<DailyGifData>('/api/daily-gif');
  const [failed, setFailed] = useState(false);

  const blocked = failed || error;
  const hasMedia = Boolean(data?.src) && !blocked;
  // 按扩展名决定用 <video> 还是 <img>，mp4/webm 比动图更小
  const isVideo = Boolean(data?.file && /\.(mp4|webm)$/i.test(data.file));
  // 区分两种失败：接口挂了 vs 文件路径不对（漏写扩展名之类）
  const emptyHint = failed ? '素材缺失' : error ? '读取失败' : data ? '今日暂无' : '加载中…';

  return (
    <Card
      className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/20"
      isHovered={isHovered}
    >
      {hasMedia ? (
        <div className="flex w-full flex-col items-center">
          {/* 标题：占一行文字位，避免一张抽象表情直接糊满整个圆 */}
          <h3 className="mb-1.5 text-[13px] font-semibold leading-tight text-gray-800 dark:text-gray-200">
            今日表情包
          </h3>

          {/* 表情窗口：缩进圆内，四周露出卡片底色，形成一圈留白 */}
          <div className="h-[100px] w-[100px] shrink-0 overflow-hidden rounded-full ring-1 ring-black/5 dark:ring-white/10">
            {isVideo ? (
              <video
                className="h-full w-full object-cover"
                src={data!.src!}
                autoPlay
                muted
                loop
                playsInline
                onError={() => setFailed(true)}
              />
            ) : (
              <img
                className="h-full w-full object-cover"
                src={data!.src!}
                alt={data?.caption ?? '今日表情包'}
                onError={() => setFailed(true)}
              />
            )}
          </div>

          {/* 配文：默认隐藏，鼠标放上去才淡入。
              保留占位行，避免悬停时卡片内容上下跳动。 */}
          <p
            className={`mt-1.5 max-w-full truncate px-1 text-[10px] leading-tight text-gray-500 dark:text-gray-400 transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {data?.caption || data?.date}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-200 dark:bg-emerald-800">
            <svg
              className="h-4 w-4 text-emerald-700 dark:text-emerald-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0019.5 3H4.5A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21z"
              />
            </svg>
          </div>
          <h3 className="mb-1 text-base font-semibold text-gray-800 dark:text-gray-200">今日表情包</h3>
          <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
            {emptyHint}
          </p>
        </div>
      )}
    </Card>
  );
}
