import { SidebarNavigation } from './SidebarNavigation';
import { SidebarProfile } from './SidebarProfile';
import { SidebarLogout } from './SidebarLogout';

export function Sidebar() {
  return (
    <div className="flex flex-col h-full pt-8 pb-10 bg-chat-sidebar rounded-3xl items-center justify-between">
      <div className="flex flex-col items-center gap-20 w-25">
        <SidebarProfile />
        <SidebarNavigation />
      </div>

      <SidebarLogout />
    </div>
  );
}
