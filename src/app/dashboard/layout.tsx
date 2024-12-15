"use client";

import { ReactNode } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Toaster position="top-right" />
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 w-0 min-h-screen">
          <DashboardHeader />
          <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 sm:p-6 overflow-x-hidden"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
} 