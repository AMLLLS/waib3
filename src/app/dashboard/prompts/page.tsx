"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiSearchLine, RiFilter3Line, RiHeartLine, RiHeartFill,
  RiTimeLine, RiFileCopyLine, RiCheckLine, RiCloseLine,
  RiArrowRightLine, RiStarLine, RiStarFill
} from 'react-icons/ri';
import { IPrompt, PromptCategory } from '@/models/Prompt';
import { PromptApi } from '@/services/apiService';
import ClientOnly from '@/components/animations/ClientOnly';
import { toast } from 'react-hot-toast';

interface PromptCardProps {
  prompt: IPrompt;
  onLike: () => void;
  onUse: () => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onLike, onUse }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      onUse();
    } catch (error) {
      console.error('Error copying prompt:', error);
      toast.error('Erreur lors de la copie du prompt');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-dark/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5"
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h3 className="text-lg font-bold mb-1">{prompt.title}</h3>
            <p className="text-gray-400 text-sm">{prompt.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onLike}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              {prompt.likes > 0 ? <RiHeartFill className="text-red-500" /> : <RiHeartLine />}
            </motion.button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
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

        <div className="relative">
          <pre className="p-4 bg-dark rounded-lg text-sm text-gray-400 overflow-x-auto">
            {prompt.content}
          </pre>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 bg-dark-lighter rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            {isCopied ? <RiCheckLine /> : <RiFileCopyLine />}
          </motion.button>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <RiHeartLine />
              <span>{prompt.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <RiTimeLine />
              <span>{prompt.usageCount} utilisations</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<IPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | null>(null);
  const [showFilters, setShowFilters] = useState(false);

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

  const handleLike = async (promptId: string) => {
    try {
      await PromptApi.like(promptId);
      setPrompts(prompts.map(p => 
        p._id?.toString() === promptId ? { ...p, likes: p.likes + 1 } : p
      ));
      toast.success('Prompt liké !');
    } catch (error) {
      console.error('Error liking prompt:', error);
      toast.error('Erreur lors du like du prompt');
    }
  };

  const handleUse = async (promptId: string) => {
    try {
      await PromptApi.incrementUsage(promptId);
      setPrompts(prompts.map(p => 
        p._id?.toString() === promptId ? { ...p, usageCount: p.usageCount + 1 } : p
      ));
    } catch (error) {
      console.error('Error incrementing prompt usage:', error);
    }
  };

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || prompt.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <ClientOnly>
        <div className="p-4 sm:p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-dark-lighter rounded-2xl"></div>
            <div className="space-y-4">
              <div className="h-12 bg-dark-lighter rounded-xl w-1/3"></div>
              <div className="h-8 bg-dark-lighter rounded-xl"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="aspect-video bg-dark-lighter rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <div className="overflow-x-hidden">
        <div className="space-y-6 sm:space-y-8">
          {/* Hero Section */}
          <div className="relative bg-dark-lighter rounded-xl sm:rounded-2xl overflow-hidden">
            <div className="relative z-10 p-6 sm:p-8 md:p-12">
              <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                    Bibliothèque de{' '}
                    <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                      Prompts
                    </span>
                  </h1>
                  <p className="text-gray-400 text-base sm:text-lg md:text-xl mb-6">
                    Découvrez notre collection de prompts optimisés pour vous aider dans vos projets.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <RiStarLine className="text-primary" />
                      <span>Prompts testés et approuvés</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <RiFileCopyLine className="text-primary" />
                      <span>Copie en un clic</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <RiHeartLine className="text-primary" />
                      <span>Système de likes</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Dégradés décoratifs */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 via-transparent to-transparent" />
          </div>

          {/* Controls Section */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Rechercher un prompt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50 text-white placeholder-gray-400"
              />
            </div>

            {/* Filters */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-dark/50 border border-white/5 rounded-xl flex items-center justify-center space-x-2 hover:bg-dark/70 transition-colors"
            >
              <RiFilter3Line className="text-xl" />
              <span>Filtres</span>
            </motion.button>
          </div>

          {/* Categories */}
          <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-none -mx-4 px-4">
            {(['Développement', 'Design', 'Marketing', 'Business', 'Productivité', 'Autre'] as const).map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 flex-shrink-0 ${
                  selectedCategory === category
                    ? 'bg-primary text-dark font-medium'
                    : 'bg-dark/50 text-gray-400 hover:bg-dark/70'
                }`}
              >
                <span>{category}</span>
                <span className="text-xs opacity-80">
                  ({prompts.filter(p => p.category === category).length})
                </span>
              </motion.button>
            ))}
          </div>

          {/* Prompts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt._id?.toString()}
                prompt={prompt}
                onLike={() => handleLike(prompt._id?.toString() || '')}
                onUse={() => handleUse(prompt._id?.toString() || '')}
              />
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