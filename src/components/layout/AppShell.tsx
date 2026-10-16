'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from '../shared/CartDrawer';
import { CheckoutModal } from '../shared/CheckoutModal';
import { OrderTrackerModal } from '../shared/OrderTrackerModal';
import { MobileStickyBar } from './MobileStickyBar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStaffPortal = pathname?.startsWith('/agent-dashboard');
  const isUserDashboard = pathname?.startsWith('/user-dashboard');

  if (isStaffPortal) {
    // Dedicated Staff/KDS Portal: Completely standalone, NO website navbar, NO footer, NO customer drawers
    return <main className="flex-1 min-h-screen">{children}</main>;
  }

  if (isUserDashboard) {
    // Customer Dashboard: Has Navbar for navigation, but NO website footer
    return (
      <>
        <Navbar />
        <main className="flex-1">{children}</main>
        <CartDrawer />
        <CheckoutModal />
        <OrderTrackerModal />
        <MobileStickyBar />
      </>
    );
  }

  // Public Marketing Website: Full Experience with Navbar and Footer
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackerModal />
      <MobileStickyBar />
    </>
  );
}
