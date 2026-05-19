'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  tags: string[];
}

export default function InfoSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState({ posts: 0, comments: 0, messages: 0, friends: 0 });

  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then((data: Post[]) => {
        setPosts(data);
        setStats(prev => ({ ...prev, posts: data.length }));
      })
      .catch(() => {});

    // Supabase 统计
    Promise.all([
      supabase.from('comments').select('id', { count: 'exact', head: true }),
      supabase.from('messages').select('id', { count: 'exact', head: true }),
      supabase.from('friend_applications').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    ]).then(([c, m, f]) => {
      setStats(prev => ({
        ...prev,
        comments: c.count ?? 0,
        messages: m.count ?? 0,
        friends: f.count ?? 0,
      }));
    }).catch(() => {});
  }, []);

  return (
    <section className="relative bg-white dark:bg-gray-900 pt-20 pb-32 px-4">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* 左栏 — 卡片组 */}
        <div className="lg:w-[260px] shrink-0 space-y-5">
          {/* 作者卡片 */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-md shrink-0">
                <img src="/avatar.jpg" alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Hyakuya</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">开发者 / 创作者</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              个人网站，分享自己喜欢和感兴趣的东西。有任何问题或者想法随时联系我~
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 space-y-1">
              <p className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                hyakuya_site@qq.com
              </p>
              <p className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                hyakuyasite@gmail.com
              </p>
            </div>
            <div className="flex gap-3 mt-3">
              <a href="https://github.com/Hyakuya1029" target="_blank" rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.689 1.028 2.688 0 3.847-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
                GitHub
              </a>
              <a href="/messages"
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                留言
              </a>
            </div>
          </div>

          {/* 站点统计 */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">站点统计</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '文章', value: stats.posts },
                { label: '评论', value: stats.comments },
                { label: '留言', value: stats.messages },
                { label: '友链', value: stats.friends },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-lg font-bold text-sky-600 dark:text-sky-400">{value}</div>
                  <div className="text-[10px] text-gray-400 dark:text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右栏 — 最近文章 */}
        <div className="flex-1 space-y-10">
          {/* 最近文章 */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
              最近文章
            </h2>
            {posts.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-500 text-sm">还没有文章</p>
            ) : (
              <div className="space-y-4">
                {posts.slice(0, 5).map(post => (
                  <Link key={post.id} href={`/blog/${post.id}`}
                    className="block group bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{post.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                      <span>{post.publishedAt}</span>
                      <div className="flex gap-1">
                        {post.tags.map(tag => (
                          <span key={tag} className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-[10px]">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
