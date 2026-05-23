'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Phone, Instagram, MessageSquare, Globe } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface SiteSettings {
  site_name?: string;
  site_tagline?: string;
  business_phone?: string;
  business_email?: string;
  business_address?: string;
  instagram_url?: string;
  facebook_url?: string;
  whatsapp_number?: string;
  booking_open?: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (key: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setSettings((s) => ({ ...s, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    const r = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
    if (r.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    setSaving(false);
  };

  if (loading) return <div className="h-96 animate-pulse rounded-2xl bg-gray-800" />;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold text-white">Settings</h1>
          <p className="mt-1 text-sm text-white/60">Business information shown across the website.</p>
        </div>
        <Button variant="primary" className="gap-2" onClick={handleSave} isLoading={saving}>
          <Save className="h-5 w-5" /> {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 bg-gray-900 p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-primary-400" />
            <h2 className="font-semibold text-white">Site Identity</h2>
          </div>
          <Input label="Business Name" value={settings.site_name ?? ''} onChange={set('site_name')} placeholder="Cine Magic Creations" />
          <Input label="Tagline" value={settings.site_tagline ?? ''} onChange={set('site_tagline')} placeholder="Capturing Love, Stories, and Moments" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl border border-white/10 bg-gray-900 p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="h-4 w-4 text-primary-400" />
            <h2 className="font-semibold text-white">Contact Info</h2>
          </div>
          <Input label="Phone" value={settings.business_phone ?? ''} onChange={set('business_phone')} placeholder="+94 77 621 6556" />
          <Input label="Email" value={settings.business_email ?? ''} onChange={set('business_email')} placeholder="info@cinemagiccreations.com" />
          <Input label="Address / Location" value={settings.business_address ?? ''} onChange={set('business_address')} placeholder="Jaffna, Sri Lanka" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-white/10 bg-gray-900 p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Instagram className="h-4 w-4 text-primary-400" />
            <h2 className="font-semibold text-white">Social Links</h2>
          </div>
          <Input label="Instagram URL" value={settings.instagram_url ?? ''} onChange={set('instagram_url')} placeholder="https://instagram.com/cine_magic_creations" />
          <Input label="Facebook URL" value={settings.facebook_url ?? ''} onChange={set('facebook_url')} placeholder="https://facebook.com/..." />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border border-white/10 bg-gray-900 p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-primary-400" />
            <h2 className="font-semibold text-white">WhatsApp & Bookings</h2>
          </div>
          <Input label="WhatsApp Number (digits only)" value={settings.whatsapp_number ?? ''} onChange={set('whatsapp_number')} placeholder="94776216556" />
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={"relative h-6 w-11 rounded-full transition-colors " + (settings.booking_open ? 'bg-primary-500' : 'bg-gray-700')}
              onClick={() => setSettings((s) => ({ ...s, booking_open: !s.booking_open }))}>
              <span className={"absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform " + (settings.booking_open ? 'translate-x-5' : '')} />
            </div>
            <span className="text-sm text-white/80">Bookings open</span>
          </label>
          {settings.booking_open === false && (
            <p className="text-xs text-amber-400/80 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
              When disabled, the booking form shows a &quot;Currently unavailable&quot; message.
            </p>
          )}
        </motion.div>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" className="gap-2 px-8" onClick={handleSave} isLoading={saving}>
          <Save className="h-5 w-5" /> {saved ? '✓ Saved!' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
}
