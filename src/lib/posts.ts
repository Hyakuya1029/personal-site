import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  published: boolean;
}

const fmtDate = (v: unknown) => v instanceof Date ? v.toISOString().split('T')[0] : String(v ?? '');

const postsDirectory = join(process.cwd(), 'posts');

export function getAllPosts(): Post[] {
  if (!existsSync(postsDirectory)) return [];
  const fileNames = readdirSync(postsDirectory).filter((f) => f.endsWith('.md'));
  
  const allPosts = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = join(postsDirectory, fileName);
    const fileContents = readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      id,
      title: data.title,
      excerpt: data.excerpt,
      content,
      publishedAt: fmtDate(data.publishedAt),
      updatedAt: fmtDate(data.updatedAt),
      tags: data.tags,
      published: data.published,
    } as Post;
  });

  return allPosts
    .filter(post => post.published)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getPostById(id: string): Post | undefined {
  if (!existsSync(postsDirectory)) return undefined;
  const fileNames = readdirSync(postsDirectory).filter((f) => f.endsWith('.md'));
  const fileName = `${id}.md`;
  
  if (!fileNames.includes(fileName)) {
    return undefined;
  }

  const fullPath = join(postsDirectory, fileName);
  const fileContents = readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // 草稿（published 不为 true）不能通过 URL 直接访问
  if (!data.published) return undefined;

  return {
    id,
    title: data.title,
    excerpt: data.excerpt,
    content,
    publishedAt: fmtDate(data.publishedAt),
    updatedAt: fmtDate(data.updatedAt),
    tags: data.tags,
    published: data.published,
  } as Post;
}

export function getAllPostIds(): string[] {
  // 复用 getAllPosts 的 published 过滤，避免草稿被 generateStaticParams 静态生成
  return getAllPosts().map((post) => post.id);
}