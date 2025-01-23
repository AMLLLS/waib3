"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiTimeLine, RiPlayCircleLine, RiStarLine, RiSearchLine,
  RiFilter3Line, RiArrowRightLine, RiBookmarkLine,
  RiFireLine, RiTrophyLine, RiBarChartBoxLine, RiVideoLine,
  RiArrowDownSLine
} from 'react-icons/ri';
import ClientOnly from '@/components/animations/ClientOnly';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormationApi, ChapterApi } from '@/services/apiService';
import { IFormation } from '@/models/Formation';
import { IChapter } from '@/models/Chapter';
import { WithClientId, toClientDocuments } from '@/types/mongodb';

interface FormationWithProgress extends WithClientId<IFormation> {
  progress: number;
  rating: number;
  students: number;
  isCompleted: boolean;
}

interface ChapterWithProgress extends WithClientId<IChapter> {
  progress: number;
  formations: FormationWithProgress[];
}

export default function FormationsPage() {
  const router = useRouter();
  const [selectedChapter, setSelectedChapter] = useState<ChapterWithProgress | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [chapters, setChapters] = useState<ChapterWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Charger les formations et les chapitres depuis MongoDB
        const [formationsData, chaptersData] = await Promise.all([
          FormationApi.getAll(),
          ChapterApi.getAll()
        ]);

        // Convertir les données en format client
        const clientFormations = toClientDocuments<IFormation>(formationsData);
        const clientChapters = toClientDocuments<IChapter>(chaptersData);

        // Filtrer les formations publiées
        const publishedFormations = clientFormations.filter(f => f.status === 'published');

        // Formater les chapitres avec leurs formations et ne garder que ceux qui ont des formations publiées
        const formattedChapters: ChapterWithProgress[] = clientChapters
          .map(chapter => {
            const chapterFormations = publishedFormations
              .filter(f => f.chapterId === chapter._id)
              .map(f => ({
                ...f,
                progress: 0, // À implémenter avec le système de progression
                rating: 4.5, // À implémenter avec le système de notation
                students: 0, // À implémenter avec le système d'inscriptions
                isCompleted: false // À implémenter avec le système de progression
              }));

            return {
              ...chapter,
              progress: 0, // À calculer en fonction des formations complétées
              formations: chapterFormations
            };
          })
          .filter(chapter => chapter.formations.length > 0); // Ne garder que les chapitres qui ont des formations publiées

        setChapters(formattedChapters);
        if (formattedChapters.length > 0) {
          setSelectedChapter(formattedChapters[0]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFormationClick = (chapterId: string, formationId: string) => {
    router.push(`/dashboard/formations/${chapterId}/${formationId}`);
  };

  // Calculer les statistiques globales
  const totalFormations = chapters.reduce((acc, chapter) => acc + chapter.formations.length, 0);
  const completedFormations = chapters.reduce((acc, chapter) => 
    acc + chapter.formations.filter(f => f.isCompleted).length, 0
  );
  const totalDuration = chapters.reduce((acc, chapter) => 
    acc + chapter.formations.reduce((sum, f) => {
      const duration = f.duration ? parseInt(f.duration) : 0;
      return isNaN(duration) ? sum : sum + duration;
    }, 0), 0
  );
  const overallProgress = Math.round((completedFormations / totalFormations) * 100) || 0;

  if (!selectedChapter) {
    return (
      <ClientOnly>
        <div className="overflow-x-hidden flex items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-gray-400">Aucun chapitre disponible</h2>
            <p className="text-gray-500">Les formations seront bientôt disponibles.</p>
          </div>
        </div>
      </ClientOnly>
    );
  }

  if (isLoading) {
    return (
      <ClientOnly>
        <div className="overflow-x-hidden">
          <div className="animate-pulse space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2 h-64 bg-dark-lighter rounded-2xl"></div>
              <div className="h-64 bg-dark-lighter rounded-2xl"></div>
            </div>
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
          {/* Hero Section - Nouvelle version */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Bloc de progression principal */}
            <div className="lg:col-span-2 relative bg-dark-lighter rounded-xl sm:rounded-2xl overflow-hidden">
              <div className="relative z-10">
                <div className="relative h-full p-4 sm:p-6">
                  {/* En-tête avec titre et progression */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold mb-2">Votre parcours</h1>
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="text-primary font-medium">{overallProgress}%</span>
                        <span>de progression globale</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-4 sm:mt-0 w-full sm:w-auto px-4 py-2 bg-primary text-dark rounded-lg font-medium flex items-center justify-center gap-2"
                    >
                      <RiPlayCircleLine className="text-xl" />
                      <span>Continuer</span>
                    </motion.button>
                  </div>

                  {/* Timeline de progression */}
                  <div className="relative">
                    <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-dark/70" />
                    <div className="space-y-4">
                      {chapters.map((chapter, index) => (
                        <motion.div
                          key={chapter._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative pl-8"
                        >
                          {/* Point sur la timeline */}
                          <div className={`absolute left-0 w-4 h-4 rounded-full border-2 ${
                            chapter.progress === 100 
                              ? 'bg-primary border-primary' 
                              : chapter.progress > 0
                                ? 'bg-dark border-primary' 
                                : 'bg-dark border-white/20'
                          }`} />
                          
                          {/* Contenu du chapitre */}
                          <div className={`p-4 rounded-xl ${
                            chapter.progress > 0 ? 'bg-dark/50' : 'bg-dark/30'
                          } backdrop-blur-sm border border-white/5`}>
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium">Chapitre {index + 1}</h3>
                              <span className="text-sm text-primary">{chapter.progress}%</span>
                            </div>
                            <p className="text-sm text-gray-400 mb-3">{chapter.title}</p>
                            <div className="h-1 bg-dark/50 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${chapter.progress}%` }}
                                className="h-full bg-primary"
                                transition={{ duration: 1, delay: index * 0.2 }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dégradés décoratifs intégrés */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 via-transparent to-transparent" />
            </div>

            {/* Bloc de statistiques */}
            <div className="relative bg-dark-lighter rounded-xl sm:rounded-2xl overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between p-4 sm:p-6 pb-4">
                  <h2 className="text-xl font-bold">Vos statistiques</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowStats(!showStats)}
                    className="lg:hidden p-2 hover:bg-dark/50 rounded-lg transition-colors"
                  >
                    <motion.div
                      animate={{ rotate: showStats ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <RiArrowDownSLine className="text-xl" />
                    </motion.div>
                  </motion.button>
                </div>
                <AnimatePresence initial={false}>
                  <motion.div
                    initial={{ height: "auto" }}
                    animate={{ height: showStats ? "auto" : 0 }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`overflow-hidden lg:!h-auto`}
                  >
                    <div className="space-y-6 p-4 sm:p-6 pt-2">
                      {/* Temps total */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                          <RiTimeLine className="text-blue-500 text-2xl" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Temps total</p>
                          <p className="text-lg font-bold">{Math.round(totalDuration)}h</p>
                        </div>
                      </div>

                      {/* Formations complétées */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                          <RiTrophyLine className="text-green-500 text-2xl" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Formations complétées</p>
                          <p className="text-lg font-bold">{completedFormations}/{totalFormations}</p>
                        </div>
                      </div>

                      {/* Série actuelle */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                          <RiFireLine className="text-orange-500 text-2xl" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Série actuelle</p>
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-bold">7 jours</p>
                            <span className="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-500">+2</span>
                          </div>
                        </div>
                      </div>

                      {/* Prochaine étape */}
                      <div className="mt-8">
                        <h3 className="text-sm font-medium text-gray-400 mb-3">Prochaine étape</h3>
                        <div className="p-3 bg-dark/50 rounded-lg border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <RiVideoLine className="text-primary text-xl" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">Configuration de Figma</p>
                              <p className="text-xs text-gray-400">Chapitre 1 • Module 3</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dégradés décoratifs intégrés */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 via-transparent to-transparent" />
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative flex-1">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Rechercher une formation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50 text-white placeholder-gray-400"
              />
            </div>
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

          <div className="flex flex-col items-center text-center gap-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Développez vos compétences en design
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-400">
              Des formations de qualité pour devenir un expert UI/UX
            </p>
          </div>

          {/* Navigation des chapitres */}
          <div className="flex overflow-x-auto pb-2 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
            <div className="flex space-x-2">
              {chapters.map((chapter, index) => (
                <motion.button
                  key={chapter._id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedChapter(chapter)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedChapter._id === chapter._id
                      ? 'bg-primary text-dark font-medium'
                      : 'bg-dark/50 text-gray-400 hover:bg-dark/70'
                  }`}
                >
                  Chapitre {index + 1}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Chapitre actuel */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <div>
                <h2 className="text-xl font-bold">Chapitre {chapters.findIndex(c => c._id === selectedChapter._id) + 1} : {selectedChapter.title}</h2>
                <p className="text-gray-400 text-sm mt-1">{selectedChapter.description}</p>
              </div>
              <div className="flex items-center space-x-2 bg-dark/80 backdrop-blur-sm border border-white/5 rounded-lg px-3 py-1.5 self-start sm:self-auto">
                <span className="text-sm text-gray-400">Progression :</span>
                <span className="text-primary font-medium">{selectedChapter.progress}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {selectedChapter.formations.map((formation) => (
                <motion.div
                  key={formation._id}
                  whileHover={{ scale: 1.01 }}
                  className="group bg-dark/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5"
                >
                  <div className="relative aspect-[2/1] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent z-10" />
                    <img
                      src={formation.coverImage || '/formations/default.jpg'} 
                      alt={formation.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Progress Overlay */}
                    <div className="absolute inset-0 bg-dark/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                      <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-4">
                          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="rgba(255, 255, 255, 0.1)"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              className="text-primary"
                              strokeDasharray={`${formation.progress}, 100`}
                            />
                          </svg>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleFormationClick(selectedChapter._id, formation._id)}
                            className="absolute inset-0 flex items-center justify-center bg-primary text-dark rounded-full m-3 cursor-pointer"
                          >
                            <RiPlayCircleLine className="text-2xl" />
                          </motion.button>
                        </div>
                        <p className="text-sm text-gray-400 mb-1">Progression</p>
                        <p className="text-2xl font-bold text-primary">{formation.progress}%</p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-1 bg-primary/20 text-primary text-sm rounded-lg backdrop-blur-sm">
                          {formation.category}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-dark/50 text-white text-sm rounded-lg backdrop-blur-sm">
                            {formation.level}
                          </span>
                          <span className="px-2 py-1 bg-dark/50 text-white text-sm rounded-lg backdrop-blur-sm">
                            {formation.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">{formation.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{formation.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <RiStarLine className="text-yellow-400" />
                        <span>{formation.rating}</span>
                        <span>•</span>
                        <span>{formation.students} étudiants</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleFormationClick(selectedChapter._id, formation._id)}
                        className="px-4 py-2 bg-primary text-dark text-sm font-medium rounded-lg flex items-center space-x-2"
                      >
                        <RiPlayCircleLine className="text-lg" />
                        <span>Continuer</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Prochains chapitres */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Chapitres à venir</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {chapters
                .filter((c, i) => i > chapters.findIndex(ch => ch._id === selectedChapter._id))
                .map((chapter, index) => (
                  <motion.div
                    key={chapter._id}
                    whileHover={{ scale: 1.01 }}
                    className="group bg-dark/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-1 bg-dark/50 text-gray-400 text-xs rounded-lg">
                          Chapitre {index + 1}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-2">{chapter.title}</h3>
                      <p className="text-gray-400 text-sm">{chapter.description}</p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
} 