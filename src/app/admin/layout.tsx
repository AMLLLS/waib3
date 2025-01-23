"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiDashboardLine, RiBookOpenLine, RiFileList3Line,
  RiLayoutLine, RiLogoutBoxLine, RiMenuLine,
  RiCloseLine, RiArrowLeftLine, RiBrainLine
} from 'react-icons/ri';
import { useAuth } from '@/components/providers/AuthProvider';

const navigation = [
  {
    name: 'Vue d\'ensemble',
    href: '/admin',
    icon: RiDashboardLine
  },
  {
    name: 'Formations',
    href: '/admin/formations',
    icon: RiBookOpenLine
  },
  {
    name: 'Chapitres',
    href: '/admin/chapters',
    icon: RiFileList3Line
  },
  {
    name: 'Templates',
    href: '/admin/templates',
    icon: RiLayoutLine
  },
  {
    name: 'Prompts',
    href: '/admin/prompts',
    icon: RiBrainLine
  }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated === false && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else if (isAuthenticated === true && pathname === '/admin/login') {
      router.push('/admin');
    }
    setIsLoading(false);
  }, [isAuthenticated, router, pathname]);

  if (isLoading || isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null;
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-dark-lighter rounded-lg lg:hidden"
      >
        {isSidebarOpen ? <RiCloseLine className="text-2xl" /> : <RiMenuLine className="text-2xl" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-screen w-64 bg-dark-lighter border-r border-white/5 z-40 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">Administration</h2>
              </div>

              <nav className="space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.button
                      key={item.name}
                      whileHover={{ x: 4 }}
                      onClick={() => router.push(item.href)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-primary text-dark font-medium'
                          : 'hover:bg-dark'
                      }`}
                    >
                      <item.icon className={`text-xl ${isActive ? 'text-dark' : 'text-gray-400'}`} />
                      <span>{item.name}</span>
                    </motion.button>
                  );
                })}

                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left text-red-500 hover:bg-dark transition-colors mt-8"
                >
                  <RiLogoutBoxLine className="text-xl" />
                  <span>Déconnexion</span>
                </motion.button>
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`min-h-screen transition-all ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        {children}
      </main>
    </div>
  );
} 