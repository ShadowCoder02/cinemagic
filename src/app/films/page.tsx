'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Heart, Share2, Calendar, MapPin, Clock, Eye } from 'lucide-react';
import Image from 'next/image';

import { films } from '@/data/films';

const FilmsPage = () => {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted] = useState(true);

  const featuredFilms = films.filter(film => film.featured);
  const regularFilms = films.filter(film => !film.featured);

  const openVideo = (videoId: number) => {
    setSelectedVideo(videoId);
    setIsPlaying(true);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
    setIsPlaying(false);
  };

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
              Wedding <span className="text-gradient">Films</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-white/80 max-w-3xl mx-auto transition-colors duration-300">
              Experience the magic of your special day through our cinematic wedding films.
              Each film tells a unique love story with emotion and artistry.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Films */}
      {featuredFilms.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-12 text-center transition-colors duration-300"
            >
              Featured Films
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredFilms.map((film, index) => (
                <motion.div
                  key={film.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-none shadow-sm dark:shadow-none cursor-pointer transition-colors duration-300"
                  onClick={() => openVideo(film.id)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={film.thumbnail}
                      alt={film.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Featured Badge */}
                    <div className="absolute top-4 left-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                      Featured
                    </div>

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                        <Play className="w-10 h-10 ml-1" />
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="absolute bottom-4 right-4 bg-gray-900/80 dark:bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-sm font-medium">
                      {film.duration}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-500 transition-colors">
                      {film.title}
                    </h3>
                    <p className="text-gray-600 dark:text-white/70 mb-4 transition-colors duration-300">{film.description}</p>

                    <div className="flex items-center space-x-4 text-gray-500 dark:text-white/60 text-sm mb-4 transition-colors">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{film.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{film.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{film.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-gray-400 dark:text-white/60 text-sm transition-colors">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{film.views.toLocaleString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{film.likes}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 dark:text-white/60 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 dark:text-white/60 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Films */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-black transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-12 text-center transition-colors duration-300"
          >
            All Films
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularFilms.map((film, index) => (
              <motion.div
                key={film.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-none shadow-sm dark:shadow-none cursor-pointer transition-colors duration-300"
                onClick={() => openVideo(film.id)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={film.thumbnail}
                    alt={film.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                      <Play className="w-8 h-8 ml-1" />
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-4 right-4 bg-gray-900/80 dark:bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-sm font-medium transition-colors">
                    {film.duration}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-500 transition-colors">
                    {film.title}
                  </h3>

                  <div className="flex items-center space-x-4 text-gray-500 dark:text-white/60 text-sm mb-3 transition-colors">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{film.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{film.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-gray-400 dark:text-white/60 text-sm transition-colors">
                      <span className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{film.views.toLocaleString()}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{film.likes}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 dark:text-white/60 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 dark:text-white/60 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 transition-colors duration-300"
            onClick={closeVideo}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-6xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeVideo}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-900/50 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-gray-900/70 dark:hover:bg-white/30 transition-colors text-2xl"
              >
                ×
              </button>

              {/* Video Player */}
              {(() => {
                const film = films.find(f => f.id === selectedVideo);
                if (!film) return null;

                return (
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      className="w-full h-full object-cover"
                      controls
                      autoPlay={isPlaying}
                      muted={isMuted}
                      poster={film.thumbnail}
                    >
                      <source src={film.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>

                    {/* Video Info Overlay */}
                    <div className="absolute bottom-4 left-4 bg-gray-900/80 dark:bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white shadow-lg transition-colors duration-300">
                      <h3 className="text-xl font-semibold mb-2">{film.title}</h3>
                      <p className="text-white/80 text-sm mb-2">{film.description}</p>
                      <div className="flex items-center space-x-4 text-white/60 text-sm">
                        <span>{film.location}</span>
                        <span>{film.date}</span>
                        <span>{film.duration}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </main>
  );
};

export default FilmsPage;
