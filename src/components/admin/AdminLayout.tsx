'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

import QueryProvider from '@/components/providers/QueryProvider';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { status } = useSession();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="animate-pulse text-lg tracking-[0.3em] text-white/50">
          Authenticating...
        </div>
      </main>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const isDark = !mounted || resolvedTheme === 'dark';

  return (
    <QueryProvider>
      <div className={`${isDark ? 'dark' : ''} relative flex min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white`}>
        <AdminSidebar />
        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto px-6 py-10 bg-transparent">
            <div className="mx-auto w-full max-w-6xl space-y-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </QueryProvider>
  );
};

export default AdminLayout;
