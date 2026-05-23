'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, PlusCircle, Trash2, X, Star } from 'lucide-react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Album { id: string; title: string; }
interface Photo {
  id: string; albumId: string; url: string; title: string | null;
  isFeatured: boolean; order: number; createdAt: string;
  album: { id: string; title: string };
}

const empty = { albumId: '', url: '', title: '', isFeatured: false, order: 0 };

export default function PhotosPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [albumFilter, setAlbumFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    const [ar, pr] = await Promise.all([fetch('/api/admin/albums'), fetch('/api/admin/photos')]);
    if (ar.ok) setAlbums(await ar.json());
    if (pr.ok) setPhotos(await pr.json());
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const fetchPhotos = async (filter: string) => {
    const url = filter ? `/api/admin/photos?albumId=${filter}` : '/api/admin/photos';
    const r = await fetch(url);
    if (r.ok) setPhotos(await r.json());
  };

  const handleFilterChange = (v: string) => { setAlbumFilter(v); fetchPhotos(v); };

  const handleUpload = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const r = await fetch('/api/upload', { method: 'POST', body: fd });
    if (r.ok) { const { url } = await r.json(); setForm((f) => ({ ...f, url })); }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.albumId || !form.url) return;
    setSaving(true);
    const r = await fetch('/api/admin/photos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (r.ok) { await fetchPhotos(albumFilter); setShowModal(false); setForm(empty); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this photo?')) return;
    setDeleting(id);
    await fetch(`/api/admin/photos/${id}`, { method: 'DELETE' });
    setPhotos((p) => p.filter((x) => x.id !== id));
    setDeleting(null);
  };

  const handleFeature = async (photo: Photo) => {
    const r = await fetch(`/api/admin/photos/${photo.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isFeatured: !photo.isFeatured }) });
    if (r.ok) setPhotos((ps) => ps.map((p) => p.id === photo.id ? { ...p, isFeatured: !photo.isFeatured } : p));
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-white">Photos</h1>
          <p className="mt-1 text-sm text-white/60">{photos.length} photos · changes are live immediately.</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={albumFilter} onChange={(e) => handleFilterChange(e.target.value)}
            className="rounded-xl border border-white/10 bg-gray-800 px-3 py-2 text-sm text-white focus:border-primary-500 focus:outline-none">
            <option value="">All albums</option>
            {albums.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
          </select>
          <Button variant="primary" className="gap-2" onClick={() => { setForm(empty); setShowModal(true); }}>
            <PlusCircle className="h-5 w-5" /> Add Photo
          </Button>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => <div key={i} className="aspect-square animate-pulse rounded-xl bg-gray-800" />)}
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 py-32 text-center">
          <Camera className="h-10 w-10 text-white/30 mb-4" />
          <p className="text-white/60">No photos yet. Add your first photo.</p>
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {photos.map((p) => (
            <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-gray-800">
              <Image src={p.url} alt={p.title ?? 'Photo'} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all" />
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleFeature(p)}
                  className={"rounded-lg p-1.5 transition-colors " + (p.isFeatured ? 'bg-amber-500 text-white' : 'bg-white/20 text-white hover:bg-amber-500')}>
                  <Star className="h-4 w-4" fill={p.isFeatured ? 'currentColor' : 'none'} />
                </button>
                <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                  className="rounded-lg bg-red-500/80 p-1.5 text-white hover:bg-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {p.isFeatured && <Star className="absolute top-2 right-2 h-3.5 w-3.5 text-amber-400 fill-amber-400" />}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="text-xs text-white/80 truncate">{p.album.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Add Photo</h2>
              <button onClick={() => setShowModal(false)} className="text-white/60 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Album *</label>
                <select value={form.albumId} onChange={(e) => setForm((f) => ({ ...f, albumId: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none">
                  <option value="">Select an album</option>
                  {albums.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Image *</label>
                <Input value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} placeholder="Paste image URL" />
                <label className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/5 px-3 py-2 text-sm text-white/60 hover:border-primary-500/50 transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                  {uploading ? 'Uploading…' : 'Upload from device'}
                </label>
                {form.url && (
                  <div className="mt-2 relative h-24 w-24 rounded-lg overflow-hidden border border-white/10">
                    <Image src={form.url} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>
              <Input label="Title (optional)" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="First Look" />
              <Input label="Display order" type="number" value={String(form.order)} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))} />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                  className="rounded border-white/20 bg-gray-800 text-primary-500" />
                <span className="text-sm text-white/80">Mark as featured</span>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" className="text-white/70" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSave} isLoading={saving} disabled={!form.albumId || !form.url}>Add Photo</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
