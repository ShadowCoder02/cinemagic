'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Heart, Share2, Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import Button from '@/components/ui/Button';

export default function FeaturedWork() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All Work');

  const filters = ['All Work', 'Weddings', 'Engagements', 'Graduations'];

  const portfolioItems = [
    {
      id: 1,
      title: "Sarah & Michael's Wedding",
      location: "Jaffna, Sri Lanka",
      date: "December 2024",
      category: "Weddings",
      image: "/images/portfolio/wedding-1.jpg",
      likes: 124,
      views: 2340,
      featured: true,
    },
    {
      id: 2,
      title: "Graduation Celebration",
      location: "University of Jaffna",
      date: "November 2024",
      category: "Graduations",
      image: "/images/portfolio/graduation-1.jpg",
      likes: 89,
      views: 1560,
      featured: true,
    },
    {
      id: 3,
      title: "Romantic Engagement",
      location: "Nallur Temple",
      date: "October 2024",
      category: "Engagements",
      image: "/images/portfolio/engagement-1.jpg",
      likes: 156,
      views: 2890,
      featured: true,
    },
    {
      id: 4,
      title: "Traditional Wedding",
      location: "Colombo, Sri Lanka",
      date: "September 2024",
      category: "Weddings",
      image: "/images/portfolio/wedding-2.jpg",
      likes: 203,
      views: 3450,
      featured: false,
    },
    {
      id: 5,
      title: "Medical School Graduation",
      location: "Jaffna Medical College",
      date: "August 2024",
      category: "Graduations",
      image: "/images/portfolio/graduation-2.jpg",
      likes: 178,
      views: 2670,
      featured: false,
    },
    {
      id: 6,
      title: "Beach Engagement",
      location: "Trincomalee Beach",
      date: "July 2024",
      category: "Engagements",
      image: "/images/portfolio/engagement-2.jpg",
      likes: 134,
      views: 1980,
      featured: false,
    },
  ];

  const filteredItems = portfolioItems.filter(item => 
    activeFilter === 'All Work' || item.category === activeFilter
  );

  return (
    <section id="portfolio" className="py-20 bg-slate-50 dark:bg-cosmic-gradient relative overflow-hidden transition-colors duration-300">
      {/* Light Mode Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-white opacity-100 dark:opacity-0 pointer-events-none transition-opacity duration-300"></div>
      
      {/* Cosmic Background Effects */}
      <div className="absolute inset-0 bg-star-field opacity-0 dark:opacity-10 transition-opacity duration-300"></div>
      <div className="absolute inset-0 bg-nebula opacity-0 dark:opacity-5 transition-opacity duration-300"></div>
      
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
          {filters.map((filter) => (
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
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -30 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
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
                  
                  {/* Cosmic Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Featured Badge */}
                  {item.featured && (
                    <div className="absolute top-4 left-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium cosmic-glow">
                      Featured
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute inset-0 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors cosmic-glow"
                    >
                      <Eye className="w-5 h-5" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors cosmic-glow"
                    >
                      <Heart className="w-5 h-5" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors cosmic-glow"
                    >
                      <Share2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-500 transition-colors">
                    {item.title}
                  </h3>
                  
                  {/* Location & Date */}
                  <div className="flex items-center space-x-4 text-gray-500 dark:text-white/60 text-sm transition-colors">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {/* Stats */}
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

                {/* Cosmic Border Effect */}
                <div className="absolute inset-0 rounded-2xl border border-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
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
          <Button
            variant="secondary"
            size="lg"
            className="cosmic-glow"
            onClick={() => router.push('/portfolio')}
          >
            View Full Portfolio
          </Button>
        </motion.div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-primary-500 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-primary-500 rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-float opacity-30" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </section>
  );
}