'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Eye, Calendar, Tag, User } from 'lucide-react';
import { useTheme } from 'next-themes';

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), { ssr: false });

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  category: string | null;
  author: string | null;
  readTime: number | null;
  publishedAt: string | null;
  views: number;
  tags: string[] | null;
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const slug = params?.slug as string;
    if (!slug) return;
    fetch(`/api/blog/posts/${slug}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => { if (data) setPost(data); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params?.slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="loading-spinner" />
      </main>
    );
  }

  if (notFound || !post) {
    return (
      <main className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 dark:text-white/50">Post not found.</p>
        <Link href="/blog" className="text-primary-500 hover:underline text-sm">← Back to Blog</Link>
      </main>
    );
  }

  const colorMode = resolvedTheme === 'dark' ? 'dark' : 'light';
  const publishDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;
  const tags = Array.isArray(post.tags) ? post.tags : [];

  return (
    <main className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">
        {/* Back button */}
        <button
          onClick={() => router.push('/blog')}
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-white/50 hover:text-primary-500 dark:hover:text-primary-400 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </button>

        {/* Category */}
        {post.category && (
          <span className="inline-block bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            {post.category}
          </span>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white leading-tight mb-6"
        >
          {post.title}
        </motion.h1>

        {/* Featured image — fully visible, no cropping */}
        {post.featuredImage && (
          <div className="relative w-full mb-8 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800" style={{ height: '360px' }}>
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-contain"
              priority
            />
          </div>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-white/50 mb-8 pb-8 border-b border-gray-100 dark:border-white/10">
          {post.author && (
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {post.author}
            </span>
          )}
          {publishDate && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {publishDate}
            </span>
          )}
          {post.readTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readTime} min read
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            {post.views.toLocaleString()} views
          </span>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-lg text-gray-600 dark:text-white/70 leading-relaxed mb-8 italic border-l-4 border-primary-500 pl-4">
            {post.excerpt}
          </p>
        )}

        {/* Markdown content */}
        <div data-color-mode={colorMode} className="prose-container">
          <MarkdownPreview
            source={post.content}
            style={{ background: 'transparent', fontSize: '1rem', lineHeight: '1.75' }}
            wrapperElement={{ 'data-color-mode': colorMode } as React.HTMLAttributes<HTMLDivElement>}
          />
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-white/10 flex flex-wrap items-center gap-2">
            <Tag className="h-4 w-4 text-gray-400 dark:text-white/40 shrink-0" />
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs text-gray-600 dark:text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Back link */}
        <div className="mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All Posts
          </Link>
        </div>
      </div>
    </main>
  );
}
