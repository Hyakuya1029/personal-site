import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { createClient } from '@supabase/supabase-js';
import { getPostById, getAllPostIds } from '@/lib/posts';
import CommentSection from './CommentSection';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const ids = getAllPostIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const post = getPostById(id);

  if (!post) {
    return { title: '文章未找到' };
  }

  return {
    title: `${post.title} - 我的博客`,
    description: post.excerpt,
  };
}

async function getLinkedResources(postId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data } = await supabase
    .from('resources')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: false });
  return data || [];
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;
  const post = getPostById(id);

  if (!post) {
    notFound();
  }

  const linkedResources = await getLinkedResources(id);

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      <div className="max-w-3xl mx-auto">
        <nav className="mb-8 flex items-center gap-4 text-sm">
        <a href="/" className="text-sky-600 hover:underline flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          返回首页
        </a>
        <a href="/blog" className="text-sky-600 hover:underline flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          返回博客
        </a>
      </nav>

      <article>
        <header className="mb-8 not-prose">
          <h1 className="text-4xl font-bold mb-4 dark:text-gray-100">{post.title}</h1>
          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
            <time>{post.publishedAt}</time>
            <div className="flex gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="text-sm bg-gray-100 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <hr className="my-8 dark:border-gray-700" />
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none
          prose-code:before:content-none prose-code:after:content-none
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{post.content}</ReactMarkdown>
        </div>
      </article>

      {/* 关联资源 */}
      {linkedResources.length > 0 && (
        <section className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            相关资源
          </h3>
          <div className="space-y-2">
            {linkedResources.map((r: any) => (
              <a
                key={r.id}
                href={`/api/resources/download?id=${r.id}`}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[4rem]">
                  {new Date(r.created_at).toLocaleDateString('zh-CN')}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors flex-1">
                  {r.title}
                </span>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-sky-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </a>
            ))}
          </div>
        </section>
      )}

      <CommentSection postId={id} />
      </div>
    </main>
  );
}
