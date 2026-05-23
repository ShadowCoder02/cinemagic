'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, MapPin, X, ChevronLeft, ChevronRight, Copy, Check, Images } from 'lucide-react';
import Image from 'next/image';

interface Photo {
  id: string;
  url: string;
  title: string | null;
  isFeatured: boolean;
  order: number;
}

interface Album {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  location: string | null;
  category: string;
  isFeatured: boolean;
  likes: number;
  photos: Photo[];
  createdAt: string;
}

const LIKED_KEY = 'cm_liked_albums';
function getLiked(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(LIKED_KEY) ?? '[]')); } catch { return new Set(); }
}
function saveLiked(s: Set<string>) {
  localStorage.setItem(LIKED_KEY, JSON.stringify([...s]));
}

/* ─── Full-screen Album Viewer ─── */
function AlbumViewer({
  album,
  initialIndex,
  liked,
  likes,
  onClose,
  onLike,
}: {
  album: Album;
  initialIndex: number;
  liked: boolean;
  likes: number;
  onClose: () => void;
  onLike: (e: React.MouseEvent) => void;
}) {
  const [idx, setIdx] = useState(initialIndex);
  const [dir, setDir] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stripRef = useRef<HTMLDivElement>(null);

  const photos = album.photos;
  const total = photos.length;
  const current = photos[idx] ?? null;

  useEffect(() => { setMounted(true); }, []);

  // Scroll filmstrip to keep active thumb centred
  useEffect(() => {
    const btn = thumbRefs.current[idx];
    const strip = stripRef.current;
    if (!btn || !strip) return;
    const btnLeft = btn.offsetLeft;
    const btnWidth = btn.offsetWidth;
    const stripWidth = strip.clientWidth;
    strip.scrollTo({ left: btnLeft - stripWidth / 2 + btnWidth / 2, behavior: 'smooth' });
  }, [idx]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (total <= 1) return;
      if (e.key === 'ArrowLeft') { setDir(-1); setIdx((i) => (i - 1 + total) % total); }
      if (e.key === 'ArrowRight') { setDir(1); setIdx((i) => (i + 1) % total); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [total, onClose]);

  // Close share popover on outside click
  useEffect(() => {
    if (!shareOpen) return;
    const close = () => setShareOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [shareOpen]);

  const goTo = (i: number) => {
    if (i === idx) return;
    setDir(i > idx ? 1 : -1);
    setIdx(i);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/albums/${album.slug}`;
    if (typeof navigator.share === 'function') {
      try { await navigator.share({ title: album.title, url }); return; } catch { /* cancelled */ }
    }
    setShareOpen((s) => !s);
  };

  const copyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(`${window.location.origin}/albums/${album.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/albums/${album.slug}` : '';
  const platforms = [
    { label: 'WhatsApp', bg: '#25D366', ch: 'W', href: `https://wa.me/?text=${encodeURIComponent(album.title + ' ' + shareUrl)}` },
    { label: 'Facebook', bg: '#1877F2', ch: 'F', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { label: 'Twitter / X', bg: '#000', ch: 'X', href: `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(album.title)}` },
  ];

  const imgVariants = {
    enter: (d: number) => ({ opacity: 0, x: d * 60 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: -d * 60 }),
  };

  if (!mounted) return null;
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] flex flex-col bg-black"
    >
      {/* ── Header bar ── */}
      <div className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-white/10 bg-black/90 backdrop-blur-sm shrink-0">
        <div className="min-w-0 flex-1">
          <h2 className="text-white font-semibold text-base sm:text-lg leading-tight truncate">{album.title}</h2>
          {album.location && (
            <p className="text-white/40 text-xs flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3 shrink-0" />{album.location}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {total > 0 && (
            <span className="text-white/30 text-sm tabular-nums mr-1">
              {idx + 1}<span className="text-white/20"> / </span>{total}
            </span>
          )}

          {/* Like */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={onLike}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-sm transition-colors ${
              liked ? 'text-red-400 bg-red-500/15' : 'text-white/50 hover:text-red-400 hover:bg-red-500/10'
            }`}
          >
            <motion.span
              key={String(liked)}
              initial={liked ? { scale: 1.4 } : { scale: 1 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="flex"
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-red-400' : ''}`} />
            </motion.span>
            {likes > 0 && <span className="tabular-nums">{likes}</span>}
          </motion.button>

          {/* Share */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleShare}
              className="rounded-xl p-1.5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </motion.button>
            <AnimatePresence>
              {shareOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.88, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.88, y: 6 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className="absolute top-full right-0 mt-2 z-30 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-1.5 min-w-[170px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {platforms.map((p) => (
                    <a key={p.label} href={p.href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 text-sm text-white/80 transition-colors"
                    >
                      <span className="h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: p.bg }}>
                        {p.ch}
                      </span>
                      {p.label}
                    </a>
                  ))}
                  <button onClick={copyLink} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 text-sm text-white/80 transition-colors">
                    {copied ? <Check className="h-4 w-4 text-green-400 shrink-0" /> : <Copy className="h-4 w-4 text-white/40 shrink-0" />}
                    {copied ? 'Copied!' : 'Copy link'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Close */}
          <button onClick={onClose} className="rounded-xl p-1.5 text-white/50 hover:text-white hover:bg-white/10 transition-colors ml-1">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ── Main image stage ── */}
      <div className="relative overflow-hidden bg-[#0a0a0a]" style={{ flex: '1 1 0', minHeight: 0, maxHeight: '62vh' }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={idx}
            custom={dir}
            variants={imgVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ padding: '28px 76px' }}
          >
            {current ? (
              <div className="relative w-full h-full">
                <Image
                  src={current.url}
                  alt={current.title ?? album.title}
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, 90vw"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-white/20">
                <Images className="h-12 w-12" />
                <p className="text-sm">No photos in this album</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Photo title caption */}
        <AnimatePresence>
          {current?.title && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 left-0 right-0 px-6 pb-4 pt-10 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"
            >
              <p className="text-white/70 text-sm text-center">{current.title}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prev / Next arrows */}
        {total > 1 && (
          <>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { setDir(-1); setIdx((i) => (i - 1 + total) % total); }}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/60 hover:bg-black/80 p-3 text-white backdrop-blur-sm border border-white/10 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { setDir(1); setIdx((i) => (i + 1) % total); }}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/60 hover:bg-black/80 p-3 text-white backdrop-blur-sm border border-white/10 transition-colors"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </motion.button>
          </>
        )}
      </div>

      {/* ── Filmstrip ── */}
      {total > 1 && (
        <div className="shrink-0 border-t border-white/10 bg-[#0d0d0d] py-3">
          <div
            ref={stripRef}
            className="flex gap-2 px-4 overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {photos.map((photo, i) => (
              <motion.button
                key={photo.id}
                ref={(el) => { thumbRefs.current[i] = el; }}
                onClick={() => goTo(i)}
                whileHover={{ scale: i !== idx ? 1.06 : 1 }}
                whileTap={{ scale: 0.94 }}
                className={`relative shrink-0 rounded-lg overflow-hidden transition-all duration-200 ${
                  i === idx
                    ? 'ring-2 ring-primary-500 opacity-100 brightness-110'
                    : 'opacity-40 hover:opacity-70'
                }`}
                style={{ width: 72, height: 52 }}
              >
                <Image
                  src={photo.url}
                  alt={photo.title ?? `Photo ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="72px"
                />
                {i === idx && (
                  <motion.div
                    layoutId="active-thumb"
                    className="absolute inset-0 rounded-lg ring-2 ring-primary-500"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>,
    document.body
  );
}

/* ─── Share popover for cards ─── */
function SharePopover({
  album,
  isOpen,
  copied,
  onCopy,
}: {
  album: Album;
  isOpen: boolean;
  copied: boolean;
  onCopy: (e: React.MouseEvent) => void;
}) {
  const getUrl = () =>
    typeof window !== 'undefined' ? `${window.location.origin}/albums/${album.slug}` : '';

  const platforms = [
    { label: 'WhatsApp', bg: '#25D366', ch: 'W', href: () => `https://wa.me/?text=${encodeURIComponent(album.title + ' ' + getUrl())}` },
    { label: 'Facebook', bg: '#1877F2', ch: 'F', href: () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}` },
    { label: 'Twitter / X', bg: '#000000', ch: 'X', href: () => `https://x.com/intent/tweet?url=${encodeURIComponent(getUrl())}&text=${encodeURIComponent(album.title)}` },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 6 }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          className="absolute bottom-full right-0 mb-2 z-30 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl p-1.5 min-w-[170px]"
          onClick={(e) => e.stopPropagation()}
        >
          {platforms.map((p) => (
            <a key={p.label} href={p.href()} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm text-gray-700 dark:text-white/80 transition-colors"
            >
              <span className="h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: p.bg }}>
                {p.ch}
              </span>
              {p.label}
            </a>
          ))}
          <button onClick={onCopy} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm text-gray-700 dark:text-white/80 transition-colors">
            {copied ? <Check className="h-4 w-4 text-green-500 shrink-0" /> : <Copy className="h-4 w-4 text-gray-400 shrink-0" />}
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Album card ─── */
function AlbumCard({
  album, likes, liked, shareOpen, copiedId, aspectClass, delay,
  onOpen, onLike, onShare, onCopy,
}: {
  album: Album; likes: number; liked: boolean; shareOpen: boolean;
  copiedId: string | null; aspectClass: string; delay: number;
  onOpen: () => void; onLike: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void; onCopy: (e: React.MouseEvent) => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
      className="group relative rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl dark:hover:shadow-black/60 transition-shadow duration-300"
    >
      <div className={`relative ${aspectClass} overflow-hidden cursor-pointer`} onClick={onOpen}>
        {album.coverImage ? (
          <Image src={album.coverImage} alt={album.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <Images className="h-8 w-8 text-gray-400 dark:text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {album.isFeatured && (
          <span className="absolute top-3 left-3 bg-primary-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
            Featured
          </span>
        )}
        <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
          {album.photos.length} photos
        </span>
      </div>

      <div className="p-4">
        <h3 onClick={onOpen} className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1 cursor-pointer">
          {album.title}
        </h3>
        {album.location && (
          <p className="text-xs text-gray-500 dark:text-white/50 flex items-center gap-1 mb-3">
            <MapPin className="h-3 w-3 shrink-0" /> {album.location}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs capitalize text-gray-400 dark:text-white/30 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
            {album.category}
          </span>
          <div className="flex items-center gap-0.5">
            <div className="relative">
              <motion.button whileTap={{ scale: 0.82 }} onClick={onShare}
                className="rounded-xl p-2 text-gray-400 dark:text-white/40 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
                aria-label="Share album"
              >
                <Share2 className="h-4 w-4" />
              </motion.button>
              <SharePopover album={album} isOpen={shareOpen} copied={copiedId === album.id} onCopy={onCopy} />
            </div>
            <motion.button whileTap={{ scale: 0.75 }} onClick={onLike}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 transition-colors ${
                liked ? 'text-red-500 bg-red-50 dark:bg-red-500/10' : 'text-gray-400 dark:text-white/40 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10'
              }`}
              aria-label={liked ? 'Unlike album' : 'Like album'}
            >
              <motion.span
                key={String(liked)}
                initial={liked ? { scale: 1.5 } : { scale: 1 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="flex"
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-red-500' : ''}`} />
              </motion.span>
              {likes > 0 && (
                <motion.span key={likes} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-medium tabular-nums">
                  {likes}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Page ─── */
export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [viewer, setViewer] = useState<{ album: Album; index: number } | null>(null);
  const [shareOpenId, setShareOpenId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/albums')
      .then((r) => r.json())
      .then((data: Album[]) => {
        setAlbums(data);
        const counts: Record<string, number> = {};
        data.forEach((a) => { counts[a.id] = a.likes; });
        setLikeCounts(counts);
        setLiked(getLiked());
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!shareOpenId) return;
    const close = () => setShareOpenId(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [shareOpenId]);

  const toggleLike = (albumId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isLiked = liked.has(albumId);
    const newLiked = new Set(liked);
    if (isLiked) {
      newLiked.delete(albumId);
      setLikeCounts((p) => ({ ...p, [albumId]: Math.max(0, (p[albumId] ?? 0) - 1) }));
      fetch(`/api/albums/${albumId}/like`, { method: 'DELETE' }).catch(() => {});
    } else {
      newLiked.add(albumId);
      setLikeCounts((p) => ({ ...p, [albumId]: (p[albumId] ?? 0) + 1 }));
      fetch(`/api/albums/${albumId}/like`, { method: 'POST' }).catch(() => {});
    }
    setLiked(newLiked);
    saveLiked(newLiked);
  };

  const handleShare = async (album: Album, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/albums/${album.slug}`;
    if (typeof navigator.share === 'function') {
      try { await navigator.share({ title: album.title, url }); return; } catch { /* cancelled */ }
    }
    setShareOpenId((p) => (p === album.id ? null : album.id));
  };

  const copyLink = async (album: Album, e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(`${window.location.origin}/albums/${album.slug}`);
    setCopiedId(album.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const featured = albums.filter((a) => a.isFeatured);
  const rest = albums.filter((a) => !a.isFeatured);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-300">
      {/* Hero */}
      <section className="pt-20 pb-4 bg-gradient-to-b from-slate-100 to-white dark:from-black dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white mb-3"
          >
            Photo <span className="text-gradient">Albums</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-white/60 max-w-xl mx-auto"
          >
            Browse our complete collection — each album tells a story of love and celebration.
          </motion.p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800 h-72" />
            ))}
          </div>
        )}

        {!loading && albums.length === 0 && (
          <p className="text-center text-gray-500 dark:text-white/40 py-24">No albums yet. Check back soon.</p>
        )}

        {featured.length > 0 && (
          <div>
            <h2 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-6">Featured Albums</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featured.map((album, i) => (
                <AlbumCard key={album.id} album={album}
                  likes={likeCounts[album.id] ?? album.likes} liked={liked.has(album.id)}
                  shareOpen={shareOpenId === album.id} copiedId={copiedId}
                  aspectClass="aspect-[4/3]" delay={i * 0.1}
                  onOpen={() => setViewer({ album, index: 0 })}
                  onLike={(e) => toggleLike(album.id, e)}
                  onShare={(e) => handleShare(album, e)}
                  onCopy={(e) => copyLink(album, e)}
                />
              ))}
            </div>
          </div>
        )}

        {rest.length > 0 && (
          <div>
            {featured.length > 0 && (
              <h2 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-6">All Albums</h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((album, i) => (
                <AlbumCard key={album.id} album={album}
                  likes={likeCounts[album.id] ?? album.likes} liked={liked.has(album.id)}
                  shareOpen={shareOpenId === album.id} copiedId={copiedId}
                  aspectClass="aspect-[4/5]" delay={i * 0.08}
                  onOpen={() => setViewer({ album, index: 0 })}
                  onLike={(e) => toggleLike(album.id, e)}
                  onShare={(e) => handleShare(album, e)}
                  onCopy={(e) => copyLink(album, e)}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Full-screen album viewer */}
      <AnimatePresence>
        {viewer && (
          <AlbumViewer
            album={viewer.album}
            initialIndex={viewer.index}
            liked={liked.has(viewer.album.id)}
            likes={likeCounts[viewer.album.id] ?? viewer.album.likes}
            onClose={() => setViewer(null)}
            onLike={(e) => toggleLike(viewer.album.id, e)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
