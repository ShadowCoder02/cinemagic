'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { adminNavItems } from '@/lib/admin-nav';

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="relative hidden w-64 flex-shrink-0 flex-col border-r border-white/10 bg-black pb-10 lg:flex">
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
          <span className="text-sm font-bold text-white">C</span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Cine Magic</p>
          <p className="text-sm font-semibold text-white leading-tight">Admin Hub</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-4 flex-1 space-y-0.5 px-3">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                  : 'text-white/75 hover:bg-white/8 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 text-xs text-white/50">
        Cinematic control panel
      </div>
    </aside>
  );
};

export default AdminSidebar;
