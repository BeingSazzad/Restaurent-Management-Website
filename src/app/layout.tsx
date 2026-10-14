import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { ReduxProvider } from '../redux/ReduxProvider';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/shared/CartDrawer';
import { CheckoutModal } from '../components/shared/CheckoutModal';
import { OrderTrackerModal } from '../components/shared/OrderTrackerModal';
import { MobileStickyBar } from '../components/layout/MobileStickyBar';

export const metadata: Metadata = {
  title: 'AMBER SPICE | Authentic Flavors · Timeless Recipes',
  description:
    'Discover the real taste of authentic heritage cuisine, royal chicken biryani, slow-braised curries, and tandoori grills.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,600;1,700&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#B84A22" />
      </head>
      <body className="bg-[#FAF6EF] text-[#2C221C] min-h-screen flex flex-col font-sans antialiased">
        <ReduxProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />

          {/* Interactive Modals & Slide-overs */}
          <CartDrawer />
          <CheckoutModal />
          <OrderTrackerModal />
          <MobileStickyBar />
        </ReduxProvider>
      </body>
    </html>
  );
}
