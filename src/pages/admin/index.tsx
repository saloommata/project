
import { useState } from 'react';
import {
  LayoutDashboard,
  Coffee,
  FolderTree,
  Star,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  X,
  ExternalLink,
} from 'lucide-react';

import DashboardTab from './DashboardTab';
import MenuItemsTab from './MenuItemsTab';
import MenuCategoriesTab from './MenuCategoriesTab';
import TestimonialsTab from './TestimonialsTab';
import SettingsTab from './SettingsTab';

type AdminTab =
  | 'dashboard'
  | 'menu-items'
  | 'categories'
  | 'testimonials'
  | 'settings';

const NAV_ITEMS: Array<{
  id: AdminTab;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'menu-items', label: 'Menu Items', icon: Coffee },
  { id: 'categories', label: 'Categories', icon: FolderTree },
  { id: 'testimonials', label: 'Testimonials', icon: Star },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeLabel =
    NAV_ITEMS.find(n => n.id === activeTab)?.label ?? '';

  return (
    <div className="min-h-screen bg-[#F6F2EA] flex">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-secondary text-[#EFE9DD] min-h-screen sticky top-0">
        <SidebarContent
          activeTab={activeTab}
          onSelect={setActiveTab}
        />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />

          <aside className="relative w-64 bg-secondary text-[#EFE9DD] min-h-screen flex flex-col">
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-4 text-[#EFE9DD]/60"
            >
              <X size={20} />
            </button>

            <SidebarContent
              activeTab={activeTab}
              onSelect={(tab) => {
                setActiveTab(tab);
                setSidebarOpen(false);
              }}
            />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">

        <header className="lg:hidden sticky top-0 z-30 bg-[#F6F2EA]/95 backdrop-blur-sm border-b border-border/70 flex items-center justify-between px-4 h-16">
          <img
            src="/logo/ryvano-lockup-ink.svg"
            alt="Ryvano"
            className="h-7 w-auto"
          />

          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="text-secondary p-1"
          >
            <MenuIcon size={22} />
          </button>
        </header>

        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">

          <div className="mb-8">
            <h1 className="font-display text-3xl font-semibold text-secondary">
              {activeLabel}
            </h1>
          </div>

          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'menu-items' && <MenuItemsTab />}
          {activeTab === 'categories' && <MenuCategoriesTab />}
          {activeTab === 'testimonials' && <TestimonialsTab />}
          {activeTab === 'settings' && <SettingsTab />}

        </div>
      </div>
    </div>
  );
}

function SidebarContent({
  activeTab,
  onSelect,
}: {
  activeTab: AdminTab;
  onSelect: (tab: AdminTab) => void;
}) {
  return (
    <>
      <div className="px-6 pt-7 pb-6">
        <img
          src="/logo/ryvano-lockup-reversed.svg"
          alt="Ryvano"
          className="h-8 w-auto"
        />
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#B1793A] text-[#2B1C12]'
                  : 'text-[#EFE9DD]/65 hover:bg-white/5 hover:text-[#EFE9DD]'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <a
          href="/"
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#EFE9DD]/65 hover:bg-white/5 hover:text-[#EFE9DD] transition-colors"
        >
          <ExternalLink size={18} />
          View Site
        </a>
      </div>
    </>
  );
}
