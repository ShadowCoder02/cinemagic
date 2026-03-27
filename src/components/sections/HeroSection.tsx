'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Volume2, VolumeX, Maximize, Calendar } from 'lucide-react';
import Image from 'next/image';
import Button from '@/components/ui/Button';

export default function HeroSection() {
  const router = useRouter();
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const heroVideos = [
    {
      id: 1,
      title: 'Wedding Highlights',
      description: 'Cinematic storytelling that captures your love story',
      video: null, // Disabled for now
      thumbnail: '/images/hero/hero-wedding.jpg',
    },
    {
      id: 2,
      title: 'Photography',
      description: 'Timeless moments frozen in perfect frames',
      video: null, // Disabled for now
      thumbnail: '/images/hero/hero-photography.jpg',
    },
    {
      id: 3,
      title: 'Graduation',
      description: 'Celebrating academic achievements with style',
      video: null, // Disabled for now
      thumbnail: '/images/hero/hero-graduation.jpg',
    },
  ];

  // Auto-rotate videos every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % heroVideos.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [heroVideos.length]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <section id="home" className="relative h-screen overflow-hidden space-texture">
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-cosmic-gradient opacity-0 dark:opacity-100 transition-opacity duration-500">
        {/* Starry overlay */}
        <div className="absolute inset-0 bg-star-field opacity-30"></div>
        <div className="absolute inset-0 bg-nebula opacity-20"></div>
        <div className="absolute inset-0 bg-galaxy opacity-15"></div>
      </div>

      {/* Video/Image Background */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVideo}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="relative w-full h-full"
          >
            <Image
              src={heroVideos[currentVideo].thumbnail}
              alt={heroVideos[currentVideo].title}
              fill
              className="object-cover"
              priority
            />
            
            {/* Cinematic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/40 to-white/90 dark:from-black/80 dark:via-black/40 dark:to-black/80 transition-colors duration-500"></div>
            
            {/* Cosmic particles overlay */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-500 rounded-full animate-pulse-glow"></div>
              <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-float"></div>
              <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse-glow"></div>
              <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-float"></div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div className="absolute top-1/2 left-8 transform -translate-y-1/2 z-20">
        <div className="flex flex-col space-y-4">
          {heroVideos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentVideo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                index === currentVideo
                  ? 'bg-primary-500 scale-125 shadow-cosmic'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {/* Keep messaging centered so the rotating imagery remains a cinematic backdrop without competing focal points */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-8"
          >
            {/* Cosmic Title */}
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-gray-900 dark:text-white leading-tight transition-colors duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              Capturing Love, Stories, and{' '}
              <span className="text-primary-600 dark:text-cosmic dark:bg-gradient-to-r dark:from-primary-500 dark:via-white dark:to-primary-500 dark:bg-clip-text dark:text-transparent animate-shimmer">
                Moments
              </span>
              <br />
              in Jaffna & Beyond
            </motion.h1>

            <motion.p 
              className="text-xl lg:text-2xl text-gray-700 dark:text-white/90 max-w-3xl mx-auto leading-relaxed transition-colors duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              {heroVideos[currentVideo].description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
            >
              <Button
                variant="primary"
                size="lg"
                className="group cosmic-glow"
                onClick={() => router.push('/#portfolio')}
              >
                <Play className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                View Portfolio
              </Button>
              
              <Button
                variant="secondary"
                size="lg"
                className="group glass-effect hover:bg-white/20"
                onClick={() => router.push('/#contact')}
              >
                <Calendar className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Book Your Wedding Film
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto pt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.3 }}
            >
              <div className="flex flex-col items-center justify-center p-6 bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-2xl hover:bg-white/60 dark:hover:bg-white/5 transition-all duration-300 group hover:-translate-y-2 shadow-xl dark:shadow-2xl">
                <div className="text-4xl lg:text-5xl font-display font-bold text-primary-600 dark:text-primary-500 mb-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                  500+
                </div>
                <div className="text-gray-800 dark:text-white/80 font-medium text-sm lg:text-base tracking-wide transition-colors duration-300">
                  Weddings Captured
                </div>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-2xl hover:bg-white/60 dark:hover:bg-white/5 transition-all duration-300 group hover:-translate-y-2 shadow-xl dark:shadow-2xl">
                <div className="text-4xl lg:text-5xl font-display font-bold text-primary-600 dark:text-primary-500 mb-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                  8+
                </div>
                <div className="text-gray-800 dark:text-white/80 font-medium text-sm lg:text-base tracking-wide transition-colors duration-300">
                  Years Experience
                </div>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-2xl hover:bg-white/60 dark:hover:bg-white/5 transition-all duration-300 group hover:-translate-y-2 shadow-xl dark:shadow-2xl">
                <div className="text-4xl lg:text-5xl font-display font-bold text-primary-600 dark:text-primary-500 mb-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                  100%
                </div>
                <div className="text-gray-800 dark:text-white/80 font-medium text-sm lg:text-base tracking-wide transition-colors duration-300">
                  Client Satisfaction
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>



      {/* Video Controls */}
      <motion.div 
        className="absolute bottom-8 right-8 z-20 flex space-x-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        <button
          onClick={toggleMute}
          className="w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        
        <button
          onClick={toggleFullscreen}
          className="w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
        >
          <Maximize className="w-5 h-5" />
        </button>
      </motion.div>
    </section>
  );
}