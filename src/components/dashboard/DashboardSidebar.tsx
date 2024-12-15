"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiHome5Line, RiVideoLine, RiBookOpenLine, 
  RiLightbulbLine, RiToolsLine, RiMenuFoldLine, 
  RiMenuUnfoldLine, RiRocketLine, RiBrainLine 
} from 'react-icons/ri';
import { useSidebar } from '../providers/SidebarProvider';

const menuItems = [
  { name: 'Vue d\'ensemble', icon: RiHome5Line, path: '/dashboard' },
  { name: 'Formations', icon: RiVideoLine, path: '/dashboard/formations' },
  { name: 'Ressources', icon: RiBookOpenLine, path: '/dashboard/ressources' },
  { name: 'Prompts IA', icon: RiBrainLine, path: '/dashboard/prompts' },
  { name: 'Tutoriels', icon: RiLightbulbLine, path: '/dashboard/tutoriels' },
  { name: 'Outils', icon: RiToolsLine, path: '/dashboard/outils' },
  { name: 'Progression', icon: RiRocketLine, path: '/dashboard/progression' },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed, isMobile } = useSidebar();

  return (
    <>
      <motion.div 
        initial={{ width: isMobile ? 80 : 250, x: isMobile ? -80 : 0 }}
        animate={{ 
          width: isCollapsed ? 80 : 250,
          x: isMobile && isCollapsed ? -80 : 0
        }}
        className={`fixed md:sticky md:top-0 h-screen ${
          isMobile ? 'bg-gray-900/80 backdrop-blur-xl shadow-2xl' : 'bg-gray-900'
        } border-r border-gray-800 z-50`}
      >
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-6 bg-primary p-1.5 rounded-full text-dark hover:bg-primary/90 transition-colors"
          >
            {isCollapsed ? <RiMenuUnfoldLine /> : <RiMenuFoldLine />}
          </button>
        )}

        <div className="p-4 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
          <Link href="/" className="block mb-8">
            <motion.div
              initial={false}
              animate={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
              className="flex items-center"
            >
              <div className={`relative ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
                <span className="text-[1.7rem] font-aeonik font-black">WAIB</span>
              </div>
            </motion.div>
          </Link>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                  onClick={() => isMobile && setIsCollapsed(true)}
                  className={`flex items-center p-3 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-primary text-dark font-medium' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className={`text-xl ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.div>
      {isMobile && !isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
} 