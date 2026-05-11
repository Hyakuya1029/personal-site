import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  isHovered?: boolean;
}

export default function Card({
  children,
  className = '',
  isHovered = false
}: CardProps) {
  return (
    <div
      className={`
        w-full h-full
        bubble-card rounded-full
        bg-white dark:bg-gray-800 shadow-lg border border-white/70 dark:border-gray-700/50
        transition-all duration-400 ease-out
        cursor-pointer
        flex flex-col items-center justify-center p-3 sm:p-5
        overflow-hidden
        ${isHovered
          ? 'ring-2 ring-sky-400/40 shadow-2xl'
          : ''
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">{children}</h3>;
}

export function CardDescription({ children }: { children: ReactNode }) {
  return <p className="text-xs text-gray-500 dark:text-gray-400 text-center">{children}</p>;
}
