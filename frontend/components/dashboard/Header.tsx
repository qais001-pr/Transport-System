'use client';

import React, { useState } from 'react';
import { Bell, Search, Menu, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onMenuClick }) => {
  const [notifications] = useState(3);

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-20">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
              {subtitle && <p className="text-sm text-neutral-600 mt-0.5">{subtitle}</p>}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-xl w-64">
              <Search className="w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-neutral-900 placeholder:text-neutral-500"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
              <Bell className="w-6 h-6" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
