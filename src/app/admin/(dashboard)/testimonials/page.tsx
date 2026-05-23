'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, PlusCircle, Pencil, Trash2, X, Star } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Testimonial {
  id: string; clientName: string; eventType: string | null; quote: string;
  rating: number; avatarUrl: string | null; location: string | null; isFeatured: boolean;
}

const EVENT_TYPES = ['Wedding Photography', 'Wedding Film', 'Engagement Session', 'Graduation Photography', 'Portrait Session', 'Event'];
const empty = { clientName: '', eventType: 'Wedding Photography', quote: '', rating: 5, avatarUrl: '', location: '', isFeatured: true };

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchT = async () => {
    setLoading(true);
    const r = await fetch('/api/admin/testimonials');
    if (r.ok) setTestimonials(await r.json());
    setLoading(false);
  };
  useEffect(() => { fetchT(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ clientName: t.clientName, eventType: t.eventType ?? 'Wedding Photography', quote: t.quote, rating: t.rating, avatarUrl: t.avatarUrl ?? '', location: t.location ?? '', isFeatured: t.isFeatured });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const url = editing ? `/api/admin/testimonials/${editing.id}` : '/api/admin/testimonials';
    const method = editing ? 'PUT' : 'POST';
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, rating: Number(form.rating) }) });
    if (r.ok) { await fetchT(); setShowModal(false); }
    setSaving(false);
  };

  const toggleFeatured = async (t: Testimonial) => {
    const r = await fetch(`/api/admin/testimonials/${t.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isFeatured: !t.isFeatured }) });
    if (r.ok) setTestimonials((ts) => ts.map((x) => x.id === t.id ? { ...x, isFeatured: !t.isFeatured } : x));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    setDeleting(id);
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
    setTestimonials((t) => t.filter((x) => x.id !== id));
    setDeleting(null);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold text-white">Testimonials</h1>
          <p className="mt-1 text-sm text-white/60">Featured testimonials appear on the homepage and about page.</p>
        </div>
        <Button variant="primary" className="gap-2" onClick={openCreate}><PlusCircle className="h-5 w-5" /> Add Testimonial</Button>
      </motion.div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-800" />)}</div>
      ) : testimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 py-32 text-center">
          <Users className="h-10 w-10 text-white/30 mb-4" />
          <p className="text-white/60">No testimonials yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {testimonials.map((t) => (
            <motion.div key={t.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={"rounded-2xl border p-5 " + (t.isFeatured ? 'border-primary-500/30 bg-primary-500/5' : 'border-white/10 bg-gray-900')}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex gap-0.5 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={"h-3.5 w-3.5 " + (i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-white/20')} />
                    ))}
                  </div>
                  <p className="font-semibold text-white">{t.clientName}</p>
                  <p className="text-xs text-white/50">{t.eventType}{t.location && ` · ${t.location}`}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => toggleFeatured(t)} title={t.isFeatured ? 'Unfeature' : 'Feature on site'}
                    className={"rounded-lg p-1.5 transition-colors " + (t.isFeatured ? 'bg-primary-500/20 text-primary-400' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10')}>
                    <Star className="h-3.5 w-3.5" fill={t.isFeatured ? 'currentColor' : 'none'} />
                  </button>
                  <button onClick={() => openEdit(t)} className="rounded-lg border border-white/10 bg-white/5 p-1.5 hover:bg-white/10 transition-colors">
                    <Pencil className="h-3.5 w-3.5 text-white/70" />
                  </button>
                  <button onClick={() => handleDelete(t.id)} disabled={deleting === t.id}
                    className="rounded-lg border border-red-500/20 bg-red-500/10 p-1.5 hover:bg-red-500/20 transition-colors">
                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-white/80 leading-relaxed line-clamp-3">&ldquo;{t.quote}&rdquo;</p>
            </motion.div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => setShowModal(false)} className="text-white/60 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <Input label="Client Name *" value={form.clientName} onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))} placeholder="Thiven & Nethra" />
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Event Type</label>
                <select value={form.eventType} onChange={(e) => setForm((f) => ({ ...f, eventType: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none">
                  {EVENT_TYPES.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Quote *</label>
                <textarea rows={4} value={form.quote} onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-primary-500 focus:outline-none resize-none"
                  placeholder="What the client said about their experience..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5">Rating (1–5)</label>
                  <select value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none">
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{'★'.repeat(n)}</option>)}
                  </select>
                </div>
                <Input label="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="Jaffna, Sri Lanka" />
              </div>
              <Input label="Avatar URL (optional)" value={form.avatarUrl} onChange={(e) => setForm((f) => ({ ...f, avatarUrl: e.target.value }))} placeholder="https://..." />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                  className="rounded border-white/20 bg-gray-800 text-primary-500" />
                <span className="text-sm text-white/80">Show on homepage & about page</span>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" className="text-white/70" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSave} isLoading={saving} disabled={!form.clientName || !form.quote}>
                {editing ? 'Save Changes' : 'Add Testimonial'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
