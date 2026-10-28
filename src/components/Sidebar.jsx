import React, { useState, useEffect } from 'react';
import {
  Home,
  LayoutDashboard,
  PlusCircle,
  Shield,
  ContactRound,
  History,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  role = 'admin',
  mobileOpen = false,
  setMobileOpen,
  onExpandChange
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  // Tab privileges:
  // Admin: Dashboard, Mint Asset, Role Governance, System Directory, Track Records, Settings
  // Manager: Dashboard, Mint Asset, System Directory, Track Records
  // User: Dashboard, System Directory, Track Records
  const allTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'user'] },
    { id: 'mint', label: 'Mint Asset', icon: PlusCircle, roles: ['admin', 'manager'] },
    { id: 'roles', label: 'Role Governance', icon: Shield, roles: ['admin'] },
    { id: 'directory', label: 'System Directory', icon: ContactRound, roles: ['admin', 'manager', 'user'] },
    { id: 'track-records', label: 'Track Records', icon: History, roles: ['admin', 'manager', 'user'] },
    { id: 'settings', label: 'System Settings', icon: Settings, roles: ['admin'] }
  ];

  const visibleTabs = allTabs.filter(tab => tab.roles.includes(role));
  const isExpanded = isHovered || isPinned || mobileOpen;

  useEffect(() => {
    if (onExpandChange) {
      onExpandChange(isExpanded);
    }
  }, [isExpanded, onExpandChange]);

  const togglePin = () => {
    setIsPinned(prev => !prev);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Enterprise Collapsible Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between
          bg-[#070b14]/98 border-r border-gray-800/80 backdrop-blur-2xl shadow-2xl shadow-black/80
          transition-[width,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${mobileOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isExpanded ? 'lg:w-64' : 'lg:w-[72px]'}
        `}
      >
        {/* Top: Tech Hunters Branding & Pin Toggle */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          <div className="h-20 flex items-center justify-between px-3.5 border-b border-gray-800/80 overflow-hidden sticky top-0 bg-[#070b14] z-20">
            <div className="flex items-center gap-3 min-w-[190px]">
              <div
                onClick={() => {
                  setActiveTab('dashboard');
                  if (setMobileOpen) setMobileOpen(false);
                }}
                title="Go to Internal Dashboard"
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-600/30 shrink-0 cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div
                className={`flex flex-col transition-all duration-200 ${
                  isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
                }`}
              >
                <span className="font-extrabold text-sm tracking-wider text-white uppercase whitespace-nowrap">
                  Tech Hunters
                </span>
                <span className="text-[10px] font-mono text-cyan-400 tracking-wider uppercase whitespace-nowrap">
                  Enterprise Ledger
                </span>
              </div>
            </div>

            {/* Desktop Pin / Unpin Button */}
            {isExpanded && (
              <button
                onClick={togglePin}
                title={isPinned ? "Unpin Sidebar (Collapse on mouse leave)" : "Pin Sidebar Open"}
                className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isPinned ? <PanelLeftClose className="w-4 h-4 text-cyan-400" /> : <PanelLeftOpen className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 flex flex-col gap-1.5">
            {/* Home Navigation Button: Routes to internal Dashboard view */}
            <button
              onClick={() => {
                setActiveTab('dashboard');
                if (setMobileOpen) setMobileOpen(false);
              }}
              title={!isExpanded ? "Home (Dashboard)" : undefined}
              className={`group relative flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left cursor-pointer
                ${activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <div className="shrink-0 flex items-center justify-center w-6 h-6">
                <Home className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === 'dashboard' ? 'text-white' : 'text-gray-400 group-hover:text-cyan-400'}`} />
              </div>
              <span
                className={`whitespace-nowrap transition-all duration-200 ${
                  isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'
                }`}
              >
                Home View
              </span>
              {activeTab === 'dashboard' && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-l-full" />
              )}
            </button>

            <div className="my-1.5 border-t border-gray-800/60" />

            {/* Navigation Tabs (including System Directory above Track Records) */}
            {visibleTabs.filter(t => t.id !== 'dashboard').map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (setMobileOpen) setMobileOpen(false);
                  }}
                  title={!isExpanded ? tab.label : undefined}
                  className={`group relative flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left cursor-pointer
                    ${isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <div className="shrink-0 flex items-center justify-center w-6 h-6">
                    <IconComponent
                      className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-indigo-400'
                      }`}
                    />
                  </div>
                  <span
                    className={`whitespace-nowrap transition-all duration-200 flex-1 ${
                      isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'
                    }`}
                  >
                    {tab.label}
                  </span>

                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-l-full" />
                  )}

                  {isExpanded && !isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Active Role Authority Indicator */}
        <div className="p-3 border-t border-gray-800/80 overflow-hidden bg-[#070b14]">
          <div
            className={`px-3 py-2 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center gap-2.5 transition-all duration-200 ${
              isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Active Portal</span>
              <span className="text-xs font-bold text-gray-200 capitalize truncate">{role} Authority</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
