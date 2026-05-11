import type { Metadata } from 'next';
import FriendList from './FriendList';

interface Friend {
  id: number;
  name: string;
  avatar: string;
  url: string;
  description: string;
  tags: string[];
}

const friends: Friend[] = [];

/*
// ========== 示例友链（取消注释即可使用）==========

const _example: Friend[] = [
  {
    id: 1,
    name: '张三的博客',
    avatar: 'https://avatars.githubusercontent.com/u/12345678',  // 头像 URL（支持外链或本地路径）
    url: 'https://zhangsan.dev',                                  // 对方网站地址
    description: '全栈开发者，热爱开源与分享',
    tags: ['技术', '全栈'],                                        // 标签用于分类筛选，可填多个
  },
  {
    id: 2,
    name: '设计美学',
    avatar: '/images/friends/design.png',                         // 也可以用本地图片
    url: 'https://design-aesthetics.com',
    description: '分享 UI/UX 设计灵感与案例',
    tags: ['设计', 'UI/UX'],
  },
  {
    id: 3,
    name: '摄影日记',
    avatar: 'https://example.com/avatar.jpg',
    url: 'https://photo-diary.cn',
    description: '记录日常拍摄的瞬间',
    tags: ['生活', '摄影'],
  },
  {
    id: 4,
    name: '算法题库',
    avatar: '/images/friends/algo.png',
    url: 'https://algo-practice.com',
    description: 'LeetCode 题解与算法学习笔记',
    tags: ['技术', '算法'],
  },
];
*/

export const metadata: Metadata = {
  title: '友链',
  description: '分享有趣网站和好友页面',
};

export default function FriendsPage() {
  const allTags = Array.from(new Set(friends.flatMap(f => f.tags)));

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">友情链接</h1>
        <p className="text-gray-600 dark:text-gray-400">分享有趣网站和好友页面</p>
      </header>
      <FriendList friends={friends} allTags={allTags} />
      <div className="mt-12 text-center">
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          想要交换友链？欢迎通过留言或邮件联系我！
        </p>
      </div>
    </main>
  );
}
