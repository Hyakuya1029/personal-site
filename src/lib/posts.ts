import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { Post } from './types';

const postsDirectory = join(process.cwd(), 'posts');

export function getAllPosts(): Post[] {
  const fileNames = readdirSync(postsDirectory);
  
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
      publishedAt: data.publishedAt,
      updatedAt: data.updatedAt,
      tags: data.tags,
      published: data.published,
    } as Post;
  });

  return allPosts
    .filter(post => post.published)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getPostById(id: string): Post | undefined {
  const fileNames = readdirSync(postsDirectory);
  const fileName = `${id}.md`;
  
  if (!fileNames.includes(fileName)) {
    return undefined;
  }

  const fullPath = join(postsDirectory, fileName);
  const fileContents = readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    id,
    title: data.title,
    excerpt: data.excerpt,
    content,
    publishedAt: data.publishedAt,
    updatedAt: data.updatedAt,
    tags: data.tags,
    published: data.published,
  } as Post;
}

export function getAllPostIds(): string[] {
  const fileNames = readdirSync(postsDirectory);
  return fileNames.map((fileName) => fileName.replace(/\.md$/, ''));
}