'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Announcement {
  id: number;
  content: string;
}

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    supabase
      .from('announcements')
      .select('id, content')
      .eq('active', true)
      .in('location', ['banner', 'both'])
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setAnnouncements(data);
      });
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
