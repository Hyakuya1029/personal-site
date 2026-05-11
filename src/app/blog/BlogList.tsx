'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Post } from '@/lib/posts';
import FilterPill from '@/components/ui/FilterPill';

interface BlogListProps {
  posts: Post[];
  allTags: string[];
}

export default function BlogList({ posts, allTags }: BlogListProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts;

  return (
    <section>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <FilterPill
          label="全部"
          isActive={activeTag === null}
          onClick={() => setActiveTag(null)}
        />
        {allTags.map((tag) => (
          <FilterPill
            key={tag}
            label={tag}
            isActive={activeTag === tag}
            onClick={() => setActiveTag(tag)}
          />
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-6 dark:text-gray-100 text-center">
        {activeTag ? `标签: ${activeTag}` : '最新文章'}
      </h2>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center">暂无文章</p>
        ) : (
          filtered.map((post, i) => (
            <article
              key={post.id}
              className="stagger-item border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6 card-lift cursor-pointer"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <Link href={`/blog/${post.id}`}>
                <h3 className="text-xl font-medium mb-2 hover:text-sky-600 dark:text-gray-100">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <time className="text-sm text-gray-400 dark:text-gray-500">{post.publishedAt}</time>
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
