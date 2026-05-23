'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowUpRight, Camera, FileText, Film, FolderKanban,
  GalleryHorizontal, MessageCircle, PlusCircle, Sparkles, Users,
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface DashboardStats {
  albums: number;
  photos: number;
  films: number;
  publishedPosts: number;
  draftPosts: number;
  testimonials: number;
  newContacts: number;
  recentContacts: Array<{ id: string; name: string; eventType: string; status: string; createdAt: string; email: string }>;
}

const quickActions = [
  { label: 'Albums', description: 'Manage photo albums', icon: Camera, href: '/admin/albums' },
  { label: 'Photos', description: 'Upload & organise photos', icon: GalleryHorizontal, href: '/admin/photos' },
  { label: 'Films', description: 'Add or edit wedding films', icon: Film, href: '/admin/films' },
  { label: 'Blog', description: 'Write & publish posts', icon: FileText, href: '/admin/blog' },
  { label: 'Testimonials', description: 'Manage client reviews', icon: Users, href: '/admin/testimonials' },
  { label: 'Bookings', description: 'View enquiries & bookings', icon: MessageCircle, href: '/admin/contacts' },
];

const card = 'rounded-2xl border border-white/10 bg-gray-900 p-6';
const innerCard = 'rounded-xl border border-white/10 bg-gray-800/60 p-4';

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-500/20 text-blue-400',
  IN_PROGRESS: 'bg-amber-500/20 text-amber-400',
  ARCHIVED: 'bg-white/10 text-white/40',
};

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const metrics = stats
    ? [
        { title: 'Albums', value: stats.albums, icon: FolderKanban, accent: 'from-primary-600 to-primary-700' },
        { title: 'Photos', value: stats.photos, icon: GalleryHorizontal, accent: 'from-purple-600 to-purple-700' },
        { title: 'Films', value: stats.films, icon: Film, accent: 'from-rose-600 to-rose-700' },
        { title: 'Blog Posts', value: stats.publishedPosts, delta: `${stats.draftPosts} drafts`, icon: FileText, accent: 'from-amber-600 to-amber-700' },
      ]
    : [];

  return (
    <section className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-primary-600/30 via-gray-900 to-gray-900 p-8"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(237,64,1,0.15),_transparent_60%)]" />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Control Centre</p>
            <h1 className="mt-2 text-3xl font-display font-semibold text-white">Welcome back, Keerththikan.</h1>
            <p className="mt-2 text-sm text-white/70 max-w-lg">
              Your cinematic universe is humming. Track launches, ship new stories, and keep the magic alive.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/blog">
              <Button variant="ghost" className="gap-2 border border-white/15 text-white/80 hover:text-white text-sm">
                <Sparkles className="h-4 w-4" /> New Blog
              </Button>
            </Link>
            <Link href="/admin/albums">
              <Button variant="primary" className="gap-2 text-sm">
                <PlusCircle className="h-4 w-4" /> New Album
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats
          ? metrics.map((metric, i) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${metric.accent}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/75">{metric.title}</p>
                      <p className="mt-3 text-4xl font-display font-bold text-white">{metric.value}</p>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                      <Icon className="h-5 w-5 text-white" />
                    </span>
                  </div>
                  {'delta' in metric && <p className="mt-4 text-xs text-white/80">{metric.delta}</p>}
                </motion.div>
              );
            })
          : Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-800" />
            ))}
      </div>

      {/* Quick Actions + Recent Bookings */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className={card}>
          <div className="mb-5">
            <h2 className="text-base font-semibold text-white">Quick actions</h2>
            <p className="text-sm text-white/60">Jump straight into creation.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex flex-col gap-2 rounded-xl border border-white/10 bg-gray-800/50 p-4 transition-colors hover:border-primary-500/50 hover:bg-primary-500/10"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 group-hover:bg-primary-500/20 transition-colors">
                    <Icon className="h-4 w-4 text-white/80 group-hover:text-primary-400" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{action.label}</p>
                    <p className="text-xs text-white/50">{action.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className={card}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-white">Recent bookings</h2>
              <p className="text-sm text-white/60">
                {stats ? <>{stats.newContacts} new enquir{stats.newContacts === 1 ? 'y' : 'ies'} awaiting reply</> : 'Loading…'}
              </p>
            </div>
            <Link href="/admin/contacts">
              <Button variant="ghost" className="gap-1.5 text-white/70 hover:text-white text-xs">
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            {stats?.recentContacts.length === 0 && (
              <p className="text-sm text-white/50 text-center py-8">No bookings yet.</p>
            )}
            {stats?.recentContacts.map((c) => (
              <div key={c.id} className={`${innerCard} flex items-center justify-between gap-3`}>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{c.name}</p>
                  <p className="text-xs text-white/55">{c.eventType} · {new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[c.status] ?? ''}`}>
                  {c.status === 'IN_PROGRESS' ? 'In Progress' : c.status}
                </span>
              </div>
            ))}
            {!stats && <div className="h-24 animate-pulse rounded-xl bg-gray-800" />}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
