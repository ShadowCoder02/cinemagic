'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Search, Clock, Eye, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';


const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const categories = [
    { id: 'all', name: 'All Posts', count: 24 },
    { id: 'wedding-tips', name: 'Wedding Tips', count: 8 },
    { id: 'photography', name: 'Photography', count: 6 },
    { id: 'stories', name: 'Love Stories', count: 5 },
    { id: 'graduation', name: 'Graduation', count: 3 },
    { id: 'behind-scenes', name: 'Behind the Scenes', count: 2 },
  ];

  const tags = [
    'wedding', 'photography', 'cinematography', 'jaffna', 'sri-lanka',
    'love-story', 'graduation', 'engagement', 'tips', 'behind-scenes'
  ];

  const blogPosts = [
    {
      id: 1,
      title: '10 Essential Wedding Photography Tips for Your Big Day',
      excerpt: 'Discover the secrets to getting perfect wedding photos that will last a lifetime. From timing to lighting, we share our professional insights.',
      content: 'Your wedding day is one of the most important days of your life, and having beautiful photographs to remember it is essential...',
      author: 'Keerththikan',
      date: '2024-12-15',
      readTime: '5 min read',
      category: 'wedding-tips',
      tags: ['wedding', 'photography', 'tips'],
      image: '/images/blog/wedding-tips.jpg',
      featured: true,
      views: 1234,
      likes: 89,
    },
    {
      id: 2,
      title: 'The Art of Capturing Candid Moments in Wedding Photography',
      excerpt: 'Learn how we capture those spontaneous, emotional moments that make your wedding photos truly special and authentic.',
      content: 'Candid photography is the heart of wedding storytelling. These unposed, genuine moments often become the most treasured memories...',
      author: 'Keerththikan',
      date: '2024-12-10',
      readTime: '7 min read',
      category: 'photography',
      tags: ['photography', 'candid', 'wedding'],
      image: '/images/blog/candid-photography.jpg',
      featured: true,
      views: 987,
      likes: 67,
    },
    {
      id: 3,
      title: 'Sarah & Michael\'s Love Story: A Jaffna Wedding',
      excerpt: 'Follow the beautiful journey of Sarah and Michael as they celebrate their love in a traditional Jaffna wedding ceremony.',
      content: 'Every love story is unique, and Sarah and Michael\'s journey was no exception. From their first meeting at University of Jaffna...',
      author: 'Keerththikan',
      date: '2024-12-05',
      readTime: '6 min read',
      category: 'stories',
      tags: ['love-story', 'jaffna', 'wedding'],
      image: '/images/blog/sarah-michael-story.jpg',
      featured: false,
      views: 1456,
      likes: 123,
    },
    {
      id: 4,
      title: 'Graduation Photography: Capturing Academic Achievements',
      excerpt: 'Tips and insights for graduation photography that celebrates your academic journey and achievements.',
      content: 'Graduation day is a milestone worth celebrating, and having professional photographs helps preserve these precious memories...',
      author: 'Keerththikan',
      date: '2024-11-28',
      readTime: '4 min read',
      category: 'graduation',
      tags: ['graduation', 'photography', 'academic'],
      image: '/images/blog/graduation-photography.jpg',
      featured: false,
      views: 756,
      likes: 45,
    },
    {
      id: 5,
      title: 'Behind the Scenes: Creating a Wedding Film',
      excerpt: 'Go behind the scenes and see how we create cinematic wedding films that tell your love story beautifully.',
      content: 'Creating a wedding film is an art form that requires careful planning, technical expertise, and creative vision...',
      author: 'Keerththikan',
      date: '2024-11-20',
      readTime: '8 min read',
      category: 'behind-scenes',
      tags: ['cinematography', 'behind-scenes', 'wedding'],
      image: '/images/blog/behind-scenes-film.jpg',
      featured: false,
      views: 1123,
      likes: 78,
    },
    {
      id: 6,
      title: 'Engagement Session Ideas for Jaffna Couples',
      excerpt: 'Creative engagement session ideas that showcase the beauty of Jaffna and your unique love story.',
      content: 'Engagement sessions are a wonderful way to celebrate your love and get comfortable in front of the camera...',
      author: 'Keerththikan',
      date: '2024-11-15',
      readTime: '5 min read',
      category: 'photography',
      tags: ['engagement', 'jaffna', 'photography'],
      image: '/images/blog/engagement-ideas.jpg',
      featured: false,
      views: 892,
      likes: 56,
    },
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);

    return matchesSearch && matchesCategory && matchesTag;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

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
              Our <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-white/80 max-w-3xl mx-auto transition-colors duration-300">
              Stories, tips, and insights from the world of wedding photography and cinematography.
              Learn from our experiences and get inspired for your special day.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-white/60 transition-colors" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:focus:bg-white/20 transition-all duration-300 shadow-sm dark:shadow-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category.id
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/80 hover:bg-gray-200 dark:hover:bg-white/20 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>

            {/* Tag Filter */}
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm dark:shadow-none transition-colors duration-300"
              >
                <option value="all">All Tags</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-12 text-center transition-colors duration-300"
            >
              Featured Posts
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-none shadow-sm dark:shadow-none cursor-pointer transition-colors duration-300"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Featured Badge */}
                    <div className="absolute top-4 left-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </div>

                    {/* Category */}
                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-medium border border-white/20">
                      {categories.find(c => c.id === post.category)?.name}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-500 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-white/70 mb-4 line-clamp-3 transition-colors duration-300">{post.excerpt}</p>

                    <div className="flex items-center space-x-4 text-gray-500 dark:text-white/60 text-sm mb-4 transition-colors">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-gray-500 dark:text-white/60 text-sm transition-colors">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </span>
                      </div>
                      <Link
                        href={`/blog/${post.id}`}
                        className="flex items-center space-x-1 text-primary-500 hover:text-primary-400 transition-colors"
                      >
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-black transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-12 text-center transition-colors duration-300"
          >
            All Posts
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-none shadow-sm dark:shadow-none cursor-pointer transition-colors duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Category */}
                  <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-medium border border-white/20">
                    {categories.find(c => c.id === post.category)?.name}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-500 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-white/70 mb-4 line-clamp-2 transition-colors duration-300">{post.excerpt}</p>

                  <div className="flex items-center space-x-4 text-gray-500 dark:text-white/60 text-sm mb-4 transition-colors">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-gray-500 dark:text-white/60 text-sm transition-colors">
                      <span className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.views}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </span>
                    </div>
                    <Link
                      href={`/blog/${post.id}`}
                      className="flex items-center space-x-1 text-primary-500 hover:text-primary-400 transition-colors"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-500 dark:text-white/60 text-lg mb-4 transition-colors">No posts found matching your criteria</div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedTag('all');
                }}
                className="text-primary-500 hover:text-primary-400 transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </section>


    </main>
  );
};

export default BlogPage;
