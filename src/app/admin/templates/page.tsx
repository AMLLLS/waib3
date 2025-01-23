"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  RiAddLine, RiSearchLine, RiEditLine, 
  RiDeleteBinLine, RiEyeLine, RiFilter3Line 
} from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import { ITemplate } from '@/models/Template';
import { TemplateApi } from '@/services/apiService';
import { WithClientId } from '@/types/server';

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<WithClientId<ITemplate>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await TemplateApi.getAll();
      setTemplates(data as WithClientId<ITemplate>[]);
    } catch (error) {
      console.error('Error loading templates:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      return;
    }

    try {
      await TemplateApi.delete(id);
      await loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(templates.map(template => template.category)));

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-dark-lighter rounded w-1/4"></div>
          <div className="h-12 bg-dark-lighter rounded"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-20 bg-dark-lighter rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Templates</h1>
          <p className="text-gray-400">
            Gérez les templates disponibles pour les utilisateurs
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/admin/templates/new')}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-dark font-medium rounded-xl"
        >
          <RiAddLine className="text-xl" />
          <span>Nouveau template</span>
        </motion.button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500">
          {error}
        </div>
      )}

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Rechercher un template..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50 text-white"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des templates */}
      <div className="space-y-4">
        {filteredTemplates.map((template) => (
          <motion.div
            key={template._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark/50 backdrop-blur-sm border border-white/5 rounded-xl p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-48 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={template.imageUrl} 
                  alt={template.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-50" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold">{template.title}</h3>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push(`/admin/templates/${template._id}`)}
                      className="p-2 bg-dark/50 text-primary rounded-lg hover:bg-dark/70 transition-colors"
                    >
                      <RiEyeLine className="text-xl" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push(`/admin/templates/${template._id}/edit`)}
                      className="p-2 bg-dark/50 text-primary rounded-lg hover:bg-dark/70 transition-colors"
                    >
                      <RiEditLine className="text-xl" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(template._id)}
                      className="p-2 bg-dark/50 text-red-500 rounded-lg hover:bg-dark/70 transition-colors"
                    >
                      <RiDeleteBinLine className="text-xl" />
                    </motion.button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg">
                    {template.category}
                  </span>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg">
                    {template.difficulty}
                  </span>
                  {template.technologies.map((tech, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-dark/50 text-gray-400 text-xs rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark/50 flex items-center justify-center">
              <RiFilter3Line className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Aucun template trouvé</h3>
            <p className="text-gray-400">
              Aucun template ne correspond à vos critères de recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 