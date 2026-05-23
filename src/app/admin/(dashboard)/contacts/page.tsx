'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Calendar, MessageCircle, CheckCircle, Clock, Archive, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  eventType: string;
  eventDate: string | null;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'ARCHIVED';
  createdAt: string;
}

const statusConfig = {
  NEW: { label: 'New', icon: MessageCircle, color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
  IN_PROGRESS: { label: 'In Progress', icon: Clock, color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' },
  ARCHIVED: { label: 'Archived', icon: Archive, color: 'text-white/40 bg-white/5 border-white/10' },
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const url = filter ? `/api/admin/contacts?status=${filter}` : '/api/admin/contacts';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setContacts(data.contacts);
      setTotal(data.total);
    } catch {
      // keep previous state on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error('Failed to update');
      await fetchContacts();
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-semibold text-white">Contact Requests</h1>
          <p className="mt-1 text-sm text-white/60">{total} total enquiries</p>
        </div>
        <Button
          variant="ghost"
          className="gap-2 border border-white/10 bg-white/5 text-white self-start sm:self-auto"
          onClick={fetchContacts}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[{ value: '', label: 'All' }, { value: 'NEW', label: 'New' }, { value: 'IN_PROGRESS', label: 'In Progress' }, { value: 'ARCHIVED', label: 'Archived' }].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === tab.value
                ? 'bg-primary-500 text-white'
                : 'border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contact List */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-white/50">
          <RefreshCw className="mr-3 h-5 w-5 animate-spin" />
          Loading…
        </div>
      ) : contacts.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 py-24 text-center text-white/50">
          <MessageCircle className="mx-auto mb-4 h-12 w-12 opacity-30" />
          <p>No contact requests found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact, index) => {
            const cfg = statusConfig[contact.status];
            const StatusIcon = cfg.icon;
            return (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-primary-500/40 hover:bg-white/[0.07]"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  {/* Info */}
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{contact.name}</h3>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/60">
                        {contact.eventType}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-white/60">
                      <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 hover:text-primary-400 transition-colors">
                        <Mail className="h-4 w-4" />
                        {contact.email}
                      </a>
                      {contact.phone && (
                        <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 hover:text-primary-400 transition-colors">
                          <Phone className="h-4 w-4" />
                          {contact.phone}
                        </a>
                      )}
                      {contact.eventDate && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {new Date(contact.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-white/80 leading-relaxed">{contact.message}</p>

                    <p className="text-xs text-white/40">{formatDate(contact.createdAt)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
                    {contact.status !== 'IN_PROGRESS' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1.5 border border-amber-400/30 text-amber-400 hover:bg-amber-400/10 text-xs"
                        onClick={() => updateStatus(contact.id, 'IN_PROGRESS')}
                        disabled={updating === contact.id}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        Mark In Progress
                      </Button>
                    )}
                    {contact.status !== 'ARCHIVED' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1.5 border border-white/10 text-white/50 hover:bg-white/10 text-xs"
                        onClick={() => updateStatus(contact.id, 'ARCHIVED')}
                        disabled={updating === contact.id}
                      >
                        <Archive className="h-3.5 w-3.5" />
                        Archive
                      </Button>
                    )}
                    {contact.status === 'ARCHIVED' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1.5 border border-blue-400/30 text-blue-400 hover:bg-blue-400/10 text-xs"
                        onClick={() => updateStatus(contact.id, 'NEW')}
                        disabled={updating === contact.id}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Restore
                      </Button>
                    )}
                    <a
                      href={`mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.eventType)} Enquiry`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-primary-500/40 bg-primary-500/10 px-3 py-1.5 text-xs font-medium text-primary-400 transition-colors hover:bg-primary-500/20"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Reply by Email
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
