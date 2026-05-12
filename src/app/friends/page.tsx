import type { Metadata } from 'next';
import FriendsContent from './FriendsContent';

export const metadata: Metadata = {
  title: '友链',
  description: '分享有趣网站和好友页面',
};

export default function FriendsPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">友情链接</h1>
        <p className="text-gray-600 dark:text-gray-400">分享其它网站和好友页面</p>
      </header>
      <FriendsContent />
    </main>
  );
}
