import { SidebarLogout } from './SidebarLogout';
import { SidebarNavigation } from './SidebarNavigation';
import { SidebarProfile } from './SidebarProfile';

export function Sidebar() {
  return (
    <aside className="hidden md:hidden lg:flex lg:flex-col lg:h-full lg:w-20 lg:py-6 lg:px-2 lg:rounded-3xl lg:items-center lg:justify-between lg:shrink-0 bg-chat-sidebar ">
      <div className="lg:flex lg:flex-col lg:items-center lg:gap-8 lg:w-full">
        <SidebarProfile />
        <SidebarNavigation />
      </div>

      <SidebarLogout />
    </aside>
  );
}
