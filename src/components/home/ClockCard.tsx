'use client';

import { useState, useEffect } from 'react';
import Card from './Card';

interface ClockCardProps {
  isHovered?: boolean;
}

const TICK_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

export default function ClockCard({ isHovered = false }: ClockCardProps) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return (
      <Card className="bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30" isHovered={isHovered}>
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
    <Card className="bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30" isHovered={isHovered}>
      <div className="flex flex-col items-center">
        <svg
          width={110}
          height={110}
          viewBox="0 0 110 110"
          className="drop-shadow-sm"
        >
          {/* tick marks */}
          {TICK_ANGLES.map((angle) => {
            const isHour = angle % 90 === 0;
            return (
              <line
                key={angle}
                x1={55}
                y1={isHour ? 8 : 10}
                x2={55}
                y2={isHour ? 18 : 16}
                stroke={isHour ? '#7c3aed' : '#c4b5fd'}
                strokeWidth={isHour ? 2 : 1}
                strokeLinecap="round"
                transform={`rotate(${angle} 55 55)`}
                className={isHour ? 'dark:stroke-violet-300' : 'dark:stroke-violet-700'}
              />
            );
          })}

          {/* hour hand */}
          <line
            x1={55} y1={55}
            x2={55} y2={28}
            stroke="#7c3aed"
            strokeWidth={3}
            strokeLinecap="round"
            transform={`rotate(${hourAngle} 55 55)`}
            className="dark:stroke-violet-300"
          />

          {/* minute hand */}
          <line
            x1={55} y1={55}
            x2={55} y2={18}
            stroke="#8b5cf6"
            strokeWidth={2}
            strokeLinecap="round"
            transform={`rotate(${minuteAngle} 55 55)`}
            className="dark:stroke-violet-400"
          />

          {/* second hand */}
          <line
            x1={55} y1={62}
            x2={55} y2={14}
            stroke="#ef4444"
            strokeWidth={1}
            strokeLinecap="round"
            transform={`rotate(${secondAngle} 55 55)`}
          />

          {/* center pin */}
          <circle cx={55} cy={55} r={3.5} fill="#7c3aed" className="dark:fill-violet-300" />
          <circle cx={55} cy={55} r={1.5} fill="#fff" className="dark:fill-gray-800" />
        </svg>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 tabular-nums tracking-wider">
          {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
        </p>
      </div>
    </Card>
  );
}
