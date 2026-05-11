'use client';

import { useState, useEffect } from 'react';
import Card from './Card';

interface AboutCardProps {
  isHovered?: boolean;
}

function getGreeting(hour: number): string {
  if (hour >= 6 && hour < 8) return '早上好，新的一天开始了';
  if (hour >= 8 && hour < 12) return '上午好，早起努力真勤奋';
  if (hour >= 12 && hour < 14) return '中午好，记得按时吃饭';
  if (hour >= 14 && hour < 18) return '下午好，效率最高的时候';
  if (hour >= 18 && hour < 24) return '晚上好，享受自由的时光';
  return '夜深了，早点休息哦';
}

export default function AboutCard({ isHovered = false }: AboutCardProps) {
  const [greeting, setGreeting] = useState<string>('');

  useEffect(() => {
    setGreeting(getGreeting(new Date().getHours()));
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
      </div>
    </Card>
  );
}