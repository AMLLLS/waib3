'use client';

import { FC, ReactNode, useEffect } from 'react';

interface LoginLayoutProps {
  children: ReactNode;
}

const LoginLayout: FC<LoginLayoutProps> = ({ children }) => {
  useEffect(() => {
    // Ajouter la classe pour masquer le header
    const header = document.querySelector('.fixed.w-full.z-50.py-4');
    if (header) {
      header.classList.add('hidden');
    }

    // Nettoyer en enlevant la classe quand on quitte la page
    return () => {
      if (header) {
        header.classList.remove('hidden');
      }
    };
  }, []);

  return <>{children}</>;
};

export default LoginLayout; 