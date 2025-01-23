"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiSearchLine, RiFilter3Line, RiLayoutLine,
  RiRestaurantLine, RiShoppingBagLine, RiBuildingLine,
  RiPaletteLine, RiGlobalLine, RiAppsLine,
  RiDownload2Line, RiEyeLine, RiArrowRightLine,
  RiGridLine, RiListUnordered, RiCloseLine,
  RiDeviceLine, RiSmartphoneLine, RiTabletLine,
  RiCheckLine, RiCodeLine, RiBookOpenLine
} from 'react-icons/ri';
import ClientOnly from '@/components/animations/ClientOnly';
import { ITemplate } from '@/models/Template';
import { TemplateApi } from '@/services/apiService';
import { WithClientId } from '@/types/server';

interface PreviewModalProps {
  template: WithClientId<ITemplate>;
  isOpen: boolean;
  onClose: () => void;
}

const PreviewModal = ({ template, isOpen, onClose }: PreviewModalProps) => {
  const features = [
    'Design responsive',
    'Code optimisé',
    'Documentation complète',
    'Support technique',
    'Mises à jour régulières'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl bg-dark-lighter rounded-2xl overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <RiCloseLine className="text-2xl" />
            </button>

            <div className="p-6 sm:p-8">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-96 aspect-video rounded-xl overflow-hidden">
                    <img 
                      src={template.imageUrl} 
                      alt={template.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{template.title}</h3>
                    <p className="text-gray-400 mb-4">{template.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {template.technologies.map((tech, index) => (
                        <div
                          key={index}
                          className="px-3 py-1.5 bg-dark/50 rounded-lg flex items-center gap-2"
                        >
                          <RiCodeLine className="text-primary" />
                          <span className="text-sm text-gray-400">{tech}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <motion.a
                        href={template.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-dark/50 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-dark/70 transition-colors"
                      >
                        <RiEyeLine />
                        <span>Voir la démo</span>
                      </motion.a>
                      <motion.a
                        href={template.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                      >
                        <RiBookOpenLine />
                        <span>Documentation</span>
                      </motion.a>
                      <motion.a
                        href={template.demoUrl}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-primary text-dark text-sm font-medium rounded-lg flex items-center justify-center gap-2"
                      >
                        <RiDownload2Line />
                        <span>Télécharger</span>
                      </motion.a>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-bold mb-4">Caractéristiques</h4>
                    <div className="space-y-3">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <RiCheckLine className="text-primary text-sm" />
                          </div>
                          <span className="text-gray-400">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-4">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {template.technologies.map((tech, index) => (
                        <div
                          key={index}
                          className="px-3 py-1.5 bg-dark/50 rounded-lg flex items-center gap-2"
                        >
                          <RiCodeLine className="text-primary" />
                          <span className="text-sm text-gray-400">{tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewTemplate, setPreviewTemplate] = useState<WithClientId<ITemplate> | null>(null);
  const [templates, setTemplates] = useState<WithClientId<ITemplate>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Gestion du scroll
  useEffect(() => {
    if (previewTemplate !== null) {
      document.documentElement.classList.add('modal-open');
      document.body.classList.add('modal-open');
    } else {
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
    }
  }, [previewTemplate]);

  const handlePreview = (template: WithClientId<ITemplate>) => {
    setPreviewTemplate(template);
  };

  const categories = Array.from(new Set(templates.map(template => template.category)));
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <ClientOnly>
        <div className="overflow-x-hidden">
          <div className="animate-pulse space-y-6 sm:space-y-8">
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
                    Templates{' '}
                    <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                      prêts à l'emploi
                    </span>
                  </h1>
                  <p className="text-gray-400 text-base sm:text-lg md:text-xl mb-6">
                    Accélérez vos projets avec nos templates professionnels, personnalisables et optimisés pour une expérience utilisateur exceptionnelle.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <RiLayoutLine className="text-primary" />
                      <span>Templates responsifs</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <RiPaletteLine className="text-primary" />
                      <span>Design moderne</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <RiDownload2Line className="text-primary" />
                      <span>Téléchargement facile</span>
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
                placeholder="Rechercher un template..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50 text-white placeholder-gray-400"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' 
                    ? 'bg-primary text-dark' 
                    : 'bg-dark/50 text-gray-400 hover:bg-dark/70'
                }`}
              >
                <RiGridLine className="text-xl" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' 
                    ? 'bg-primary text-dark' 
                    : 'bg-dark/50 text-gray-400 hover:bg-dark/70'
                }`}
              >
                <RiListUnordered className="text-xl" />
              </motion.button>
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
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Categories Sidebar - Desktop */}
            <div className="hidden lg:block w-64 space-y-2">
              {categories.map((category) => {
                const categoryTemplates = templates.filter(t => t.category === category);
                return (
                  <motion.button
                    key={category}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                    className={`w-full p-3 rounded-xl transition-all flex items-center gap-3 ${
                      selectedCategory === category
                        ? 'bg-primary text-dark font-medium'
                        : 'bg-dark/50 text-gray-400 hover:bg-dark/70'
                    }`}
                  >
                    <div className="text-left">
                      <span className="block font-medium">{category}</span>
                      <span className="text-xs opacity-80">
                        {categoryTemplates.length} templates
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Mobile Categories */}
            <div className="lg:hidden -mx-4 px-4">
              <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-none">
                {categories.map((category) => {
                  const categoryTemplates = templates.filter(t => t.category === category);
                  return (
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
                      <span className="text-xs opacity-80">({categoryTemplates.length})</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Templates Grid/List */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode + (selectedCategory || 'all')}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {selectedCategory ? `Templates ${selectedCategory}` : 'Tous les templates'}
                    </h2>
                    <p className="text-gray-400">
                      {selectedCategory
                        ? `Découvrez nos templates pour ${selectedCategory.toLowerCase()}`
                        : 'Explorez notre collection complète de templates'}
                    </p>
                  </div>

                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                      {filteredTemplates.map((template) => (
                        <motion.div
                          key={template._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ y: -5 }}
                          className="group bg-dark/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5"
                        >
                          <div className="relative aspect-video overflow-hidden">
                            <img 
                              src={template.imageUrl} 
                              alt={template.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent" />
                            {/* Mobile: Toujours visible, Desktop: Visible au survol */}
                            <div className="absolute inset-0 flex items-center justify-center lg:opacity-0 lg:group-hover:opacity-100 transition-opacity bg-dark/80 backdrop-blur-sm">
                              <div className="flex gap-3">
                                <motion.button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handlePreview(template);
                                  }}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="w-12 h-12 rounded-full bg-dark/80 flex items-center justify-center text-white hover:bg-dark/60"
                                >
                                  <RiEyeLine className="text-2xl" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
                                >
                                  <RiBookOpenLine className="text-2xl" />
                                </motion.button>
                                <motion.a
                                  href={template.demoUrl}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-dark"
                                >
                                  <RiDownload2Line className="text-2xl" />
                                </motion.a>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                              <h3 className="text-lg font-bold">{template.title}</h3>
                              <div className="flex items-center gap-3 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                  <RiDownload2Line />
                                  <span>0</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <RiEyeLine />
                                  <span>0</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {template.technologies.map((tech, index) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 bg-dark/50 text-primary text-xs rounded-lg"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTemplates.map((template) => (
                        <motion.div
                          key={template._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="group bg-dark/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5 p-4 sm:p-6"
                        >
                          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                            <div className="relative w-full sm:w-64 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={template.imageUrl} 
                                alt={template.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <h3 className="text-lg font-bold">{template.title}</h3>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <RiDownload2Line />
                                    <span>0</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <RiEyeLine />
                                    <span>0</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {template.technologies.map((tech, index) => (
                                  <span 
                                    key={index}
                                    className="px-2 py-1 bg-dark/50 text-primary text-xs rounded-lg"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <motion.button
                                  onClick={() => handlePreview(template)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-4 py-2 bg-dark/50 text-white text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-dark/70 transition-colors"
                                >
                                  <RiEyeLine />
                                  <span>Aperçu</span>
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                                >
                                  <RiBookOpenLine />
                                  <span>Guide d'installation</span>
                                </motion.button>
                                <motion.a
                                  href={template.demoUrl}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-4 py-2 bg-primary text-dark text-sm font-medium rounded-lg flex items-center justify-center gap-2"
                                >
                                  <RiDownload2Line />
                                  <span>Télécharger</span>
                                </motion.a>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {filteredTemplates.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark/50 flex items-center justify-center">
                        <RiFilter3Line className="text-3xl text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Aucun template trouvé</h3>
                      <p className="text-gray-400">
                        Aucun template ne correspond à vos critères de recherche.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {previewTemplate && (
          <PreviewModal
            template={previewTemplate}
            isOpen={previewTemplate !== null}
            onClose={() => setPreviewTemplate(null)}
          />
        )}
      </div>
    </ClientOnly>
  );
} 