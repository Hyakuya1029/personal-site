import Card from './Card';

interface PortfolioCardProps {
  isHovered?: boolean;
}

export default function PortfolioCard({ isHovered = false }: PortfolioCardProps) {
  return (
    <Card className="bg-gradient-to-br from-sky-50 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30" isHovered={isHovered}>
      <div className="flex flex-col items-center text-center">
        <div className="w-10 h-10 rounded-full bg-sky-200 dark:bg-sky-800 flex items-center justify-center mb-3">
          <svg className="w-5 h-5 text-sky-600 dark:text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">作品集</h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
          展示我的项目作品
        </p>
      </div>
    </Card>
  );
}
