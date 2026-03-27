"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 dark:bg-black/30 dark:hover:bg-black/50 transition-colors duration-300 backdrop-blur-sm group"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {theme === 'dark' ? (
          <motion.div
            initial={{ scale: 0.5, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
             <Moon className="w-5 h-5 text-gray-200 group-hover:text-primary-400 transition-colors" />
          </motion.div>
        ) : (
           <motion.div
            initial={{ scale: 0.5, rotate: 90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sun className="w-5 h-5 text-gray-800 group-hover:text-primary-500 transition-colors" />
          </motion.div>
        )}
      </div>
    </button>
  );
}
