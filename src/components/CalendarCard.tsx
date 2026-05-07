'use client';

import Card from './Card';
import { CardTitle, CardDescription } from './Card';

interface CalendarCardProps {
  isHovered?: boolean;
}

export default function CalendarCard({ isHovered = false }: CalendarCardProps) {
  const today = new Date();
  const month = today.toLocaleDateString('zh-CN', { month: 'long' });
  const year = today.getFullYear();

  const dayOfWeek = today.getDay();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <Card width="w-64" height="h-56" isHovered={isHovered}>
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-bl-full opacity-30" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="text-4xl font-bold text-gray-800 mb-1">{today.getDate()}</div>
        <div className="text-sm text-gray-500 mb-4">{month} {year}</div>
        
        <div className="grid grid-cols-7 gap-1 text-xs mb-4">
          {weekDays.map((day, index) => (
            <div 
              key={day} 
              className={`w-6 h-6 flex items-center justify-center rounded-full transition-all duration-200 ${
                index === dayOfWeek 
                  ? 'bg-blue-500 text-white font-semibold scale-110' 
                  : 'text-gray-400'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        
        <CardDescription>日历功能</CardDescription>
      </div>
    </Card>
  );
}