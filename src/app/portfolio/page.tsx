import type { Metadata } from 'next';
import ProjectList from './ProjectList';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
  githubUrl?: string;
  demoUrl?: string;
}

const projects: Project[] = [];

/*
// ========== 示例项目（取消注释即可使用）==========

const _example: Project[] = [
  {
    id: 1,
    title: '电商平台',
    description: '基于 Next.js 的全栈电商平台，支持商品搜索、购物车、订单管理等功能',
    image: '/images/projects/ecommerce.png',
    tags: ['Next.js', 'TypeScript', 'Prisma'],
    category: '全栈',
    githubUrl: 'https://github.com/yourname/ecommerce',
    demoUrl: 'https://ecommerce-demo.vercel.app',
  },
  {
    id: 2,
    title: '天气小程序',
    description: '微信小程序，实时天气查询与7天预报，支持城市搜索',
    image: '/images/projects/weather.png',
    tags: ['WeChat', 'Vue.js'],
    category: '小程序',
  },
  {
    id: 3,
    title: '组件库',
    description: '基于 Tailwind CSS 的 React 组件库，包含 30+ 常用组件',
    image: '/images/projects/ui-lib.png',
    tags: ['React', 'Tailwind CSS', 'Storybook'],
    category: '库/工具',
    githubUrl: 'https://github.com/yourname/ui-lib',
  },
];
*/

export const metadata: Metadata = {
  title: '作品集',
  description: '展示我的项目作品和技术成果',
};

export default function PortfolioPage() {
  const categories = Array.from(new Set(projects.map(p => p.category)));

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">作品集</h1>
        <p className="text-gray-600 dark:text-gray-400">展示我的项目作品和技术成果</p>
      </header>
      <ProjectList projects={projects} categories={categories} />
    </main>
  );
}
