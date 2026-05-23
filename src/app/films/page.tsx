'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Clock, MapPin, Eye } from 'lucide-react';
import Image from 'next/image';

interface Film {
  id: string; title: string; description: string | null; videoUrl: string;
  platform: string; posterUrl: string | null; duration: string | null;
  location: string | null; category: string; isFeatured: boolean; views: number; tags: string[];
}

function getEmbedUrl(videoUrl: string, platform: string): string {
  if (platform === 'YOUTUBE') {
    const match = videoUrl.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : videoUrl;
  }
  if (platform === 'VIMEO') {
    const match = videoUrl.match(/vimeo\.com\/(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}?autoplay=1` : videoUrl;
  }
  return videoUrl;
}

export default function FilmsPage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Film | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/films').then((r) => r.json()).then(setFilms).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = ['all', ...Array.from(new Set(films.map((f) => f.category)))];
  const filtered = filter === 'all' ? films : films.filter((f) => f.category === filter);
  const featured = filtered.filter((f) => f.isFeatured);
  const regular = filtered.filter((f) => !f.isFeatured);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-300">
      <section className="pt-24 pb-12 bg-gradient-to-b from-slate-100 to-white dark:from-black dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Wedding <span className="text-primary-500">Films</span>
          </motion.h1>
          <p className="text-lg text-gray-600 dark:text-white/60 max-w-xl mx-auto">
            Cinematic love stories captured frame by frame.
          </p>
          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {categories.map((c) => (
              <button key={c} onClick={() => setFilter(c)}
                className={"rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors " +
                  (filter === c ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-white/70 border border-gray-200 dark:border-white/10 hover:border-primary-500 hover:text-primary-500')}>
                {c === 'all' ? 'All Films' : c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-video animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />)}
          </div>
        )}

        {!loading && films.length === 0 && (
          <p className="text-center text-gray-500 dark:text-white/40 py-24">No films yet. Check back soon.</p>
        )}

        {featured.length > 0 && (
          <>
            <h2 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mt-12 mb-6">Featured Films</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {featured.map((film) => <FilmCard key={film.id} film={film} onPlay={() => setSelected(film)} />)}
            </div>
          </>
        )}

        {regular.length > 0 && (
          <>
            <h2 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mt-12 mb-6">
              {featured.length > 0 ? 'More Films' : 'All Films'}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {regular.map((film) => <FilmCard key={film.id} film={film} onPlay={() => setSelected(film)} />)}
            </div>
          </>
        )}
      </section>

      {/* Video modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black"
              onClick={(e) => e.stopPropagation()}>
              <iframe src={getEmbedUrl(selected.videoUrl, selected.platform)} title={selected.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen className="absolute inset-0 h-full w-full" />
              <button onClick={() => setSelected(null)}
                className="absolute top-4 right-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function FilmCard({ film, onPlay }: { film: Film; onPlay: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 cursor-pointer"
      onClick={onPlay}>
      <div className="relative aspect-video bg-gray-800">
        {film.posterUrl
          ? <Image src={film.posterUrl} alt={film.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
          : <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-gray-900" />}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 group-hover:bg-primary-500/80 transition-all duration-300">
            <Play className="h-7 w-7 text-white fill-white ml-1" />
          </span>
        </div>
        {film.duration && (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-xs text-white font-medium backdrop-blur-sm">
            {film.duration}
          </span>
        )}
        <span className="absolute top-3 left-3 rounded-full bg-black/70 px-2.5 py-1 text-xs text-white/80 capitalize backdrop-blur-sm">
          {film.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">{film.title}</h3>
        {film.description && <p className="text-sm text-white/60 mt-1 line-clamp-2">{film.description}</p>}
        <div className="flex items-center gap-4 mt-3 text-xs text-white/40">
          {film.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{film.location}</span>}
          {film.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{film.duration}</span>}
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{film.views.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
}
