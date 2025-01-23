'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const LogoutButton: FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Appeler l'API de déconnexion
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      // Supprimer les cookies côté client
      Cookies.remove('adminToken');
      Cookies.remove('userToken');

      // Rediriger vers la page de connexion
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
    >
      Se déconnecter
    </button>
  );
};

export default LogoutButton; 