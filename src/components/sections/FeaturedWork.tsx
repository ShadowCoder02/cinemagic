'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Heart, Share2, Calendar, MapPin, X, Copy, Check } from 'lucide-react';
import Image from 'next/image';
import Button from '@/components/ui/Button';

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.213 5.567 4.951-5.567zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FbIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

interface PortfolioItem {
  id: number;
  title: string;
  location: string;
  date: string;
  category: string;
  image: string;
  likes: number;
  views: number;
  featured: boolean;
}

const portfolioItems: PortfolioItem[] = [
  { id: 1, title: "Sarah & Michael's Wedding", location: "Jaffna, Sri Lanka", date: "December 2024", category: "Weddings", image: "/images/portfolio/wedding-1.jpg", likes: 124, views: 2340, featured: true },
  { id: 2, title: "Graduation Celebration", location: "University of Jaffna", date: "November 2024", category: "Graduations", image: "/images/portfolio/graduation-1.jpg", likes: 89, views: 1560, featured: true },
  { id: 3, title: "Romantic Engagement", location: "Nallur Temple", date: "October 2024", category: "Engagements", image: "/images/portfolio/engagement-1.jpg", likes: 156, views: 2890, featured: true },
  { id: 4, title: "Traditional Wedding", location: "Colombo, Sri Lanka", date: "September 2024", category: "Weddings", image: "/images/portfolio/wedding-2.jpg", likes: 203, views: 3450, featured: false },
  { id: 5, title: "Medical School Graduation", location: "Jaffna Medical College", date: "August 2024", category: "Graduations", image: "/images/portfolio/graduation-2.jpg", likes: 178, views: 2670, featured: false },
  { id: 6, title: "Beach Engagement", location: "Trincomalee Beach", date: "July 2024", category: "Engagements", image: "/images/portfolio/engagement-2.jpg", likes: 134, views: 1980, featured: false },
];

function ShareModal({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? `${window.location.origin}/portfolio` : '/portfolio';
  const text = `${item.title} — Cinemagic Creations`;

  const share = (platform: string) => {
    if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
    if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    if (platform === 'copy') {
      navigator.clipboard.writeText(url).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const platforms = [
    { id: 'whatsapp', label: 'WhatsApp', icon: <WhatsAppIcon />, cls: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40' },
    { id: 'facebook', label: 'Facebook', icon: <FbIcon />, cls: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40' },
    { id: 'twitter', label: 'X', icon: <XIcon />, cls: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700' },
    { id: 'copy', label: copied ? 'Copied!' : 'Copy', icon: copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />, cls: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-200 dark:border-white/10"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">Share</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-white/40 dark:hover:text-white/80 transition-colors p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-white/50 mb-5 truncate">{item.title}</p>
        <div className="grid grid-cols-4 gap-3">
          {platforms.map(btn => (
            <button
              key={btn.id}
              onClick={() => share(btn.id)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors ${btn.cls}`}
            >
              {btn.icon}
              <span className="text-xs font-medium leading-none">{btn.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FeaturedWork() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All Work');
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>(
    Object.fromEntries(portfolioItems.map(i => [i.id, i.likes]))
  );
  const [shareTarget, setShareTarget] = useState<PortfolioItem | null>(null);

  const filters = ['All Work', 'Weddings', 'Engagements', 'Graduations'];

  const filteredItems = portfolioItems.filter(item =>
    activeFilter === 'All Work' || item.category === activeFilter
  );

  const toggleLike = (id: number) => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setLikeCounts(c => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) - 1) }));
      } else {
        next.add(id);
        setLikeCounts(c => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
      }
      return next;
    });
  };

  const openShare = (item: PortfolioItem) => {
    const url = window.location.origin + '/portfolio';
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: item.title, text: `${item.title} — Cinemagic Creations`, url })
        .catch(() => setShareTarget(item));
      return;
    }
    setShareTarget(item);
  };

  return (
    <section id="portfolio" className="py-20 bg-slate-50 dark:bg-cosmic-gradient relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-white opacity-100 dark:opacity-0 pointer-events-none transition-opacity duration-300" />
      <div className="absolute inset-0 bg-star-field opacity-0 dark:opacity-10 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-nebula opacity-0 dark:opacity-5 transition-opacity duration-300" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
            Featured <span className="text-primary-600 dark:text-cosmic">Work</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-white/80 max-w-3xl mx-auto transition-colors duration-300">
            Discover our latest captures of love, joy, and celebration. Each moment tells a unique story.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                activeFilter === filter
                  ? 'bg-primary-500 text-white shadow-md dark:shadow-cosmic dark:cosmic-glow'
                  : 'bg-white text-gray-700 shadow-sm hover:bg-primary-50 hover:text-primary-600 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/20 dark:hover:text-white border border-gray-200 dark:border-transparent dark:glass-effect'
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredItems.map((item, index) => {
              const isLiked = liked.has(item.id);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -30 }}
                  transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 100 }}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-xl shadow-gray-200/50 dark:bg-space-900/50 dark:shadow-none dark:backdrop-blur-sm border border-gray-100 dark:border-white/10 premium-hover transition-all duration-300"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Featured Badge */}
                    {item.featured && (
                      <div className="absolute top-4 left-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium cosmic-glow">
                        Featured
                      </div>
                    )}

                    {/* Hover Action Buttons */}
                    <div className="absolute inset-0 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.88 }}
                        onClick={() => router.push(`/portfolio?category=${item.category.toLowerCase()}`)}
                        title="View in portfolio"
                        className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.88 }}
                        onClick={() => toggleLike(item.id)}
                        title={isLiked ? 'Unlike' : 'Like'}
                        className={`w-12 h-12 backdrop-blur-sm rounded-full flex items-center justify-center transition-all ${
                          isLiked ? 'bg-primary-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        <Heart className={`w-5 h-5 transition-all duration-200 ${isLiked ? 'fill-white scale-110' : ''}`} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.88 }}
                        onClick={() => openShare(item)}
                        title="Share"
                        className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-500 transition-colors">
                      {item.title}
                    </h3>

                    <div className="flex items-center space-x-4 text-gray-500 dark:text-white/60 text-sm transition-colors">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span>{item.date}</span>
                      </div>
                    </div>

                    {/* Live Stats Row */}
                    <div className="flex items-center justify-between text-sm pt-1 border-t border-gray-100 dark:border-white/10">
                      <div className="flex items-center space-x-4">
                        <motion.button
                          whileTap={{ scale: 1.35 }}
                          onClick={() => toggleLike(item.id)}
                          className={`flex items-center space-x-1.5 transition-colors ${
                            isLiked
                              ? 'text-primary-500'
                              : 'text-gray-500 dark:text-white/60 hover:text-primary-500 dark:hover:text-primary-400'
                          }`}
                        >
                          <Heart className={`w-4 h-4 transition-all duration-200 ${isLiked ? 'fill-primary-500 scale-110' : ''}`} />
                          <motion.span
                            key={likeCounts[item.id]}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            {likeCounts[item.id] ?? item.likes}
                          </motion.span>
                        </motion.button>

                        <span className="flex items-center space-x-1.5 text-gray-500 dark:text-white/60">
                          <Eye className="w-4 h-4" />
                          <span>{item.views.toLocaleString()}</span>
                        </span>
                      </div>

                      <button
                        onClick={() => openShare(item)}
                        className="text-gray-400 dark:text-white/40 hover:text-primary-500 dark:hover:text-primary-400 transition-colors p-1"
                        title="Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Hover border glow */}
                  <div className="absolute inset-0 rounded-2xl border border-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button variant="secondary" size="lg" className="cosmic-glow" onClick={() => router.push('/portfolio')}>
            View Full Portfolio
          </Button>
        </motion.div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {shareTarget && <ShareModal item={shareTarget} onClose={() => setShareTarget(null)} />}
      </AnimatePresence>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-primary-500 rounded-full animate-float opacity-60" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-primary-500 rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-float opacity-30" style={{ animationDelay: '0.5s' }} />
      </div>
    </section>
  );
}
