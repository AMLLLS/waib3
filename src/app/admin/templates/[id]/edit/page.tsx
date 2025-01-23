"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RiSaveLine, RiCloseLine, RiAddLine } from 'react-icons/ri';
import { TemplateApi } from '@/services/apiService';
import { ITemplate } from '@/models/Template';
import { WithClientId, toClientDocument } from '@/types/mongodb';
import ClientOnly from '@/components/animations/ClientOnly';
import { toast } from 'react-hot-toast';

export default function EditTemplatePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [template, setTemplate] = useState<WithClientId<ITemplate> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newTechnology, setNewTechnology] = useState('');

  useEffect(() => {
    loadTemplate();
  }, [params.id]);

  const loadTemplate = async () => {
    try {
      const data = await TemplateApi.getById(params.id);
      setTemplate(toClientDocument(data));
    } catch (error) {
      console.error('Error loading template:', error);
      toast.error('Erreur lors du chargement du template');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!template) return;

    setIsSaving(true);
    try {
      const { _id, ...templateData } = template;
      await TemplateApi.update(_id, templateData);
      toast.success('Template mis à jour avec succès');
      router.push('/admin/templates');
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Erreur lors de la mise à jour du template');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleAddTechnology = () => {
    if (!template || !newTechnology.trim()) return;

    setTemplate({
      ...template,
      technologies: [...template.technologies, newTechnology.trim()]
    });
    setNewTechnology('');
  };

  const handleRemoveTechnology = (index: number) => {
    if (!template) return;

    setTemplate({
      ...template,
      technologies: template.technologies.filter((_, i) => i !== index)
    });
  };

  if (isLoading) {
    return (
      <ClientOnly>
        <div className="p-4 sm:p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-dark-lighter rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-10 bg-dark-lighter rounded"></div>
              <div className="h-10 bg-dark-lighter rounded"></div>
              <div className="h-10 bg-dark-lighter rounded"></div>
            </div>
          </div>
        </div>
      </ClientOnly>
    );
  }

  if (!template) {
    return (
      <ClientOnly>
        <div className="p-4 sm:p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-bold mb-2">Template non trouvé</h2>
            <p className="text-gray-400">Le template que vous cherchez n'existe pas.</p>
          </div>
        </div>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Modifier le template</h1>
            <p className="text-gray-400">Modifiez les informations du template</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <RiCloseLine className="text-xl" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-primary text-dark font-medium rounded-xl flex items-center gap-2 disabled:opacity-50"
            >
              <RiSaveLine className="text-xl" />
              <span>Enregistrer</span>
            </motion.button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Informations de base */}
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">
                Titre
              </label>
              <input
                type="text"
                id="title"
                value={template.title}
                onChange={(e) => setTemplate({ ...template, title: e.target.value })}
                className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={template.description}
                onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-400 mb-1">
                Catégorie
              </label>
              <input
                type="text"
                id="category"
                value={template.category}
                onChange={(e) => setTemplate({ ...template, category: e.target.value })}
                className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
              />
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-400 mb-1">
                Difficulté
              </label>
              <select
                id="difficulty"
                value={template.difficulty}
                onChange={(e) => setTemplate({ ...template, difficulty: e.target.value as "Débutant" | "Intermédiaire" | "Avancé" })}
                className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
              >
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
              </select>
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Technologies
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {template.technologies.map((tech, index) => (
                <div
                  key={index}
                  className="px-3 py-1.5 bg-dark/50 rounded-lg flex items-center gap-2"
                >
                  <span className="text-sm text-gray-400">{tech}</span>
                  <button
                    onClick={() => handleRemoveTechnology(index)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <RiCloseLine />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTechnology}
                onChange={(e) => setNewTechnology(e.target.value)}
                placeholder="Nouvelle technologie..."
                className="flex-1 px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTechnology()}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddTechnology}
                className="px-4 py-2 bg-dark/50 border border-white/5 rounded-xl flex items-center gap-2 hover:bg-dark/70 transition-colors"
              >
                <RiAddLine />
                <span>Ajouter</span>
              </motion.button>
            </div>
          </div>

          {/* URLs */}
          <div className="space-y-4">
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-400 mb-1">
                URL de l'image
              </label>
              <input
                type="text"
                id="imageUrl"
                value={template.imageUrl}
                onChange={(e) => setTemplate({ ...template, imageUrl: e.target.value })}
                className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
              />
            </div>

            <div>
              <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-400 mb-1">
                URL de la démo
              </label>
              <input
                type="text"
                id="demoUrl"
                value={template.demoUrl}
                onChange={(e) => setTemplate({ ...template, demoUrl: e.target.value })}
                className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
              />
            </div>

            <div>
              <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-400 mb-1">
                URL GitHub
              </label>
              <input
                type="text"
                id="githubUrl"
                value={template.githubUrl}
                onChange={(e) => setTemplate({ ...template, githubUrl: e.target.value })}
                className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
              />
            </div>
          </div>

          {/* Statut */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-400 mb-1">
              Statut
            </label>
            <select
              id="status"
              value={template.status}
              onChange={(e) => setTemplate({ ...template, status: e.target.value as "draft" | "published" })}
              className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
} 