import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { getPostById, getAllPostIds } from '@/lib/posts';
import CommentSection from '@/components/CommentSection';

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

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;
  const post = getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <nav className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline">
          ← 返回首页
        </Link>
      </nav>

      <article className="prose prose-lg max-w-none">
        <header className="mb-8 not-prose">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <time>{post.publishedAt}</time>
            <div className="flex gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <hr className="my-8" />
        </header>

        <ReactMarkdown>{post.content}</ReactMarkdown>
      </article>

      <CommentSection postId={id} />
    </main>
  );
}