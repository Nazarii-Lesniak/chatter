'use client';

import { X } from 'lucide-react';
import { cn } from '@/shared/lib/class-merge';
import { Button } from '@/shared/ui/button/Button';
import { SidebarLogout } from './SidebarLogout';
import { SidebarNavigation } from './SidebarNavigation';
import { SidebarProfile } from './SidebarProfile';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          role="presentation"
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside
        aria-label="Sidebar"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col h-full w-20 py-6 px-2 items-center justify-between bg-chat-sidebar shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:h-full lg:w-20 lg:py-6 lg:px-2 lg:rounded-3xl lg:shadow-none lg:translate-x-0 lg:shrink-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex flex-col items-center gap-6 w-full">
          <Button
            variant="sidebar"
            aria-label="Close sidebar"
            onClick={onClose}
            className="lg:hidden hover:text-chat-text-white"
          >
            <X aria-hidden="true" />
          </Button>

          <SidebarProfile />
          <SidebarNavigation />
        </div>

        <SidebarLogout />
      </aside>
    </>
  );
}
