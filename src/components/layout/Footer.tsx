'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';

/* Inline SVGs replace deprecated lucide brand icons */
const InstagramIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: 'Wedding Photography', href: '/portfolio?category=weddings' },
      { name: 'Wedding Films', href: '/films' },
      { name: 'Graduation Photography', href: '/portfolio?category=graduations' },
      { name: 'Engagement Sessions', href: '/portfolio?category=engagements' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Portfolio', href: '/portfolio' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/contact' },
    ],
    support: [
      { name: 'Booking Process', href: '/about#booking' },
      { name: 'Pricing', href: '/contact#pricing' },
      { name: 'FAQ', href: '/contact#faq' },
      { name: 'Testimonials', href: '/about#testimonials' },
    ],
  };

  const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com/cine_magic_creations', Icon: InstagramIcon },
    { name: 'Facebook', href: '#', Icon: FacebookIcon },
    { name: 'YouTube', href: '#', Icon: YoutubeIcon },
  ];

  return (
    <footer className="bg-black text-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/logo-cropped.png"
                alt="Cinemagic Creations"
                width={1297}
                height={304}
                className="h-14 w-auto object-contain object-left max-w-[220px]"
              />
            </Link>
            <p className="text-white/70 mb-6 leading-relaxed">
              Capturing love, stories, and moments<br />
              in Jaffna &amp; beyond.<br />
              Professional wedding photography and<br />
              cinematography with an artistic touch.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-white/80">
                <Phone className="w-4 h-4 text-primary-500 shrink-0" />
                <span>+94 77 621 6556</span>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <Mail className="w-4 h-4 text-primary-500 shrink-0" />
                <span>info@cinemagiccreations.com</span>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
                <span>Jaffna, Sri Lanka</span>
              </div>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="lg:pl-6">
            <h3 className="text-lg font-semibold mb-6 text-white">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/70 hover:text-primary-500 transition-colors duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="lg:pl-6">
            <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/70 hover:text-primary-500 transition-colors duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="lg:pl-6">
            <h3 className="text-lg font-semibold mb-6 text-white">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/70 hover:text-primary-500 transition-colors duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-5">
              {socialLinks.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-primary-500 transition-colors duration-300"
                  aria-label={name}
                >
                  <Icon />
                </a>
              ))}
            </div>
            <div className="text-center sm:text-right">
              <p className="text-white/70 text-sm">
                © {currentYear} Cinemagic Creations. All rights reserved.
              </p>
              <p className="text-white/40 text-xs mt-1">Crafted with ❤️ in Jaffna, Sri Lanka</p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
