"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import Loader from '../animations/Loader';
import { AnimatePresence, motion } from 'framer-motion';

interface LoaderContextType {
  showLoader: () => void;
  hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType | null>(null);

export function useLoader() {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
}

interface LoaderProviderProps {
  children: ReactNode;
}

export function LoaderProvider({ children }: LoaderProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Afficher le contenu après que le loader soit complètement disparu
      setTimeout(() => {
        setContentVisible(true);
      }, 500); // Correspond à la durée de l'animation de sortie du loader
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const showLoader = useCallback(() => {
    setContentVisible(false);
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
    setTimeout(() => {
      setContentVisible(true);
    }, 500);
  }, []);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      <AnimatePresence mode="wait">
        {isLoading && <Loader />}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: contentVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </LoaderContext.Provider>
  );
} 