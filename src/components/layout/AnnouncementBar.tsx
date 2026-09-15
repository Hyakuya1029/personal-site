'use client';

import { useEffect, useState } from 'react';

interface Announcement {
  id: number;
  content: string;
}

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetch('/api/announcements?location=banner')
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setAnnouncements(json.data);
        }
      })
      .catch((error) => console.warn('[公告条] 读取失败:', error));
  }, []);

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
