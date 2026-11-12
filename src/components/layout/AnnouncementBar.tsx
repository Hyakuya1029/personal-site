'use client';

import { useApiData } from '@/hooks/useApiData';

interface Announcement {
  id: number;
  content: string;
  location: string;
}

export default function AnnouncementBar() {
  // 和首页的公告栏卡片共用同一个 URL，靠 useApiData 的去重只真正请求一次
  const { data } = useApiData<Announcement[]>('/api/announcements');

  const announcements = (data ?? []).filter(
    (a) => a.location === 'banner' || a.location === 'both'
  );

  if (announcements.length === 0) return null;

  return (
    <div className="bg-sky-500/10 border-b border-sky-200 dark:border-sky-800 text-sm text-center">
      {announcements.map((a) => (
        <div
          key={a.id}
          className="py-2 px-4 text-sky-700 dark:text-sky-300"
        >
          {a.content}
        </div>
      ))}
    </div>
  );
}
