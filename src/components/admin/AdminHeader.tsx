'use client';

import { useState, useEffect, useRef } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Home,
  LogOut,
  Search,
  Sun,
  Moon,
  Settings,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from 'next-themes';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { adminNavItems } from '@/lib/admin-nav';

interface Contact {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const AdminHeader = () => {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState<Contact[]>([]);
  const [notifsLoading, setNotifsLoading] = useState(false);
  const notifsRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Fetch new contacts on mount
  useEffect(() => {
    setNotifsLoading(true);
    fetch('/api/admin/contacts?status=NEW&limit=5')
      .then((r) => r.json())
      .then((data) => setNotifs(data?.contacts ?? []))
      .catch(() => {})
      .finally(() => setNotifsLoading(false));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeItem = adminNavItems.find((item) => pathname.startsWith(item.href));
  const isDark = !mounted || resolvedTheme === 'dark';

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-4 px-6">
        <motion.div
          key={activeItem?.href ?? 'default'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden flex-col lg:flex"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Dashboard</p>
          <h2 className="text-xl font-display font-semibold text-white">
            {activeItem?.label ?? 'Overview'}
          </h2>
        </motion.div>

        <div className="ml-auto flex flex-1 items-center gap-3">
          <div className="hidden max-w-sm flex-1 items-center gap-3 rounded-full border border-white/15 bg-white/8 px-4 py-2 md:flex">
            <Search className="h-4 w-4 text-white/60 flex-shrink-0" />
            <Input
              className="border-0 bg-transparent p-0 text-sm text-white placeholder:text-white/50 focus-visible:ring-0"
              placeholder="Search..."
              aria-label="Global search"
            />
          </div>

          {/* Notification bell */}
          <div className="relative" ref={notifsRef}>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              className="relative border border-white/10 bg-white/5 text-white hover:bg-white/10"
              onClick={() => setShowNotifs((v) => !v)}
            >
              <Bell className="h-5 w-5" />
              {notifs.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">
                  {notifs.length > 9 ? '9+' : notifs.length}
                </span>
              )}
            </Button>

            <AnimatePresence>
              {showNotifs && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-white/10 bg-gray-900 shadow-2xl overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <p className="text-sm font-semibold text-white">New Enquiries</p>
                    <Link
                      href="/admin/contacts"
                      onClick={() => setShowNotifs(false)}
                      className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      View all
                    </Link>
                  </div>

                  {notifsLoading ? (
                    <div className="px-4 py-6 text-center text-sm text-white/40">Loading...</div>
                  ) : notifs.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 px-4 py-8">
                      <CheckCircle2 className="h-8 w-8 text-green-400/60" />
                      <p className="text-sm text-white/50">All caught up!</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-white/5">
                      {notifs.map((c) => (
                        <li key={c.id}>
                          <Link
                            href="/admin/contacts"
                            onClick={() => setShowNotifs(false)}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                          >
                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-500/20">
                              <Mail className="h-3.5 w-3.5 text-primary-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-white">{c.name}</p>
                              <p className="truncate text-xs text-white/50">{c.email}</p>
                              <p className="mt-0.5 text-xs text-white/30">
                                {new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            className="border border-white/10 bg-white/5 text-white hover:bg-white/10"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
          >
            {mounted && isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Link href="/" className="hidden lg:block">
            <Button variant="ghost" className="gap-2 text-white">
              <Home className="h-4 w-4" />
              View Site
            </Button>
          </Link>

          <Button
            variant="ghost"
            className="gap-2 text-white"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>

          <Button variant="primary" className="hidden gap-2 text-white sm:flex">
            <Settings className="h-4 w-4" />
            Quick settings
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
