'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Film, PlusCircle, Pencil, Trash2, X, Star } from 'lucide-react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface FilmRecord {
  id: string; title: string; slug: string; description: string | null;
  videoUrl: string; platform: string; posterUrl: string | null;
  duration: string | null; location: string | null; category: string;
  isFeatured: boolean; views: number; tags: string[];
}

const CATS = ['wedding', 'engagement', 'graduation', 'event'];
const PLATFORMS = ['YOUTUBE', 'VIMEO', 'CLOUDINARY'];
const empty = { title: '', description: '', videoUrl: '', platform: 'YOUTUBE', posterUrl: '', duration: '', location: '', category: 'wedding', isFeatured: false, tags: '' };

export default function FilmsPage() {
  const [films, setFilms] = useState<FilmRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<FilmRecord | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetch_ = async () => {
    setLoading(true);
    const r = await fetch('/api/admin/films');
    if (r.ok) setFilms(await r.json());
    setLoading(false);
  };
  useEffect(() => { fetch_(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit = (f: FilmRecord) => {
    setEditing(f);
    setForm({ title: f.title, description: f.description ?? '', videoUrl: f.videoUrl, platform: f.platform, posterUrl: f.posterUrl ?? '', duration: f.duration ?? '', location: f.location ?? '', category: f.category, isFeatured: f.isFeatured, tags: (f.tags ?? []).join(', ') });
    setShowModal(true);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    const r = await fetch('/api/upload', { method: 'POST', body: fd });
    if (r.ok) { const { url } = await r.json(); setForm((f) => ({ ...f, posterUrl: url })); }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) };
    const url = editing ? `/api/admin/films/${editing.id}` : '/api/admin/films';
    const method = editing ? 'PUT' : 'POST';
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (r.ok) { await fetch_(); setShowModal(false); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this film?')) return;
    setDeleting(id);
    await fetch(`/api/admin/films/${id}`, { method: 'DELETE' });
    setFilms((f) => f.filter((x) => x.id !== id));
    setDeleting(null);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold text-white">Films</h1>
          <p className="mt-1 text-sm text-white/60">Manage wedding & graduation films — visible on site immediately.</p>
        </div>
        <Button variant="primary" className="gap-2" onClick={openCreate}><PlusCircle className="h-5 w-5" /> New Film</Button>
      </motion.div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-800" />)}</div>
      ) : films.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 py-32 text-center">
          <Film className="h-10 w-10 text-white/30 mb-4" />
          <p className="text-white/60">No films yet. Add your first film.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {films.map((f) => (
            <motion.div key={f.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-gray-900 p-4">
              <div className="relative h-16 w-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
                {f.posterUrl
                  ? <Image src={f.posterUrl} alt={f.title} fill className="object-cover" />
                  : <Film className="absolute inset-0 m-auto h-6 w-6 text-white/20" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white truncate">{f.title}</h3>
                  {f.isFeatured && <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                </div>
                <p className="text-xs text-white/50 mt-0.5">
                  {f.platform} · {f.category} · {f.duration ?? '—'} · {f.location ?? '—'}
                </p>
                <p className="text-xs text-white/40">{f.views.toLocaleString()} views</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(f)} className="rounded-lg border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition-colors">
                  <Pencil className="h-4 w-4 text-white/70" />
                </button>
                <button onClick={() => handleDelete(f.id)} disabled={deleting === f.id}
                  className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 hover:bg-red-500/20 transition-colors">
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">{editing ? 'Edit Film' : 'New Film'}</h2>
              <button onClick={() => setShowModal(false)} className="text-white/60 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <Input label="Title *" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Thiven & Nethra – Wedding Film" />
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-primary-500 focus:outline-none resize-none"
                  placeholder="Short description..." />
              </div>
              <Input label="Video URL *" value={form.videoUrl} onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))} placeholder="https://youtube.com/watch?v=..." />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5">Platform</label>
                  <select value={form.platform} onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none">
                    {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5">Category</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none capitalize">
                    {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Poster / Thumbnail</label>
                <Input value={form.posterUrl} onChange={(e) => setForm((f) => ({ ...f, posterUrl: e.target.value }))} placeholder="Paste URL or upload" />
                <label className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/5 px-3 py-2 text-sm text-white/60 hover:border-primary-500/50 transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                  {uploading ? 'Uploading…' : 'Upload thumbnail'}
                </label>
                {form.posterUrl && (
                  <div className="mt-2 relative h-20 w-32 rounded-lg overflow-hidden border border-white/10">
                    <Image src={form.posterUrl} alt="Poster" fill className="object-cover" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Duration" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="8:45" />
                <Input label="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="Jaffna, Sri Lanka" />
              </div>
              <Input label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="wedding, outdoor, traditional" />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                  className="rounded border-white/20 bg-gray-800 text-primary-500" />
                <span className="text-sm text-white/80">Featured film (shown prominently)</span>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" className="text-white/70" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSave} isLoading={saving} disabled={!form.title || !form.videoUrl}>
                {editing ? 'Save Changes' : 'Add Film'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
