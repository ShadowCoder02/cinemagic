'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import Image from 'next/image';

interface Photo { id: string; url: string; title: string | null; isFeatured: boolean; order: number; }
interface Album { id: string; title: string; slug: string; description: string | null; coverImage: string | null; location: string | null; category: string; photos: Photo[]; }

export default function PortfolioPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [lightbox, setLightbox] = useState<{ photos: Photo[]; index: number } | null>(null);

  useEffect(() => {
    fetch('/api/albums').then((r) => r.json()).then(setAlbums).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = ['all', ...Array.from(new Set(albums.map((a) => a.category)))];
  const filtered = category === 'all' ? albums : albums.filter((a) => a.category === category);

  // Flatten all photos for lightbox navigation


  const openLightbox = (photos: Photo[], index: number) => setLightbox({ photos, index });
  const closeLightbox = () => setLightbox(null);
  const prev = () => setLightbox((l) => l ? { ...l, index: (l.index - 1 + l.photos.length) % l.photos.length } : null);
  const next = () => setLightbox((l) => l ? { ...l, index: (l.index + 1) % l.photos.length } : null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-300">
      <section className="pt-24 pb-12 bg-gradient-to-b from-slate-100 to-white dark:from-black dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Our <span className="text-primary-500">Portfolio</span>
          </motion.h1>
          <p className="text-lg text-gray-600 dark:text-white/60 max-w-xl mx-auto mb-8">
            Each image tells a unique story of love, joy, and celebration.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={"rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors " +
                  (category === c ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-white/70 border border-gray-200 dark:border-white/10 hover:border-primary-500 hover:text-primary-500')}>
                {c === 'all' ? 'All Work' : c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-16">
        {loading && (
          <div className="columns-2 sm:columns-3 gap-4 mt-8 space-y-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className={"animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800 " + (i % 3 === 0 ? 'h-64' : 'h-48')} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-500 dark:text-white/40 py-24">No albums yet. Check back soon.</p>
        )}

        {filtered.map((album) => (
          <div key={album.id}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-display font-semibold text-gray-900 dark:text-white capitalize">{album.title}</h2>
                {album.location && (
                  <p className="text-sm text-gray-500 dark:text-white/50 flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5" />{album.location}
                  </p>
                )}
              </div>
              <span className="rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 px-3 py-1 text-sm text-gray-600 dark:text-white/60">
                {album.photos.length} photos
              </span>
            </div>
            {album.photos.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-white/30">No photos in this album yet.</p>
            ) : (
              <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
                {album.photos.map((photo, idx) => (
                  <motion.div key={photo.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.04 }}
                    className="group relative overflow-hidden rounded-xl cursor-zoom-in break-inside-avoid"
                    onClick={() => openLightbox(album.photos, idx)}>
                    <div className="relative bg-gray-200 dark:bg-gray-800">
                      <Image src={photo.url} alt={photo.title ?? album.title} width={600} height={400}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                    {photo.title && (
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                        <p className="text-xs text-white">{photo.title}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            onClick={closeLightbox}>
            <button onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 p-3 text-white transition-colors">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <motion.div key={lightbox.index} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
              <Image src={lightbox.photos[lightbox.index].url} alt={lightbox.photos[lightbox.index].title ?? 'Photo'}
                width={1200} height={800} className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg" />
            </motion.div>
            <button onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 p-3 text-white transition-colors">
              <ChevronRight className="h-6 w-6" />
            </button>
            <button onClick={closeLightbox} className="absolute top-4 right-4 rounded-full bg-white/10 hover:bg-white/20 p-2 text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {lightbox.index + 1} / {lightbox.photos.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
