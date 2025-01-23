"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  RiAddLine, RiPencilLine, RiDeleteBinLine, RiSearchLine,
  RiFilter3Line, RiHeartLine, RiTimeLine
} from 'react-icons/ri';
import { IPrompt } from '@/models/Prompt';
import { PromptApi } from '@/services/apiService';
import ClientOnly from '@/components/animations/ClientOnly';
import { toast } from 'react-hot-toast';

export default function AdminPromptsPage() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<IPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const data = await PromptApi.getAll();
      setPrompts(data);
    } catch (error) {
      console.error('Error loading prompts:', error);
      toast.error('Erreur lors du chargement des prompts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (promptId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce prompt ?')) return;

    try {
      await PromptApi.delete(promptId);
      setPrompts(prompts.filter(p => p._id?.toString() !== promptId));
      toast.success('Prompt supprimé avec succès');
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast.error('Erreur lors de la suppression du prompt');
    }
  };

  const filteredPrompts = prompts.filter(prompt => 
    prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

  return (
    <ClientOnly>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Prompts</h1>
            <p className="text-gray-400">Gérez les prompts de la plateforme</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/admin/prompts/new')}
            className="px-6 py-2 bg-primary text-dark font-medium rounded-xl flex items-center gap-2"
          >
            <RiAddLine className="text-xl" />
            <span>Nouveau prompt</span>
          </motion.button>
        </div>

        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Rechercher un prompt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50 text-white placeholder-gray-400"
            />
          </div>

          {/* Prompts List */}
          <div className="space-y-4">
            {filteredPrompts.map((prompt) => (
              <div
                key={prompt._id?.toString()}
                className="bg-dark/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold mb-1">{prompt.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{prompt.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <div className="px-2 py-1 bg-dark/50 rounded-lg text-xs text-primary">
                          {prompt.category}
                        </div>
                        <div className="px-2 py-1 bg-dark/50 rounded-lg text-xs text-primary">
                          {prompt.difficulty}
                        </div>
                        {prompt.tags.map((tag, index) => (
                          <div
                            key={index}
                            className="px-2 py-1 bg-dark/50 rounded-lg text-xs text-gray-400"
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push(`/admin/prompts/${prompt._id?.toString()}/edit`)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <RiPencilLine className="text-xl" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(prompt._id?.toString() || '')}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <RiDeleteBinLine className="text-xl" />
                      </motion.button>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <RiHeartLine />
                      <span>{prompt.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <RiTimeLine />
                      <span>{prompt.usageCount} utilisations</span>
                    </div>
                    <div className="px-2 py-1 bg-dark/50 rounded-lg text-xs">
                      {prompt.status === 'published' ? 'Publié' : 'Brouillon'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredPrompts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark/50 flex items-center justify-center">
                <RiFilter3Line className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Aucun prompt trouvé</h3>
              <p className="text-gray-400">
                Aucun prompt ne correspond à vos critères de recherche.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </ClientOnly>
  );
} 