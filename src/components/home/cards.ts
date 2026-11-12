import type { ComponentType } from 'react';
import AboutCard from './AboutCard';
import CalendarCard from './CalendarCard';
import ClockCard from './ClockCard';
import AnnouncementCard from './AnnouncementCard';
import MusicCard from './MusicCard';
import DailyGifCard from './DailyGifCard';

/*
 * ══════════ 首页泡泡卡片注册表 ══════════
 *
 * 加一张新卡片只要两步：
 *   1. 新建 XxxCard.tsx
 *   2. 在下面的 CARDS 里加一行
 *
 * 不需要再动 page.tsx —— 以前要改 4 个地方（import、颜色表、数组、组件），
 * 现在只有这一处。
 *
 * ── 字段说明 ──
 *   id        物理引擎的标识，必须唯一
 *   size      气泡直径（px）
 *   color     连线与环绕粒子的强调色
 *   Component 卡片组件，接收 { isHovered }
 *
 * ── 新卡片怎么写（骨架见 Card.tsx）──
 *
 *   'use client';
 *   import Card from './Card';
 *
 *   export default function FooCard({ isHovered = false }: { isHovered?: boolean }) {
 *     return (
 *       <Card
 *         className="bg-gradient-to-br from-sky-50 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30"
 *         isHovered={isHovered}
 *       >
 *         <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">标题</h3>
 *         <p className="text-[11px] text-gray-500 dark:text-gray-400">内容</p>
 *       </Card>
 *     );
 *   }
 */
export interface CardDef {
  id: string;
  size: number;
  color: string;
  Component: ComponentType<{ isHovered?: boolean }>;
}

export const CARDS: CardDef[] = [
  { id: 'about', size: 220, color: '#6366f1', Component: AboutCard },
  { id: 'calendar', size: 200, color: '#f59e0b', Component: CalendarCard },
  { id: 'clock', size: 160, color: '#06b6d4', Component: ClockCard },
  { id: 'announcement', size: 170, color: '#f43f5e', Component: AnnouncementCard },
  { id: 'music', size: 155, color: '#f97316', Component: MusicCard },
  { id: 'dailygif', size: 185, color: '#10b981', Component: DailyGifCard },
];

/**
 * 按 id 查强调色，给连线与环绕粒子用。
 * 从 CARDS 派生，所以不用两处维护颜色。
 */
export const CARD_COLORS: Record<string, string> = Object.fromEntries(
  CARDS.map((c) => [c.id, c.color]),
);
