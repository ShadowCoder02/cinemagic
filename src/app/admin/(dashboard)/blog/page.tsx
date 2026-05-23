'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, PlusCircle, Pencil, Trash2, X, Globe, Lock } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface BlogPost {
  id: string; title: string; slug: string; excerpt: string | null;
  content: string; featuredImage: string | null; category: string | null;
  author: string | null; readTime: number | null; status: 'DRAFT' | 'PUBLISHED';
  publishedAt: string | null; views: number; tags: string[];
}

const CATS = ['Wedding Tips', 'Photography', 'Behind the Scenes', 'Love Stories', 'Graduation', 'Events'];
const empty = { title: '', excerpt: '', content: '', featuredImage: '', category: 'Wedding Tips', author: 'Keerththikan', readTime: 5, tags: '', status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' };

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    const r = await fetch('/api/admin/blog');
    if (r.ok) setPosts(await r.json());
    setLoading(false);
  };
  useEffect(() => { fetchPosts(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit = (p: BlogPost) => {
    setEditing(p);
    setForm({ title: p.title, excerpt: p.excerpt ?? '', content: p.content, featuredImage: p.featuredImage ?? '', category: p.category ?? 'Wedding Tips', author: p.author ?? 'Keerththikan', readTime: p.readTime ?? 5, tags: (p.tags ?? []).join(', '), status: p.status });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean), readTime: Number(form.readTime) };
    const url = editing ? `/api/admin/blog/${editing.id}` : '/api/admin/blog';
    const method = editing ? 'PUT' : 'POST';
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (r.ok) { await fetchPosts(); setShowModal(false); }
    setSaving(false);
  };

  const togglePublish = async (p: BlogPost) => {
    const status = p.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    const r = await fetch(`/api/admin/blog/${p.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    if (r.ok) setPosts((ps) => ps.map((x) => x.id === p.id ? { ...x, status, publishedAt: status === 'PUBLISHED' ? new Date().toISOString() : null } : x));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    setDeleting(id);
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    setPosts((p) => p.filter((x) => x.id !== id));
    setDeleting(null);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold text-white">Blog</h1>
          <p className="mt-1 text-sm text-white/60">Write and publish posts — published posts appear on the website.</p>
        </div>
        <Button variant="primary" className="gap-2" onClick={openCreate}><PlusCircle className="h-5 w-5" /> New Post</Button>
      </motion.div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-800" />)}</div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 py-32 text-center">
          <FileText className="h-10 w-10 text-white/30 mb-4" />
          <p className="text-white/60">No posts yet. Write your first blog post.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-gray-900 p-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-white truncate">{p.title}</h3>
                  <span className={"rounded-full px-2 py-0.5 text-xs font-medium " + (p.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/50')}>
                    {p.status}
                  </span>
                </div>
                <p className="text-xs text-white/50 mt-0.5">
                  {p.category} · {p.author} · {p.readTime ?? '—'} min read · {p.views} views
                  {p.publishedAt && ` · ${new Date(p.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => togglePublish(p)} title={p.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                  className={"rounded-lg border p-2 transition-colors " + (p.status === 'PUBLISHED' ? 'border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'border-white/10 bg-white/5 text-white/50 hover:text-white hover:bg-white/10')}>
                  {p.status === 'PUBLISHED' ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                </button>
                <button onClick={() => openEdit(p)} className="rounded-lg border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition-colors">
                  <Pencil className="h-4 w-4 text-white/70" />
                </button>
                <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
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
            className="w-full max-w-2xl rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">{editing ? 'Edit Post' : 'New Post'}</h2>
              <button onClick={() => setShowModal(false)} className="text-white/60 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <Input label="Title *" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="10 Tips for Perfect Wedding Photography" />
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Excerpt</label>
                <textarea rows={2} value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-primary-500 focus:outline-none resize-none"
                  placeholder="A short summary shown in post listings..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Content * (Markdown supported)</label>
                <textarea rows={10} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-primary-500 focus:outline-none resize-y font-mono"
                  placeholder="## Introduction&#10;&#10;Write your blog post here..." />
              </div>
              <Input label="Featured Image URL" value={form.featuredImage} onChange={(e) => setForm((f) => ({ ...f, featuredImage: e.target.value }))} placeholder="https://... or /images/..." />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5">Category</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none">
                    {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5">Status</label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'DRAFT' | 'PUBLISHED' }))}
                    className="w-full rounded-xl border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none">
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Author" value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} placeholder="Keerththikan" />
                <Input label="Read time (min)" type="number" value={String(form.readTime)} onChange={(e) => setForm((f) => ({ ...f, readTime: Number(e.target.value) }))} />
              </div>
              <Input label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="wedding, photography, tips" />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" className="text-white/70" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSave} isLoading={saving} disabled={!form.title || !form.content}>
                {editing ? 'Save Changes' : form.status === 'PUBLISHED' ? 'Publish Post' : 'Save Draft'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
