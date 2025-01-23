"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiSearchLine, RiDownloadLine, RiBookmarkLine, 
  RiBookmarkFill, RiFolderLine, RiArrowDownSLine,
  RiCheckLine, RiFileList3Line
} from 'react-icons/ri';
import ClientOnly from '@/components/animations/ClientOnly';
import { FormationApi, ChapterApi } from '@/services/apiService';
import { IFormation } from '@/models/Formation';
import { IChapter } from '@/models/Chapter';
import { WithClientId, toClientDocuments } from '@/types/mongodb';

interface Resource {
  name: string;
  size: string;
  url: string;
}

interface FormationWithResources extends WithClientId<IFormation> {
  resources: Resource[];
}

interface ChapterWithFormations extends WithClientId<IChapter> {
  formations: FormationWithResources[];
}

export default function RessourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [savedResources, setSavedResources] = useState<string[]>([]);
  const [chapters, setChapters] = useState<ChapterWithFormations[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [formationsData, chaptersData] = await Promise.all([
          FormationApi.getAll(),
          ChapterApi.getAll()
        ]);

        // Convertir les données en format client
        const clientFormations = toClientDocuments<IFormation>(formationsData);
        const clientChapters = toClientDocuments<IChapter>(chaptersData);

        // Formater les chapitres avec leurs formations
        const formattedChapters: ChapterWithFormations[] = clientChapters.map(chapter => {
          const chapterFormations = clientFormations
            .filter(f => f.chapterId === chapter._id)
            .map(f => ({
              ...f,
              resources: [] // À implémenter avec le système de ressources
            }));

          return {
            ...chapter,
            formations: chapterFormations
          };
        });

        setChapters(formattedChapters);
        if (formattedChapters.length > 0) {
          setExpandedChapters([formattedChapters[0]._id]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => 
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const toggleSaveResource = (resourceId: string) => {
    setSavedResources(prev =>
      prev.includes(resourceId)
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  if (isLoading) {
    return (
      <ClientOnly>
        <div className="min-h-screen p-4 sm:p-6">
          <div className="space-y-6">
            {/* Skeleton pour le header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="h-8 w-48 bg-dark/50 rounded-lg animate-pulse" />
                <div className="h-4 w-64 bg-dark/50 rounded-lg animate-pulse" />
              </div>
              <div className="w-full sm:w-64 h-10 bg-dark/50 rounded-xl animate-pulse" />
            </div>

            {/* Skeleton pour la grille */}
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
              {/* Sidebar */}
              <div className="lg:col-span-2">
                <div className="bg-dark/50 rounded-xl p-4 space-y-4">
                  <div className="h-6 w-32 bg-dark/50 rounded-lg animate-pulse" />
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-10 bg-dark/50 rounded-lg animate-pulse" />
                      <div className="pl-4 space-y-2">
                        {[1, 2].map((j) => (
                          <div key={j} className="h-8 bg-dark/50 rounded-lg animate-pulse" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Liste principale */}
              <div className="lg:col-span-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-4">
                    <div className="h-16 bg-dark/50 rounded-xl animate-pulse" />
                    <div className="pl-4 space-y-2">
                      {[1, 2].map((j) => (
                        <div key={j} className="h-24 bg-dark/50 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <div className="p-4 sm:p-6 overflow-x-hidden">
        <div className="space-y-6">
          {/* Header avec recherche */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Ressources</h1>
              <p className="text-gray-400 text-sm sm:text-base mt-1">
                Accédez à toutes les ressources de vos modules
              </p>
            </div>
            <div className="w-full sm:w-auto">
              <div className="relative">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Rechercher une ressource..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50 text-white placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Structure hiérarchique des ressources */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 overflow-hidden">
            {/* Sidebar avec navigation rapide */}
            <div className="lg:col-span-2">
              <div className="bg-dark/50 backdrop-blur-sm rounded-xl border border-white/5 p-4">
                <h2 className="text-lg font-bold mb-4">Navigation rapide</h2>
                <div className="space-y-2">
                  {chapters.map((chapter) => (
                    <motion.button
                      key={chapter._id}
                      onClick={() => toggleChapter(chapter._id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-dark/50 transition-colors">
                        <span className="text-sm">Chapitre {chapter.order}</span>
                        <motion.div
                          animate={{ rotate: expandedChapters.includes(chapter._id) ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <RiArrowDownSLine />
                        </motion.div>
                      </div>
                      <AnimatePresence initial={false}>
                        {expandedChapters.includes(chapter._id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ 
                              height: "auto", 
                              opacity: 1,
                              transition: {
                                height: { duration: 0.3, ease: "easeOut" },
                                opacity: { duration: 0.2, delay: 0.1 }
                              }
                            }}
                            exit={{ 
                              height: 0, 
                              opacity: 0,
                              transition: {
                                height: { duration: 0.3, ease: "easeInOut" },
                                opacity: { duration: 0.2 }
                              }
                            }}
                            className="overflow-hidden pl-4"
                          >
                            <div className="pt-2 space-y-1">
                              {chapter.formations.map((formation) => (
                                <motion.button
                                  key={formation._id}
                                  initial={{ x: -10, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  exit={{ x: -10, opacity: 0 }}
                                  className="w-full text-left py-1.5 px-2 text-sm text-gray-400 hover:text-white transition-colors rounded-lg"
                                >
                                  {formation.title}
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Liste principale des ressources */}
            <div className="lg:col-span-4 space-y-4">
              {chapters.map((chapter) => (
                <div key={chapter._id} className="space-y-4">
                  <motion.div 
                    className="bg-dark/50 backdrop-blur-sm rounded-xl border border-white/5 p-4 cursor-pointer"
                    onClick={() => toggleChapter(chapter._id)}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold">Chapitre {chapter.order}</h2>
                        <p className="text-sm text-gray-400">{chapter.title}</p>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedChapters.includes(chapter._id) ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <RiArrowDownSLine className="text-2xl" />
                      </motion.div>
                    </div>
                  </motion.div>

                  <AnimatePresence initial={false}>
                    {expandedChapters.includes(chapter._id) && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: {
                            duration: 0.3,
                            ease: "easeOut"
                          }
                        }}
                        exit={{ 
                          opacity: 0, 
                          y: -20,
                          transition: {
                            duration: 0.2
                          }
                        }}
                        className="space-y-4 pl-4"
                      >
                        {chapter.formations.map((formation) => (
                          <div key={formation._id} className="space-y-3">
                            <motion.div 
                              className="bg-dark/30 backdrop-blur-sm rounded-xl border border-white/5 p-4 cursor-pointer"
                              onClick={() => toggleModule(`${chapter._id}-${formation._id}`)}
                              whileHover={{ scale: 1.01 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">{formation.title}</h3>
                                <motion.div
                                  animate={{ 
                                    rotate: expandedModules.includes(`${chapter._id}-${formation._id}`) ? 180 : 0 
                                  }}
                                  transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                  <RiArrowDownSLine />
                                </motion.div>
                              </div>
                            </motion.div>

                            <AnimatePresence initial={false}>
                              {expandedModules.includes(`${chapter._id}-${formation._id}`) && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ 
                                    opacity: 1, 
                                    height: "auto",
                                    transition: {
                                      height: { duration: 0.3, ease: "easeOut" },
                                      opacity: { duration: 0.2, delay: 0.1 }
                                    }
                                  }}
                                  exit={{ 
                                    opacity: 0, 
                                    height: 0,
                                    transition: {
                                      height: { duration: 0.3, ease: "easeInOut" },
                                      opacity: { duration: 0.2 }
                                    }
                                  }}
                                  className="overflow-hidden pl-4"
                                >
                                  <div className="space-y-2 pt-1">
                                    {formation.resources?.map((resource: Resource) => (
                                      <motion.div
                                        key={resource.name}
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -10, opacity: 0 }}
                                        className="bg-dark/20 backdrop-blur-sm rounded-lg border border-white/5 p-3 flex items-center justify-between"
                                      >
                                        <div className="flex items-center gap-3">
                                          <RiFileList3Line className="text-primary text-xl" />
                                          <div>
                                            <p className="font-medium text-sm">{resource.name}</p>
                                            <p className="text-xs text-gray-400">{resource.size}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              toggleSaveResource(resource.name);
                                            }}
                                            className="p-1.5 rounded-lg hover:bg-dark/50"
                                          >
                                            {savedResources.includes(resource.name) ? (
                                              <RiBookmarkFill className="text-primary" />
                                            ) : (
                                              <RiBookmarkLine />
                                            )}
                                          </motion.button>
                                          <motion.a
                                            href={resource.url}
                                            download
                                            onClick={(e) => e.stopPropagation()}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-1.5 rounded-lg hover:bg-dark/50"
                                          >
                                            <RiDownloadLine />
                                          </motion.a>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
} 