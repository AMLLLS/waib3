"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiTimeLine, RiPlayCircleLine, RiStarLine, RiSearchLine,
  RiFilter3Line, RiArrowRightLine, RiBookmarkLine,
  RiFireLine, RiTrophyLine, RiBarChartBoxLine
} from 'react-icons/ri';
import ClientOnly from '@/components/animations/ClientOnly';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const chapters = [
  {
    id: 1,
    title: "Installation et Configuration",
    description: "Mettez en place votre environnement de design",
    progress: 65,
    formations: [
      {
        id: 1,
        title: "Configuration de Figma",
        description: "Installez et configurez Figma pour une utilisation professionnelle",
        duration: "45min",
        level: "Débutant",
        progress: 100,
        image: "/formations/figma-setup.jpg",
        category: "Installation",
        rating: 4.8,
        students: 1234,
        isCompleted: true
      },
      {
        id: 2,
        title: "Plugins essentiels",
        description: "Découvrez les plugins indispensables pour votre workflow",
        duration: "1h 15min",
        level: "Débutant",
        progress: 30,
        image: "/formations/plugins.jpg",
        category: "Installation",
        rating: 4.9,
        students: 856,
        isCompleted: false
      }
    ]
  },
  {
    id: 2,
    title: "Fondamentaux du Design",
    description: "Maîtrisez les bases du design d'interface",
    progress: 0,
    formations: [
      {
        id: 3,
        title: "Théorie des couleurs",
        description: "Comprenez et appliquez la théorie des couleurs dans vos designs",
        duration: "2h 30min",
        level: "Débutant",
        progress: 0,
        image: "/formations/color-theory.jpg",
        category: "Fondamentaux",
        rating: 4.9,
        students: 2156,
        isCompleted: false
      },
      {
        id: 4,
        title: "Typographie UI",
        description: "Maîtrisez l'art de la typographie dans l'interface utilisateur",
        duration: "1h 45min",
        level: "Débutant",
        progress: 0,
        image: "/formations/typography.jpg",
        category: "Fondamentaux",
        rating: 4.7,
        students: 1893,
        isCompleted: false
      }
    ]
  }
];

export default function FormationsPage() {
  const router = useRouter();
  const [selectedChapter, setSelectedChapter] = useState(chapters[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleFormationClick = (chapterId: number, formationId: number) => {
    router.push(`/dashboard/formations/${chapterId}/${formationId}`);
  };

  // Calculer les statistiques globales
  const totalFormations = chapters.reduce((acc, chapter) => acc + chapter.formations.length, 0);
  const completedFormations = chapters.reduce((acc, chapter) => 
    acc + chapter.formations.filter(f => f.isCompleted).length, 0
  );
  const totalDuration = chapters.reduce((acc, chapter) => 
    acc + chapter.formations.reduce((sum, f) => sum + parseInt(f.duration), 0), 0
  );
  const overallProgress = Math.round((completedFormations / totalFormations) * 100);

  return (
    <ClientOnly>
      <div className="space-y-8 p-4 sm:p-6 md:p-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-dark-lighter p-6 sm:p-8">
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Mes formations</h1>
                <p className="text-gray-400">Continuez votre apprentissage</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-primary text-dark rounded-lg font-medium flex items-center space-x-2"
                >
                  <RiPlayCircleLine className="text-xl" />
                  <span>Reprendre</span>
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { 
                  icon: RiTimeLine, 
                  label: "Temps total", 
                  value: `${Math.round(totalDuration)}h`,
                  color: "from-blue-500/20 to-blue-600/20" 
                },
                { 
                  icon: RiFireLine, 
                  label: "Chapitre actuel", 
                  value: `Chapitre ${selectedChapter.id}`,
                  color: "from-orange-500/20 to-orange-600/20"
                },
                { 
                  icon: RiTrophyLine, 
                  label: "Formations complétées", 
                  value: `${completedFormations}/${totalFormations}`,
                  color: "from-green-500/20 to-green-600/20"
                },
                { 
                  icon: RiBarChartBoxLine, 
                  label: "Progression globale", 
                  value: `${overallProgress}%`,
                  color: "from-purple-500/20 to-purple-600/20"
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-dark/50 backdrop-blur-sm rounded-xl p-4 border border-white/5"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon className="text-2xl text-white" />
                  </div>
                  <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl transform -translate-x-1/2 translate-y-1/2" />
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

        {/* Navigation des chapitres */}
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
          <div className="flex space-x-2">
            {chapters.map((chapter) => (
              <motion.button
                key={chapter.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedChapter(chapter)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedChapter.id === chapter.id
                    ? 'bg-primary text-dark font-medium'
                    : 'bg-dark/50 text-gray-400 hover:bg-dark/70'
                }`}
              >
                Chapitre {chapter.id}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Chapitre actuel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Chapitre {selectedChapter.id} : {selectedChapter.title}</h2>
              <p className="text-gray-400 text-sm mt-1">{selectedChapter.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Progression :</span>
              <span className="text-primary font-medium">{selectedChapter.progress}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {selectedChapter.formations.map((formation) => (
              <motion.div
                key={formation.id}
                whileHover={{ scale: 1.01 }}
                className="group bg-dark/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5"
              >
                <div className="relative aspect-[2/1] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent z-10" />
                  <img 
                    src={formation.image} 
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
                          onClick={() => handleFormationClick(selectedChapter.id, formation.id)}
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
                      onClick={() => handleFormationClick(selectedChapter.id, formation.id)}
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
            {chapters.filter(c => c.id > selectedChapter.id).map((chapter) => (
              <motion.div
                key={chapter.id}
                whileHover={{ scale: 1.01 }}
                className="group bg-dark/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 bg-dark/50 text-gray-400 text-xs rounded-lg">
                      Chapitre {chapter.id}
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
    </ClientOnly>
  );
} 