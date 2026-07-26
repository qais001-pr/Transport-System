'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Car,
  MapPin,
  Bell,
  Settings,
  LogOut,
  Bus,
  Calendar,
  MessageSquare,
  FileText,
  Shield,
  UserCheck,
  Route,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';

interface SidebarProps {
  userRole: 'parent' | 'driver' | 'admin' | 'guard';
  userName: string;
  userEmail: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ userRole, userName, userEmail }) => {
  const pathname = usePathname();

  const navigationByRole = {
    parent: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/parent' },
      { icon: Users, label: 'My Children', href: '/dashboard/parent/children' },
      { icon: Car, label: 'Find Vans', href: '/dashboard/parent/vans' },
      { icon: MapPin, label: 'Track Van', href: '/dashboard/parent/track' },
      { icon: Calendar, label: 'Bookings', href: '/dashboard/parent/bookings' },
      { icon: DollarSign, label: 'Payments', href: '/dashboard/parent/payments' },
      { icon: MessageSquare, label: 'Messages', href: '/dashboard/parent/messages' },
      { icon: FileText, label: 'Feedback', href: '/dashboard/parent/feedback' },
    ],
    driver: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/driver' },
      { icon: Route, label: 'My Routes', href: '/dashboard/driver/routes' },
      { icon: Users, label: 'Students', href: '/dashboard/driver/students' },
      { icon: Calendar, label: 'Schedule', href: '/dashboard/driver/schedule' },
      { icon: MapPin, label: 'Live Tracking', href: '/dashboard/driver/tracking' },
      { icon: Bell, label: 'Delays', href: '/dashboard/driver/delays' },
      { icon: DollarSign, label: 'Earnings', href: '/dashboard/driver/earnings' },
      { icon: MessageSquare, label: 'Messages', href: '/dashboard/driver/messages' },
    ],
    admin: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/admin' },
      { icon: Users, label: 'Users', href: '/dashboard/admin/users' },
      { icon: Car, label: 'Drivers', href: '/dashboard/admin/drivers' },
      { icon: Shield, label: 'Verifications', href: '/dashboard/admin/verifications' },
      { icon: Bus, label: 'Vans', href: '/dashboard/admin/vans' },
      { icon: Route, label: 'Routes', href: '/dashboard/admin/routes' },
      { icon: MessageSquare, label: 'Complaints', href: '/dashboard/admin/complaints' },
      { icon: FileText, label: 'Reports', href: '/dashboard/admin/reports' },
    ],
    guard: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/guard' },
      { icon: Car, label: 'Active Vans', href: '/dashboard/guard/vans' },
      { icon: Users, label: 'Students', href: '/dashboard/guard/students' },
      { icon: UserCheck, label: 'Verification', href: '/dashboard/guard/verification' },
      { icon: Calendar, label: 'Schedule', href: '/dashboard/guard/schedule' },
      { icon: Bell, label: 'Alerts', href: '/dashboard/guard/alerts' },
      { icon: FileText, label: 'Reports', href: '/dashboard/guard/reports' },
    ],
  };

  const navigation = navigationByRole[userRole];

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col h-screen fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="p-6 border-b border-neutral-200">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
            <Bus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary leading-tight">Van Pooling</h1>
            <p className="text-xs text-neutral-600 capitalize">{userRole} Portal</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 scrollbar-hide">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                    isActive
                      ? 'bg-primary text-white shadow-soft'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  )}
                >
                  <item.icon
                    className={cn(
                      'w-5 h-5 transition-transform duration-200 group-hover:scale-110',
                      isActive ? 'text-white' : 'text-neutral-500'
                    )}
                  />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-center gap-3 mb-3">
          <Avatar name={userName} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-900 truncate">{userName}</p>
            <p className="text-xs text-neutral-600 truncate">{userEmail}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/settings"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-accent hover:bg-accent-50 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
