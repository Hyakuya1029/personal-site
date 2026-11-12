'use client';

import { useState, useEffect } from 'react';
import Card from './Card';

interface CalendarCardProps {
  isHovered?: boolean;
}

const WEEK_NAMES = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

export default function CalendarCard({ isHovered = false }: CalendarCardProps) {
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  // 加载态：用同样版式的占位符，避免真实日期出现时版面跳动
  if (!today) {
    return (
      <Card className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40" isHovered={isHovered}>
        <div className="relative z-10 flex h-full flex-col items-center justify-center">
          <div className="mb-1 text-xs text-gray-400 dark:text-gray-500">----年</div>
          <div className="text-3xl font-bold leading-tight text-gray-300 dark:text-gray-600">--月--日</div>
          <div className="mt-1.5 text-sm text-gray-300 dark:text-gray-600">--</div>
        </div>
      </Card>
    );
  }

  const year = today.getFullYear();

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40" isHovered={isHovered}>
      {/*
        按日常读日期的顺序排：年份 → 几月几日 → 星期几。
        原来那句「公历」是历法术语，日常看日期没人会说，去掉了；
        星期几用完整汉字而不是 S~F 字母条，一眼就知道「今天周几」。
      */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">{year}年</div>
        <div className="text-3xl font-bold leading-tight text-gray-800 dark:text-gray-100">
          {today.getMonth() + 1}月{today.getDate()}日
        </div>
        <div className="mt-1.5 text-sm font-medium text-sky-600 dark:text-sky-400">
          {WEEK_NAMES[today.getDay()]}
        </div>
      </div>
    </Card>
  );
}
