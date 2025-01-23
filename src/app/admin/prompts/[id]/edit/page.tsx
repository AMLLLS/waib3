"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RiSaveLine, RiCloseLine, RiAddLine } from 'react-icons/ri';
import { IPrompt, PromptCategory, PromptDifficulty } from '@/models/Prompt';
import { PromptApi } from '@/services/apiService';
import { WithClientId, toClientDocument } from '@/types/mongodb';
import ClientOnly from '@/components/animations/ClientOnly';
import { toast } from 'react-hot-toast';

export default function EditPromptPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [prompt, setPrompt] = useState<WithClientId<IPrompt> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    loadPrompt();
  }, [params.id]);

  const loadPrompt = async () => {
    try {
      const data = await PromptApi.getById(params.id);
      setPrompt(toClientDocument(data));
    } catch (error) {
      console.error('Error loading prompt:', error);
      toast.error('Erreur lors du chargement du prompt');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!prompt || !prompt.title || !prompt.description || !prompt.content) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSaving(true);
    try {
      const { _id, ...promptData } = prompt;
      await PromptApi.update(_id, promptData);
      toast.success('Prompt mis à jour avec succès');
      router.push('/admin/prompts');
    } catch (error) {
      console.error('Error updating prompt:', error);
      toast.error('Erreur lors de la mise à jour du prompt');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleAddTag = () => {
    if (!prompt || !newTag.trim()) return;

    setPrompt({
      ...prompt,
      tags: [...prompt.tags, newTag.trim()]
    });
    setNewTag('');
  };

  const handleRemoveTag = (index: number) => {
    if (!prompt) return;

    setPrompt({
      ...prompt,
      tags: prompt.tags.filter((_, i) => i !== index)
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

  if (!prompt) {
    return (
      <ClientOnly>
        <div className="p-4 sm:p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-bold mb-2">Prompt non trouvé</h2>
            <p className="text-gray-400">Le prompt que vous cherchez n'existe pas.</p>
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
            <h1 className="text-2xl font-bold mb-1">Modifier le prompt</h1>
            <p className="text-gray-400">Modifiez les informations du prompt</p>
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
                value={prompt.title}
                onChange={(e) => setPrompt({ ...prompt, title: e.target.value })}
                className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={prompt.description}
                onChange={(e) => setPrompt({ ...prompt, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-400 mb-1">
                Contenu du prompt
              </label>
              <textarea
                id="content"
                value={prompt.content}
                onChange={(e) => setPrompt({ ...prompt, content: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50 font-mono"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-400 mb-1">
                Catégorie
              </label>
              <select
                id="category"
                value={prompt.category}
                onChange={(e) => setPrompt({ ...prompt, category: e.target.value as PromptCategory })}
                className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
              >
                {(['Développement', 'Design', 'Marketing', 'Business', 'Productivité', 'Autre'] as const).map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-400 mb-1">
                Difficulté
              </label>
              <select
                id="difficulty"
                value={prompt.difficulty}
                onChange={(e) => setPrompt({ ...prompt, difficulty: e.target.value as PromptDifficulty })}
                className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
              >
                {(['Débutant', 'Intermédiaire', 'Avancé'] as const).map((difficulty) => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {prompt.tags.map((tag, index) => (
                <div
                  key={index}
                  className="px-3 py-1.5 bg-dark/50 rounded-lg flex items-center gap-2"
                >
                  <span className="text-sm text-gray-400">{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(index)}
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
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Nouveau tag..."
                className="flex-1 px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddTag}
                className="px-4 py-2 bg-dark/50 border border-white/5 rounded-xl flex items-center gap-2 hover:bg-dark/70 transition-colors"
              >
                <RiAddLine />
                <span>Ajouter</span>
              </motion.button>
            </div>
          </div>

          {/* Statut */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-400 mb-1">
              Statut
            </label>
            <select
              id="status"
              value={prompt.status}
              onChange={(e) => setPrompt({ ...prompt, status: e.target.value as 'draft' | 'published' })}
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