'use client';

import { useEffect, useState } from 'react';
import Card from './Card';
import { supabase } from '@/lib/supabase';

interface AnnouncementCardProps {
  isHovered?: boolean;
}

export default function AnnouncementCard({ isHovered = false }: AnnouncementCardProps) {
  const [text, setText] = useState('');

  useEffect(() => {
    supabase
      .from('announcements')
      .select('content')
      .eq('active', true)
      .in('location', ['card', 'both'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setText(data.content);
      });
  }, []);

  return (
    <Card className="bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/20" isHovered={isHovered}>
      <div className="flex flex-col items-center text-center max-w-full px-2">
        <div className="w-10 h-10 rounded-full bg-rose-200 dark:bg-rose-800 flex items-center justify-center mb-3">
          <svg className="w-5 h-5 text-rose-600 dark:text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">公告栏</h3>
        {text ? (
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
            {text}
          </p>
        ) : (
          <p className="text-[11px] text-gray-400 dark:text-gray-500 italic">暂无动态</p>
        )}
      </div>
    </Card>
  );
}
