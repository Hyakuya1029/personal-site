import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">博客</h1>
        <p className="text-gray-600">记录生活，分享思考</p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-6">最新文章</h2>
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-gray-500">暂无文章</p>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="border bg-white rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <Link href={`/posts/${post.id}`}>
                  <h3 className="text-xl font-medium mb-2 hover:text-blue-600">{post.title}</h3>
                  <p className="text-gray-600 mb-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <time className="text-sm text-gray-400">{post.publishedAt}</time>
                    <div className="flex gap-2">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
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
    </main>
  );
}