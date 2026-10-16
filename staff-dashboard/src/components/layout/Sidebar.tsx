import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ChefHat,
  LayoutDashboard,
  PackageX,
  BarChart3,
  Users,
  LogOut,
  Flame,
  ChevronRight,
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { RESTAURANT_BRAND } from '../../lib/constants';

export function Sidebar() {
  const { user, logout } = useAuth();

  const navigationItems = [
    {
      name: 'Kitchen Orders',
      path: ROUTES.DASHBOARD.KDS,
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      name: '86 Inventory',
      path: ROUTES.DASHBOARD.STOCK_86,
      icon: PackageX,
    },
    {
      name: 'Shift Report',
      path: ROUTES.DASHBOARD.ANALYTICS,
      icon: BarChart3,
    },
    {
      name: 'Staff & Roles',
      path: ROUTES.DASHBOARD.USERS,
      icon: Users,
    },
  ];

  return (
    <aside className="w-64 bg-[#140F0C] text-white flex flex-col justify-between shrink-0 min-h-screen border-r border-stone-800/90 relative overflow-hidden select-none">
      {/* Ambient Illustration Overlay */}
      <div
        className="absolute inset-0 pointer-events-none bg-bottom bg-no-repeat bg-cover opacity-25 mix-blend-screen"
        style={{ backgroundImage: `url('/sidebar-overlay.jpg')` }}
      />
      {/* Subtle Vignette Gradient */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#140F0C]/90 via-transparent to-[#140F0C]/40" />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Brand */}
        <div className="h-16 px-5 border-b border-stone-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9.5 h-9.5 rounded-xl bg-[#F15A24] flex items-center justify-center font-bold shadow-md shadow-[#F15A24]/20 text-white">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-[15px] tracking-tight leading-tight text-white">
                {RESTAURANT_BRAND.name}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[11px] text-stone-400 font-medium">Staff Portal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3.5 space-y-1.5">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-3 rounded-xl text-[14px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#F15A24] text-white font-semibold shadow-md shadow-[#F15A24]/25'
                    : 'text-stone-300 hover:text-white hover:bg-white/8'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4.5 h-4.5 shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.badge ? (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold tracking-wide">
                  {item.badge}
                </span>
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-stone-500/70" />
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Staff User Card */}
      <div className="p-3.5 border-t border-stone-800/80 relative z-10">
        <div className="p-3 rounded-xl bg-stone-900/90 border border-stone-800/80 backdrop-blur-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center text-xs font-bold text-[#FFA940]">
              <Flame className="w-4 h-4 text-[#F15A24]" />
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-white truncate">{user?.name || 'Chef on Duty'}</p>
              <p className="text-[11px] text-stone-400 capitalize">{user?.role || 'Staff'} · Active Shift</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out Staff Console"
            className="text-stone-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
