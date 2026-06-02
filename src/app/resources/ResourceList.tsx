'use client';

import { useEffect, useState } from 'react';
import FilterPill from '@/components/ui/FilterPill';

interface Resource {
  id: number;
  title: string;
  description: string;
  tags: string;
  file_url: string;
  file_type: string;
  post_id: string | null;
  created_at: string;
}

function parseTags(tagsStr: string): string[] {
  // 兼容中文逗号
  return tagsStr ? tagsStr.replace(/，/g, ',').split(',').map(t => t.trim()).filter(Boolean) : [];
}

function formatTitle(title: string, fileType: string) {
  // other 表示通用类型，不追加后缀；其余类型自动追加扩展名
  if (!fileType || fileType === 'other') return title;
  return `${title}.${fileType}`;
}

const FILE_ICONS: Record<string, { path: JSX.Element; color: string }> = {
  pdf: {
    color: 'text-red-500',
    path: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  zip: {
    color: 'text-amber-500',
    path: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
      </svg>
    ),
  },
  image: {
    color: 'text-green-500',
    path: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0019.5 3H4.5A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21z" />
      </svg>
    ),
  },
  code: {
    color: 'text-indigo-500',
    path: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
};

function getFileIcon(fileType: string) {
  const icon = FILE_ICONS[fileType];
  if (!icon) return { path: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ), color: 'text-gray-400' };
  return icon;
}

export default function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/resources')
      .then(r => r.json())
      .then(json => { if (json.success) setResources(json.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const allTags = Array.from(
    new Set(resources.flatMap(r => parseTags(r.tags)))
  );

  const filtered = activeTag
    ? resources.filter(r => parseTags(r.tags).includes(activeTag))
    : resources;

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (resources.length === 0) {
    return <p className="text-gray-400 dark:text-gray-500 text-center text-sm py-12">暂无资源</p>;
  }

  return (
    <>
      {/* 标签筛选 */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <FilterPill label="全部" isActive={activeTag === null} onClick={() => setActiveTag(null)} />
          {allTags.map(tag => (
            <FilterPill key={tag} label={tag} isActive={activeTag === tag} onClick={() => setActiveTag(tag)} />
          ))}
        </div>
      )}

      {/* 卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((r, i) => {
          const { path, color } = getFileIcon(r.file_type);
          const tags = parseTags(r.tags);

          return (
            <div
              key={r.id}
              className="stagger-item group bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 card-lift p-6 flex flex-col"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* 图标 + 标题 */}
              <div className="flex items-start gap-4 mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0 ${color}`}>
                  {path}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {formatTitle(r.title, r.file_type)}
                  </h3>
                  {r.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{r.description}</p>
                  )}
                </div>
              </div>

              {/* 标签 */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 底部 */}
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(r.created_at).toLocaleDateString('zh-CN')}
                </span>
                <a
                  href={`/api/resources/download?id=${r.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 text-white text-sm rounded-lg hover:bg-sky-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  下载
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-gray-400 dark:text-gray-500 text-center text-sm mt-8">没有匹配的资源</p>
      )}
    </>
  );
}
