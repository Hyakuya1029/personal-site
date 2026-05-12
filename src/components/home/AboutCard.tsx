'use client';

import { useState, useEffect } from 'react';
import Card from './Card';
import { supabase } from '@/lib/supabase';

interface AboutCardProps {
  isHovered?: boolean;
}

function getGreeting(hour: number): string {
  if (hour >= 6 && hour < 11) return '早安，又是新一天';
  if (hour >= 11 && hour < 14) return '午安，记得按时吃饭';
  if (hour >= 14 && hour < 18) return '下午好，保持开心哦';
  if (hour >= 18 && hour < 24) return '晚上好，一天过了呢';
  return '夜深了，早点休息哦';
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '刚刚';
  if (mins < 60) return `${mins} 分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} 天前`;
  return `${Math.floor(days / 30)} 个月前`;
}

export default function AboutCard({ isHovered = false }: AboutCardProps) {
  const [greeting, setGreeting] = useState<string>('');
  const [lastActive, setLastActive] = useState<string>('');

  useEffect(() => {
    setGreeting(getGreeting(new Date().getHours()));

    Promise.all([
      supabase.from('comments').select('created_at').order('created_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('messages').select('created_at').order('created_at', { ascending: false }).limit(1).maybeSingle(),
    ]).then(([c, m]) => {
      const times = [c.data?.created_at, m.data?.created_at].filter(Boolean).map(t => new Date(t));
      if (times.length > 0) {
        setLastActive(timeAgo(new Date(Math.max(...times.map(t => t.getTime())))));
      }
    });
  }, []);

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-sky-50 to-purple-100 dark:from-sky-900/30 dark:to-purple-900/30" isHovered={isHovered}>
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-md mb-2">
          <img src="/avatar.jpg" alt="avatar" className="w-full h-full object-cover" />
        </div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">Hyakuya</h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2 leading-relaxed">
          开发者 / 创作者
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed min-h-[1rem]">
          {greeting || '欢迎来到我的网站'}
        </p>
        {lastActive && (
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">
            站点动态 · {lastActive}
          </p>
        )}
      </div>
    </Card>
  );
}