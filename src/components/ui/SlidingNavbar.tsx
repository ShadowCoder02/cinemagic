'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const navItems = [
  { id: 'showreel', label: 'Showreel' },
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export default function SlidingNavbar() {
  const [activeTab, setActiveTab] = useState(navItems[0].id);

  return (
    <div className="flex justify-center w-full py-6">
      <nav className="flex items-center space-x-1 p-2 bg-gray-900 rounded-full shadow-lg border border-white/10">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
              relative px-6 py-2.5 text-sm font-medium rounded-full transition-colors duration-300 outline-none
              ${activeTab === item.id ? 'text-white' : 'text-gray-400 hover:text-white'}
            `}
          >
            {activeTab === item.id && (
              <motion.div
                layoutId="active-nav-pill"
                className="absolute inset-0 bg-primary-500 rounded-full"
                initial={false}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                  mass: 0.5,
                }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
