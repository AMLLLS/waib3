"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import {
  RiHome4Line,
  RiBookOpenLine,
  RiLightbulbLine,
  RiPaletteLine,
  RiMenuLine,
  RiCloseLine,
  RiArrowRightUpLine,
  RiUser3Line,
  RiLogoutBoxLine,
  RiAppsLine,
  RiSearchLine
} from 'react-icons/ri';

export const navigationItems = [
  {
    name: 'Vue d\'ensemble',
    href: '/dashboard',
    icon: RiHome4Line,
    color: 'from-violet-500 to-purple-500'
  },
  {
    name: 'Formations',
    href: '/dashboard/formations',
    icon: RiBookOpenLine,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Prompts',
    href: '/dashboard/prompts',
    icon: RiLightbulbLine,
    color: 'from-amber-500 to-orange-500'
  },
  {
    name: 'Templates',
    href: '/dashboard/templates',
    icon: RiPaletteLine,
    color: 'from-emerald-500 to-green-500'
  }
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="fixed top-8 right-8 z-40 hidden lg:block">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-md border border-white/[0.05] rounded-2xl p-3 shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                const isHovered = hoveredItem === item.href;
                return (
                  <div 
                    key={item.name} 
                    className="group relative"
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {/* Label */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-gradient-to-r from-white/[0.08] to-transparent backdrop-blur-md border border-white/[0.05] whitespace-nowrap"
                        >
                          <span className="text-sm font-medium">{item.name}</span>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-2 h-2 border-t-2 border-r-2 border-white/[0.05] rotate-45" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Icon Button */}
                    <motion.button
                      onClick={() => handleNavigation(item.href)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative p-3 rounded-xl transition-all duration-300 overflow-hidden ${
                        isActive
                          ? 'bg-gradient-to-br ' + item.color
                          : 'hover:bg-white/[0.08]'
                      }`}
                    >
                      <item.icon className={`relative z-10 text-xl ${isActive ? 'text-white' : 'text-white/60'}`} />
                      {isActive && (
                        <>
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute inset-0 rounded-xl bg-gradient-to-br opacity-50 blur-lg"
                            style={{ background: `inherit` }}
                          />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,transparent_100%)] opacity-50" />
                        </>
                      )}
                    </motion.button>
                  </div>
                );
              })}

              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

              {/* Profile & Logout Buttons */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl hover:bg-white/[0.08] text-white/60 relative overflow-hidden group"
              >
                <RiUser3Line className="text-xl relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl hover:bg-white/[0.08] text-red-500/60 hover:text-red-500 relative overflow-hidden group"
              >
                <RiLogoutBoxLine className="text-xl relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-6 right-4 z-50 p-2.5 bg-gradient-to-br from-white/[0.08] to-transparent backdrop-blur-md border border-white/[0.05] rounded-xl lg:hidden"
      >
        <RiAppsLine className="text-xl text-white/80" />
      </motion.button>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Navigation Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute inset-y-0 right-0 w-[85%] max-w-md bg-dark-lighter/90 backdrop-blur-xl overflow-hidden"
            >
              <div className="relative h-full flex flex-col">
                {/* Header */}
                <div className="p-6 pb-0">
                  <div className="relative">
                    <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-xl" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/[0.05] rounded-xl text-white/80 placeholder-white/40 focus:outline-none focus:border-white/10"
                    />
                  </div>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto px-3 pt-6">
                  {navigationItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <motion.button
                        key={item.name}
                        onClick={() => handleNavigation(item.href)}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative w-full flex items-center gap-4 p-3 mb-2 rounded-xl transition-all overflow-hidden ${
                          isActive
                            ? 'bg-gradient-to-r ' + item.color
                            : 'hover:bg-white/[0.03]'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isActive ? 'bg-white/20' : 'bg-white/[0.03]'
                        }`}>
                          <item.icon className={`text-2xl ${isActive ? 'text-white' : 'text-white/60'}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`font-medium ${isActive ? 'text-white' : 'text-white/80'}`}>
                            {item.name}
                          </p>
                          <p className="text-sm text-white/40">
                            {isActive ? 'Page active' : 'Cliquez pour accéder'}
                          </p>
                        </div>
                        <RiArrowRightUpLine className={`text-xl ${isActive ? 'text-white' : 'text-white/20'}`} />
                      </motion.button>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/[0.05]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center">
                        <RiUser3Line className="text-xl text-white/60" />
                      </div>
                      <div>
                        <p className="font-medium text-white/80">Alex Doe</p>
                        <p className="text-sm text-white/40">Membre Premium</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 rounded-lg bg-red-500/10 text-red-500"
                    >
                      <RiLogoutBoxLine className="text-xl" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
} 