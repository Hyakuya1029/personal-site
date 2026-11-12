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

/*
 * 作品集列表。
 * 注意 image 的写法：public/ 目录直接映射到站点根路径，
 * 所以 public/portfolio/xxx.png 对应的就是 '/portfolio/xxx.png'
 * （不要加 /public 前缀，也不要再套引号）。
 */
const projects: Project[] = [
  {
    id: 1,
    title: '星签',
    description: '赛博算命',
    image: '/portfolio/fortune/fortune-text-360x150.png',
    tags: ['Next.js', 'React', 'TypeScript', '工具', '娱乐'],
    category: '前端',
    githubUrl: 'https://github.com/Hyakuya1029/fortune-telling',
    demoUrl: 'https://fortune.hyakuya.cc.cd/',
  },
];

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
