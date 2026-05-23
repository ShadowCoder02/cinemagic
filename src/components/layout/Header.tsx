'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, PhoneCall } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Image from 'next/image';

const InstagramIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const AnimatedCallIcon = () => (
  <div className="relative w-8 h-8 flex items-center justify-center">
    {/* Ripple ring 1 */}
    <motion.span
      className="absolute inset-0 rounded-full bg-primary-500/30"
      animate={{ scale: [0.75, 1.75], opacity: [0.8, 0] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut', repeatDelay: 1.2 }}
    />
    {/* Ripple ring 2 */}
    <motion.span
      className="absolute inset-0 rounded-full bg-primary-500/20"
      animate={{ scale: [0.75, 2.1], opacity: [0.6, 0] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut', repeatDelay: 1.2, delay: 0.4 }}
    />
    {/* Ringing icon */}
    <motion.div
      className="relative z-10"
      animate={{ rotate: [0, -14, 14, -10, 10, -5, 5, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
    >
      <PhoneCall className="w-5 h-5 text-primary-500" />
    </motion.div>
  </div>
);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Albums', href: '/albums' },
    { name: 'Wedding Films', href: '/films' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <Image
                src="/images/logo-cropped.png"
                alt="Cinemagic Creations"
                width={1297}
                height={304}
                className="h-10 lg:h-12 w-auto object-contain"
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 bg-white/50 dark:bg-gray-900/80 p-1.5 rounded-full border border-gray-200 dark:border-white/10 backdrop-blur-md shadow-sm">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 outline-none
                    ${isActive 
                      ? 'text-white dark:text-white' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="desktop-nav-pill"
                      className="absolute inset-0 bg-primary-500 rounded-full shadow-sm"
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                        mass: 0.5,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="tel:+94776216556"
              className="text-gray-900 dark:text-white/80 hover:text-primary-600 dark:hover:text-primary-500 transition-colors"
              aria-label="Call us"
            >
              <AnimatedCallIcon />
            </a>
            <a
              href="https://instagram.com/cine_magic_creations"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 dark:text-white/80 hover:text-primary-600 dark:hover:text-primary-500 transition-colors"
            >
              <InstagramIcon />
            </a>
            <ThemeToggle />
            <Button variant="primary" size="sm" onClick={() => router.push('/#contact')}>
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-900 dark:text-white p-2 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-gray-200 dark:border-white/10 transition-colors duration-300"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-gray-900 dark:text-white/90 hover:text-primary-600 dark:hover:text-primary-500 transition-colors duration-300 font-medium py-2"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              
              <div className="pt-4 border-t border-gray-200 dark:border-white/10 transition-colors duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <a
                    href="tel:+94776216556"
                    className="text-gray-900 dark:text-white/80 hover:text-primary-600 dark:hover:text-primary-500 transition-colors"
                    aria-label="Call us"
                  >
                    <AnimatedCallIcon />
                  </a>
                  <a
                    href="https://instagram.com/cine_magic_creations"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 dark:text-white/80 hover:text-primary-600 dark:hover:text-primary-500 transition-colors"
                  >
                    <InstagramIcon />
                  </a>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/#contact');
                  }}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
