'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Calendar, MapPin, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import { getFeaturedFilms } from '@/data/films';

const featuredFilms = getFeaturedFilms().slice(0, 3);

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export default function FeaturedFilms() {
  return (
    <section id="films" className="relative py-20 bg-slate-50 dark:bg-black overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-100 via-white to-slate-100 dark:from-black dark:via-gray-900 dark:to-black opacity-100 dark:opacity-80 transition-colors duration-300"></div>
      <div className="absolute inset-0 bg-star-field opacity-0 dark:opacity-10 transition-opacity duration-300"></div>
      <div className="absolute inset-0 bg-nebula opacity-0 dark:opacity-10 transition-opacity duration-300"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm uppercase tracking-[0.4em] text-primary-600 dark:text-primary-400 mb-4 transition-colors">Signature Films</p>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
            Featured <span className="text-gradient">Films</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-700 dark:text-white/70 transition-colors duration-300">
            Press play on the love stories our couples can&apos;t stop replaying. Each film is a crafted blend of
            emotion, rhythm, and cinematic storytelling.
          </p>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -100px 0px' }}
        >
          {featuredFilms.map((film, index) => (
            <motion.article
              key={film.id}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-lg shadow-gray-200/50 dark:shadow-none transition-all duration-300"
              variants={cardVariants}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={film.thumbnail}
                  alt={film.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 group-hover:bg-primary-500/80 group-hover:border-primary-400">
                    <Play className="w-8 h-8 ml-1" />
                  </div>
                </div>

                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wide rounded-full bg-primary-500 text-white shadow-lg shadow-primary-500/30">
                    Featured
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                  {film.duration}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-primary-600 dark:text-primary-300 tracking-[0.3em] uppercase transition-colors">{film.category}</p>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {film.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-white/70 text-base leading-relaxed transition-colors duration-300">{film.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-gray-500 dark:text-white/60 text-sm transition-colors">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {film.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {film.date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {film.duration}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/films" className="inline-flex">
            <Button size="lg" variant="secondary" className="cosmic-glow">
              Explore Full Film Library
            </Button>
          </Link>
        </motion.div>
      </div>

      <div className="absolute -top-24 -right-20 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-16 -left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl"></div>
    </section>
  );
}
