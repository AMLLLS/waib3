"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiSearchLine, RiNotification3Line, RiBellLine, RiUserLine, RiMenuFoldLine, RiMenuUnfoldLine } from 'react-icons/ri';
import { useSidebar } from '../providers/SidebarProvider';

export default function DashboardHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { isCollapsed, setIsCollapsed, isMobile } = useSidebar();

  return (
    <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4 sm:hidden">
            <div className="flex flex-col items-center">
              <span className="text-[1.7rem] font-aeonik font-black leading-none">WAIB</span>
              <span className="text-[0.65rem] font-medium text-gray-400 tracking-wider" style={{ width: '100%', textAlign: 'center' }}>DASHBOARD</span>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 bg-primary rounded-full text-dark hover:bg-primary/90 transition-colors"
            >
              {!isCollapsed ? <RiMenuFoldLine className="text-lg" /> : <RiMenuUnfoldLine className="text-lg" />}
            </button>
          </div>
        </div>

        <div className="flex-1 max-w-2xl hidden sm:block">
          <motion.div 
            initial={false}
            animate={{ width: isSearchOpen ? '100%' : 'auto' }}
            className="relative"
          >
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 rounded-lg ${
                isSearchOpen ? 'bg-gray-800' : 'hover:bg-gray-800'
              } transition-colors`}
            >
              <RiSearchLine className="text-xl" />
            </button>
            <AnimatePresence>
              {isSearchOpen && (
                <motion.input
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: '100%' }}
                  exit={{ opacity: 0, width: 0 }}
                  type="text"
                  placeholder="Rechercher..."
                  className="absolute left-12 top-1/2 -translate-y-1/2 bg-transparent border-none outline-none text-white placeholder-gray-400 w-full focus:ring-2 ring-primary/50"
                  autoFocus
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="flex items-center justify-end flex-1 sm:flex-none space-x-2 sm:space-x-4">
          <motion.button 
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RiNotification3Line className="text-xl" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </motion.button>

          <div className="relative">
            <motion.button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center">
                <RiUserLine className="text-lg" />
              </div>
              <span className="hidden sm:inline font-medium">John Doe</span>
            </motion.button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-lg py-2"
                >
                  <motion.a 
                    href="#" 
                    className="block px-4 py-2 text-sm hover:bg-primary/20 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    Mon Profil
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="block px-4 py-2 text-sm hover:bg-primary/20 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    Paramètres
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="block px-4 py-2 text-sm hover:bg-primary/20 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    Déconnexion
                  </motion.a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
} 