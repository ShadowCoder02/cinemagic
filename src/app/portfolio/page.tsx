'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Heart, Share2, Calendar, MapPin, Grid, List } from 'lucide-react';
import Image from 'next/image';


const PortfolioPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const categories = [
    { id: 'all', name: 'All Work', count: 48 },
    { id: 'weddings', name: 'Weddings', count: 28 },
    { id: 'engagements', name: 'Engagements', count: 12 },
    { id: 'graduations', name: 'Graduations', count: 8 },
  ];

  const portfolioItems = [
    {
      id: 1,
      title: 'Sarah & Michael\'s Wedding',
      category: 'weddings',
      location: 'Jaffna, Sri Lanka',
      date: 'December 2024',
      image: '/images/portfolio/wedding-1.jpg',
      likes: 124,
      views: 2340,
      featured: true,
      tags: ['traditional', 'outdoor', 'ceremony'],
    },
    {
      id: 2,
      title: 'Graduation Celebration',
      category: 'graduations',
      location: 'University of Jaffna',
      date: 'November 2024',
      image: '/images/portfolio/graduation-1.jpg',
      likes: 89,
      views: 1560,
      featured: true,
      tags: ['academic', 'celebration', 'formal'],
    },
    {
      id: 3,
      title: 'Romantic Engagement',
      category: 'engagements',
      location: 'Nallur Temple',
      date: 'October 2024',
      image: '/images/portfolio/engagement-1.jpg',
      likes: 156,
      views: 2890,
      featured: true,
      tags: ['romantic', 'temple', 'traditional'],
    },
    {
      id: 4,
      title: 'Traditional Wedding',
      category: 'weddings',
      location: 'Colombo, Sri Lanka',
      date: 'September 2024',
      image: '/images/portfolio/wedding-2.jpg',
      likes: 203,
      views: 3450,
      featured: false,
      tags: ['traditional', 'indoor', 'ceremony'],
    },
    {
      id: 5,
      title: 'Medical School Graduation',
      category: 'graduations',
      location: 'Jaffna Medical College',
      date: 'August 2024',
      image: '/images/portfolio/graduation-2.jpg',
      likes: 178,
      views: 2670,
      featured: false,
      tags: ['medical', 'academic', 'achievement'],
    },
    {
      id: 6,
      title: 'Beach Engagement',
      category: 'engagements',
      location: 'Trincomalee Beach',
      date: 'July 2024',
      image: '/images/portfolio/engagement-2.jpg',
      likes: 134,
      views: 1980,
      featured: false,
      tags: ['beach', 'romantic', 'sunset'],
    },
    {
      id: 7,
      title: 'Garden Wedding',
      category: 'weddings',
      location: 'Kandy, Sri Lanka',
      date: 'June 2024',
      image: '/images/portfolio/wedding-3.jpg',
      likes: 167,
      views: 3120,
      featured: false,
      tags: ['garden', 'outdoor', 'nature'],
    },
    {
      id: 8,
      title: 'Engineering Graduation',
      category: 'graduations',
      location: 'University of Jaffna',
      date: 'May 2024',
      image: '/images/portfolio/graduation-3.jpg',
      likes: 145,
      views: 2230,
      featured: false,
      tags: ['engineering', 'academic', 'celebration'],
    },
  ];

  const filteredItems = activeCategory === 'all'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-300">


      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-slate-100 to-white dark:from-black dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
              Our <span className="text-gradient">Portfolio</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-white/80 max-w-3xl mx-auto transition-colors duration-300">
              Explore our collection of wedding photography, films, and graduation captures.
              Each image tells a unique story of love, joy, and celebration.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Controls */}
      <section className="py-8 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category.id
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/80 hover:bg-gray-200 dark:hover:bg-white/20 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>

            {/* View Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-white/10 rounded-lg p-1 transition-colors">
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`p-2 rounded transition-colors ${viewMode === 'masonry' ? 'bg-primary-500 text-white' : 'text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            layout
            className={
              viewMode === 'masonry'
                ? 'masonry-grid'
                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
            }
          >
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-none shadow-sm dark:shadow-none transition-colors duration-300 ${viewMode === 'masonry' ? 'masonry-item' : ''
                    }`}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => setSelectedImage(item.id)}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Featured Badge */}
                    {item.featured && (
                      <div className="absolute top-4 left-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </div>
                    )}

                    {/* Hover Actions */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: hoveredItem === item.id ? 1 : 0,
                        y: hoveredItem === item.id ? 0 : 20
                      }}
                      className="absolute inset-0 flex items-center justify-center space-x-4"
                    >
                      <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                      <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-500 transition-colors">
                      {item.title}
                    </h3>

                    <div className="flex items-center space-x-4 text-gray-500 dark:text-white/60 text-sm mb-3 transition-colors">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{item.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-gray-500 dark:text-white/60 text-sm transition-colors">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{item.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{item.views}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                ×
              </button>
              <div className="relative w-full h-[80vh]">
                <Image
                  src={portfolioItems.find(item => item.id === selectedImage)?.image || ''}
                  alt={portfolioItems.find(item => item.id === selectedImage)?.title || ''}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </main>
  );
};

export default PortfolioPage;
