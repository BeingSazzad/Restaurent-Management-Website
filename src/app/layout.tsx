import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { ReduxProvider } from '../redux/ReduxProvider';
import { AppShell } from '../components/layout/AppShell';

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
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#B84A22" />
      </head>
      <body className="bg-[rgb(249,249,249)] text-[#2C221C] min-h-screen flex flex-col font-sans antialiased">
        <ReduxProvider>
          <AppShell>{children}</AppShell>
        </ReduxProvider>
      </body>
    </html>
  );
}
