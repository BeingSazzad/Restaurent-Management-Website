import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAppDispatch } from '../../store/hooks';
import { syncOrdersFromStorage } from '../../store/slices/orderSlice';

export function DashboardLayout() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(syncOrdersFromStorage());
    const handleSync = () => dispatch(syncOrdersFromStorage());
    window.addEventListener('storage', handleSync);
    window.addEventListener('amber_spice_orders_updated', handleSync);
    const interval = setInterval(handleSync, 4000);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('amber_spice_orders_updated', handleSync);
      clearInterval(interval);
    };
  }, [dispatch]);

  return (
    <div className="flex h-screen bg-[#FBF9F7] text-stone-900 overflow-hidden select-none font-sans antialiased">
      {/* Standalone KDS / Staff Sidebar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar with Shift Clock, Role Switcher, Notifications & Profile */}
        <Topbar />

        {/* Scrollable Workspace Container with standard dashboard margins */}
        <main className="flex-1 overflow-y-auto">
          <div className="w-full max-w-[1750px] mx-auto px-6 sm:px-8 lg:px-10 pt-3.5 pb-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
