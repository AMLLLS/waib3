"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { motion } from 'framer-motion';
import { 
  RiBookOpenLine, RiFileList3Line, RiLayoutLine,
  RiUserLine, RiTimeLine, RiAddLine
} from 'react-icons/ri';

// Données factices pour la démo
const stats = [
  {
    name: 'Formations',
    value: '12',
    icon: RiBookOpenLine,
    href: '/admin/formations'
  },
  {
    name: 'Ressources',
    value: '24',
    icon: RiFileList3Line,
    href: '/admin/ressources'
  },
  {
    name: 'Templates',
    value: '8',
    icon: RiLayoutLine,
    href: '/admin/templates'
  }
];

const recentActivity = [
  {
    id: 1,
    type: 'formation',
    action: 'Ajout',
    name: 'Introduction à React',
    date: 'Il y a 2 heures'
  },
  {
    id: 2,
    type: 'ressource',
    action: 'Modification',
    name: 'Guide Git avancé',
    date: 'Il y a 3 heures'
  },
  {
    id: 3,
    type: 'template',
    action: 'Suppression',
    name: 'Template E-commerce',
    date: 'Il y a 5 heures'
  }
];

const quickActions = [
  {
    name: 'Nouvelle formation',
    description: 'Créer une nouvelle formation',
    href: '/admin/formations/new',
    icon: RiBookOpenLine,
    color: 'bg-blue-500'
  },
  {
    name: 'Nouvelle ressource',
    description: 'Ajouter une ressource',
    href: '/admin/ressources/new',
    icon: RiFileList3Line,
    color: 'bg-green-500'
  },
  {
    name: 'Nouveau template',
    description: 'Ajouter un template',
    href: '/admin/templates/new',
    icon: RiLayoutLine,
    color: 'bg-purple-500'
  }
];

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Titre de la page */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Vue d'ensemble</h1>
        <p className="text-gray-400">
          Bienvenue dans votre espace d'administration. Gérez votre contenu et suivez vos statistiques.
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.name}
            whileHover={{ y: -4 }}
            onClick={() => router.push(stat.href)}
            className="p-6 bg-dark-lighter rounded-xl border border-white/5 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 mb-1">{stat.name}</p>
                <h3 className="text-3xl font-bold">{stat.value}</h3>
              </div>
              <div className="p-3 rounded-lg bg-dark">
                <stat.icon className="text-2xl text-primary" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions rapides */}
      <div>
        <h2 className="text-xl font-bold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <motion.div
              key={action.name}
              whileHover={{ y: -4 }}
              onClick={() => router.push(action.href)}
              className="group p-6 bg-dark-lighter rounded-xl border border-white/5 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${action.color}`}>
                  <action.icon className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                    {action.name}
                  </h3>
                  <p className="text-sm text-gray-400">{action.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Activité récente */}
      <div>
        <h2 className="text-xl font-bold mb-4">Activité récente</h2>
        <div className="bg-dark-lighter rounded-xl border border-white/5 overflow-hidden">
          <div className="p-4 space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-dark">
                    {activity.type === 'formation' && <RiBookOpenLine className="text-blue-500" />}
                    {activity.type === 'ressource' && <RiFileList3Line className="text-green-500" />}
                    {activity.type === 'template' && <RiLayoutLine className="text-purple-500" />}
                  </div>
                  <div>
                    <p className="font-medium">
                      <span className="text-gray-400">{activity.action}:</span> {activity.name}
                    </p>
                    <p className="text-sm text-gray-400">{activity.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 