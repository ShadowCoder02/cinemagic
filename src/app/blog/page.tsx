'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, Eye, Search } from 'lucide-react';
import Image from 'next/image';


interface BlogPost {
  id: string; title: string; slug: string; excerpt: string | null;
  featuredImage: string | null; category: string | null; author: string | null;
  readTime: number | null; publishedAt: string | null; views: number; tags: string[];
}

export default function BlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetch('/api/blog/posts').then((r) => r.json()).then(setPosts).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = ['all', ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean) as string[]))];
  const filtered = posts.filter((p) => {
    const matchCat = category === 'all' || p.category === category;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.excerpt ?? '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-300">
      <section className="pt-24 pb-12 bg-gradient-to-b from-slate-100 to-white dark:from-black dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Our <span className="text-primary-500">Blog</span>
          </motion.h1>
          <p className="text-lg text-gray-600 dark:text-white/60 max-w-xl mx-auto mb-8">
            Stories, tips, and insights from the world of wedding photography.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search posts..."
                className="w-full rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800 pl-9 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:border-primary-500 focus:outline-none" />
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={"rounded-full px-4 py-1.5 text-sm font-medium transition-colors " +
                  (category === c ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-white/70 border border-gray-200 dark:border-white/10 hover:border-primary-500 hover:text-primary-500')}>
                {c === 'all' ? 'All Posts' : c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-72 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-500 dark:text-white/40 py-24">
            {posts.length === 0 ? 'No posts published yet. Check back soon.' : 'No posts match your search.'}
          </p>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filtered.map((post, i) => (
              <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => router.push(`/blog/${post.slug}`)}
                className="group overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 hover:border-primary-500/40 transition-colors cursor-pointer">
                <div className="relative aspect-[16/9] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  {post.featuredImage
                    ? <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 to-gray-900" />}
                  {post.category && (
                    <span className="absolute top-3 left-3 rounded-full bg-primary-500 px-3 py-1 text-xs font-medium text-white">
                      {post.category}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && <p className="mt-2 text-sm text-gray-600 dark:text-white/60 line-clamp-2">{post.excerpt}</p>}
                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-400 dark:text-white/40">
                    {post.readTime && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime} min</span>}
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.views.toLocaleString()}</span>
                    {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
