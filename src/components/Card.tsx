'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  width?: string;
  height?: string;
  className?: string;
  isHovered?: boolean;
}

export default function Card({ 
  children, 
  width = 'w-72', 
  height = 'h-48', 
  className = '',
  isHovered = false
}: CardProps) {
  return (
    <div
      className={`
        ${width} ${height}
        bg-white rounded-xl shadow-lg
        border border-gray-100
        transition-all duration-300 ease-out
        cursor-pointer
        flex flex-col items-center justify-center p-6
        overflow-hidden
        ${isHovered 
          ? 'scale-110 shadow-2xl z-20 ring-2 ring-blue-500' 
          : 'hover:shadow-xl hover:scale-105'
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-lg font-semibold text-gray-800 mb-2">{children}</h3>;
}

export function CardDescription({ children }: { children: ReactNode }) {
  return <p className="text-sm text-gray-500 text-center">{children}</p>;
}