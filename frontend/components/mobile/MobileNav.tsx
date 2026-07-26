'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MapPin, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  userRole: 'parent' | 'driver' | 'admin' | 'guard';
}

export const MobileNav: React.FC<MobileNavProps> = ({ userRole }) => {
  const pathname = usePathname();

  const navigationByRole = {
    parent: [
      { icon: LayoutDashboard, label: 'Home', href: '/dashboard/parent' },
      { icon: MapPin, label: 'Track', href: '/dashboard/parent/track' },
      { icon: Users, label: 'Children', href: '/dashboard/parent/children' },
      { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ],
    driver: [
      { icon: LayoutDashboard, label: 'Home', href: '/dashboard/driver' },
      { icon: MapPin, label: 'Navigate', href: '/dashboard/driver/tracking' },
      { icon: Users, label: 'Students', href: '/dashboard/driver/students' },
      { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ],
    admin: [
      { icon: LayoutDashboard, label: 'Home', href: '/dashboard/admin' },
      { icon: Users, label: 'Users', href: '/dashboard/admin/users' },
      { icon: MapPin, label: 'Routes', href: '/dashboard/admin/routes' },
      { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ],
    guard: [
      { icon: LayoutDashboard, label: 'Home', href: '/dashboard/guard' },
      { icon: MapPin, label: 'Vans', href: '/dashboard/guard/vans' },
      { icon: Users, label: 'Students', href: '/dashboard/guard/students' },
      { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ],
  };

  const navigation = navigationByRole[userRole];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50 safe-area-bottom">
      <div className="grid grid-cols-4 h-16">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 transition-colors',
                isActive ? 'text-primary' : 'text-neutral-600'
              )}
            >
              <item.icon className={cn('w-6 h-6', isActive && 'scale-110')} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
