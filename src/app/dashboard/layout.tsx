"use client";

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Navigation, { navigationItems } from '@/components/dashboard/Navigation';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType;
  color: string;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-dark">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark to-dark-lighter opacity-50" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Content Wrapper */}
      <div className="relative min-h-screen">
        {/* Header Area */}
        <header className="fixed top-0 inset-x-0 h-20 z-40">
          <div className="absolute inset-0 bg-gradient-to-b from-dark/80 to-transparent backdrop-blur-sm" />
          <div className="relative h-full max-w-6xl px-6 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex items-center"
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                WAIB
              </h1>
              <span className="px-2 py-1 text-xs font-medium bg-white/5 rounded-full border border-white/5 ml-3">
                3.0
              </span>
            </motion.div>
          </div>
        </header>

        {/* Navigation */}
        <Navigation />

        {/* Main Content Area */}
        <main className="relative pt-28 pb-8 px-4 lg:px-6 lg:pr-32">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto max-w-6xl space-y-6"
          >
            {/* Page Title */}
            <div className="px-4 mb-8">
              <h2 className="text-3xl font-bold">
                {navigationItems.find((item: NavigationItem) => item.href === pathname)?.name || 'Dashboard'}
              </h2>
            </div>

            {/* Content Container */}
            <div className="relative bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.05] shadow-lg overflow-hidden">
              <div className="p-6 md:p-8">
                {children}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
} 