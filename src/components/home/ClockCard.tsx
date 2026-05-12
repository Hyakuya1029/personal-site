'use client';

import { useState, useEffect } from 'react';
import Card from './Card';

interface ClockCardProps {
  isHovered?: boolean;
}

const TICK_ANGLES = Array.from({ length: 60 }, (_, i) => i * 6);

export default function ClockCard({ isHovered = false }: ClockCardProps) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return (
      <Card className="bg-gradient-to-br from-cyan-50 to-teal-100 dark:from-cyan-900/30 dark:to-teal-900/20" isHovered={isHovered}>
        <div className="flex flex-col items-center justify-center h-full">
          <span className="text-2xl font-bold text-gray-400 dark:text-gray-300">--:--</span>
        </div>
      </Card>
    );
  }

  const h = time.getHours();
  const m = time.getMinutes();
  const s = time.getSeconds();
  const hourAngle = (h % 12) * 30 + m * 0.5;
  const minuteAngle = m * 6 + s * 0.1;
  const secondAngle = s * 6;

  return (
    <Card className="bg-gradient-to-br from-cyan-50 to-teal-100 dark:from-cyan-900/30 dark:to-teal-900/20" isHovered={isHovered}>
      <div className="flex flex-col items-center">
        <svg
          viewBox="0 0 120 120"
          className="drop-shadow-sm w-[90px] h-[90px] sm:w-[120px] sm:h-[120px]"
        >
          {/* tick marks */}
          {TICK_ANGLES.map((angle) => {
            const isHour = angle % 30 === 0;
            return (
              <line
                key={angle}
                x1={60}
                y1={isHour ? 10 : 14}
                x2={60}
                y2={isHour ? 22 : 18}
                stroke={isHour ? '#0891b2' : '#67e8f9'}
                strokeWidth={isHour ? 2.5 : 0.8}
                strokeLinecap="round"
                transform={`rotate(${angle} 60 60)`}
                className={isHour ? 'dark:stroke-cyan-300' : 'dark:stroke-cyan-700'}
              />
            );
          })}

          {/* hour hand */}
          <line
            x1={60} y1={60}
            x2={60} y2={30}
            stroke="#0891b2"
            strokeWidth={3}
            strokeLinecap="round"
            transform={`rotate(${hourAngle} 60 60)`}
            className="dark:stroke-cyan-300"
          />

          {/* minute hand */}
          <line
            x1={60} y1={60}
            x2={60} y2={20}
            stroke="#06b6d4"
            strokeWidth={2}
            strokeLinecap="round"
            transform={`rotate(${minuteAngle} 60 60)`}
            className="dark:stroke-cyan-400"
          />

          {/* second hand */}
          <line
            x1={60} y1={64}
            x2={60} y2={16}
            stroke="#ef4444"
            strokeWidth={1}
            strokeLinecap="round"
            transform={`rotate(${secondAngle} 60 60)`}
          />

          {/* center pin */}
          <circle cx={60} cy={60} r={3.5} fill="#0891b2" className="dark:fill-cyan-300" />
          <circle cx={60} cy={60} r={1.5} fill="#fff" className="dark:fill-gray-800" />
        </svg>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 tabular-nums tracking-wider">
          {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
        </p>
      </div>
    </Card>
  );
}
