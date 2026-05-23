'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Images, PlusCircle, Pencil, Trash2, X, Star, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Album {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  location: string | null;
  category: string;
  isFeatured: boolean;
  isPublic: boolean;
  _count: { photos: number };
  createdAt: string;
}

const CATEGORIES = ['wedding', 'engagement', 'graduation', 'portrait', 'event'];

const empty = { title: '', description: '', coverImage: '', location: '', category: 'wedding', isFeatured: false, isPublic: true };

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Album | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  const fetchAlbums = async () => {
    setLoading(true);
    const r = await fetch('/api/admin/albums');
    if (r.ok) setAlbums(await r.json());
    setLoading(false);
  };

  useEffect(() => { fetchAlbums(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit = (a: Album) => {
    setEditing(a);
    setForm({ title: a.title, description: a.description ?? '', coverImage: a.coverImage ?? '', location: a.location ?? '', category: a.category, isFeatured: a.isFeatured, isPublic: a.isPublic });
    setShowModal(true);
  };

  const handleUpload = async (file: File) => {
    setUploadingCover(true);
    const fd = new FormData();
    fd.append('file', file);
    const r = await fetch('/api/upload', { method: 'POST', body: fd });
    if (r.ok) {
      const { url } = await r.json();
      setForm((f) => ({ ...f, coverImage: url }));
    }
    setUploadingCover(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const url = editing ? `/api/admin/albums/${editing.id}` : '/api/admin/albums';
    const method = editing ? 'PUT' : 'POST';
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (r.ok) { await fetchAlbums(); setShowModal(false); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this album and all its photos?')) return;
    setDeleting(id);
    await fetch(`/api/admin/albums/${id}`, { method: 'DELETE' });
    setAlbums((a) => a.filter((x) => x.id !== id));
    setDeleting(null);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold text-white">Albums</h1>
          <p className="mt-1 text-sm text-white/60">Manage photo albums — changes are live immediately.</p>
        </div>
        <Button variant="primary" className="gap-2" onClick={openCreate}>
          <PlusCircle className="h-5 w-5" /> New Album
        </Button>
      </motion.div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-52 animate-pulse rounded-2xl bg-gray-800" />)}
        </div>
      ) : albums.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 py-32 text-center">
          <Images className="h-10 w-10 text-white/30 mb-4" />
          <p className="text-white/60">No albums yet. Create your first album.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((a) => (
            <motion.div key={a.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900">
              <div className="relative h-44 bg-gray-800">
                {a.coverImage ? (
                  <Image src={a.coverImage} alt={a.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center"><Images className="h-10 w-10 text-white/20" /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <span className="rounded-full bg-black/60 px-2 py-0.5 text-xs text-white/70 capitalize">{a.category}</span>
                  <span className="rounded-full bg-black/60 px-2 py-0.5 text-xs text-white/70">{a._count.photos} photos</span>
                </div>
                {a.isFeatured && <Star className="absolute top-3 right-3 h-4 w-4 text-amber-400 fill-amber-400" />}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white truncate">{a.title}</h3>
                    {a.location && <p className="text-xs text-white/50 mt-0.5">{a.location}</p>}
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <button onClick={() => openEdit(a)} className="rounded-lg border border-white/10 bg-white/5 p-1.5 hover:bg-white/10 transition-colors">
                      <Pencil className="h-3.5 w-3.5 text-white/70" />
                    </button>
                    <button onClick={() => handleDelete(a.id)} disabled={deleting === a.id}
                      className="rounded-lg border border-red-500/20 bg-red-500/10 p-1.5 hover:bg-red-500/20 transition-colors">
                      <Trash2 className="h-3.5 w-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  {a.isPublic ? <span className="flex items-center gap-1 text-xs text-green-400"><Eye className="h-3 w-3" />Public</span>
                    : <span className="flex items-center gap-1 text-xs text-white/40"><EyeOff className="h-3 w-3" />Hidden</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">{editing ? 'Edit Album' : 'New Album'}</h2>
              <button onClick={() => setShowModal(false)} className="text-white/60 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <Input label="Title *" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Romantic Wedding – Jaffna" />
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-primary-500 focus:outline-none resize-none"
                  placeholder="Brief description of this album..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Cover Image</label>
                <div className="flex gap-2">
                  <Input value={form.coverImage} onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                    placeholder="Paste URL or upload below" className="flex-1" />
                </div>
                <div className="mt-2">
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/5 px-3 py-2 text-sm text-white/60 hover:border-primary-500/50 hover:text-white/80 transition-colors">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                    {uploadingCover ? 'Uploading…' : 'Upload from device'}
                  </label>
                </div>
                {form.coverImage && (
                  <div className="mt-2 relative h-24 w-24 rounded-lg overflow-hidden border border-white/10">
                    <Image src={form.coverImage} alt="Cover preview" fill className="object-cover" />
                  </div>
                )}
              </div>
              <Input label="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="Jaffna, Sri Lanka" />
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Category</label>
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none capitalize">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                    className="rounded border-white/20 bg-gray-800 text-primary-500 focus:ring-primary-500" />
                  <span className="text-sm text-white/80">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isPublic} onChange={(e) => setForm((f) => ({ ...f, isPublic: e.target.checked }))}
                    className="rounded border-white/20 bg-gray-800 text-primary-500 focus:ring-primary-500" />
                  <span className="text-sm text-white/80">Public (visible on site)</span>
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" className="text-white/70" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSave} isLoading={saving} disabled={!form.title}>
                {editing ? 'Save Changes' : 'Create Album'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
