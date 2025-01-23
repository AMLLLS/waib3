"use client";

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import { RiUserLine } from 'react-icons/ri';

const DashboardHeader: FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // Appeler l'API de déconnexion
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      // Supprimer le cookie
      Cookies.remove('userToken');

      // Rediriger vers la page de connexion
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          
          <div className="relative">
            <motion.button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center">
                <RiUserLine className="text-lg" />
              </div>
              <span className="hidden sm:inline font-medium">Mon compte</span>
            </motion.button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-lg py-2 z-50"
                >
                  <motion.button 
                    className="w-full text-left px-4 py-2 text-sm hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      setIsMenuOpen(false);
                      // TODO: Implémenter la page de profil
                      console.log('Profile - À implémenter');
                    }}
                    disabled
                  >
                    Mon profil
                  </motion.button>
                  <motion.button 
                    className="w-full text-left px-4 py-2 text-sm hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      setIsMenuOpen(false);
                      // TODO: Implémenter la page des paramètres
                      console.log('Settings - À implémenter');
                    }}
                    disabled
                  >
                    Paramètres
                  </motion.button>
                  <motion.button 
                    className="w-full text-left px-4 py-2 text-sm hover:bg-primary/20 transition-colors"
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    Déconnexion
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader; 