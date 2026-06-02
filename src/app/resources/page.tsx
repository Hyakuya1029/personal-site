import type { Metadata } from 'next';
import ResourceList from './ResourceList';

export const metadata: Metadata = {
  title: '资源下载',
  description: '可下载的文件资源，包括 PDF、代码、图片等',
};

export default function ResourcesPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">资源下载</h1>
        <p className="text-gray-600 dark:text-gray-400">分享一些可能有用的文件资源</p>
      </header>

      <ResourceList />
    </main>
  );
}
