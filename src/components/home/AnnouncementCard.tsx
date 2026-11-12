'use client';

import Card from './Card';
import { useApiData } from '@/hooks/useApiData';

interface Announcement {
  id: number;
  content: string;
  location: string;
}

interface AnnouncementCardProps {
  isHovered?: boolean;
}

export default function AnnouncementCard({ isHovered = false }: AnnouncementCardProps) {
  // 和顶部公告条共用同一个 URL，靠 useApiData 的去重只真正请求一次
  const { data } = useApiData<Announcement[]>('/api/announcements');

  const text =
    (data ?? []).find((a) => a.location === 'card' || a.location === 'both')?.content ?? '';

  return (
    <Card className="bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/20" isHovered={isHovered}>
      <div className="flex max-w-full flex-col items-center px-1 text-center">
        <h3 className="mb-2 text-base font-semibold text-gray-800 dark:text-gray-200">公告栏</h3>
        {text ? (
          <p className="text-[11px] leading-relaxed text-gray-500 line-clamp-4 dark:text-gray-400">
            {text}
          </p>
        ) : (
          <p className="text-[11px] italic text-gray-400 dark:text-gray-500">暂无动态</p>
        )}
      </div>
    </Card>
  );
}
