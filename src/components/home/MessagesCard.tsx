import Card from './Card';

interface MessagesCardProps {
  isHovered?: boolean;
}

export default function MessagesCard({ isHovered = false }: MessagesCardProps) {
  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/30 dark:to-green-900/20" isHovered={isHovered}>
      <div className="flex flex-col items-center text-center">
        <div className="w-10 h-10 rounded-full bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center mb-3">
          <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">留言墙</h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
          留下你想说的话
        </p>
      </div>
    </Card>
  );
}
