'use client';

import { cn } from '@/shared/lib/class-merge';
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
          'fixed z-50 flex flex-col w-20 py-6 px-2 items-center justify-between bg-chat-sidebar shadow-2xl rounded-3xl transition-transform duration-300 ease-in-out',
          'top-2 bottom-2 left-2 md:top-4 md:bottom-4 md:left-4',
          'lg:static lg:top-auto lg:bottom-auto lg:left-auto lg:z-auto lg:h-full lg:shadow-none lg:translate-x-0 lg:shrink-0',
          isOpen ? 'translate-x-0' : 'translate-x-[-150%] lg:translate-x-0',
        )}
      >
        <div className="flex flex-col items-center gap-8 w-full">
          <SidebarProfile />
          <SidebarNavigation />
        </div>

        <SidebarLogout />
      </aside>
    </>
  );
}
