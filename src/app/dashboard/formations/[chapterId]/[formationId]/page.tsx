'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  RiTimeLine, RiStarLine, RiPlayCircleLine, 
  RiBookmarkLine, RiBookmarkFill, RiCheckLine,
  RiDownloadLine, RiShareLine, RiArrowLeftLine,
  RiChat3Line, RiStickyNoteLine, RiVideoLine,
  RiRoadMapLine
} from 'react-icons/ri';
import ClientOnly from '@/components/animations/ClientOnly';
import { FormationApi } from '@/services/apiService';
import { IFormation } from '@/models/Formation';
import { WithClientId, toClientDocument } from '@/types/mongodb';

interface PageProps {
  params: {
    chapterId: string;
    formationId: string;
  };
}

interface FormationWithProgress extends WithClientId<IFormation> {
  progress: number;
  rating: number;
  students: number;
  isCompleted: boolean;
  chapter: {
    id: string;
    title: string;
  };
  modules: {
    id: number;
    title: string;
    duration: string;
    videoUrl: string;
    completed: boolean;
    current?: boolean;
  }[];
  resources: {
    name: string;
    size: string;
    url: string;
  }[];
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
}

const DEFAULT_COVER_IMAGE = '/images/formation-cover-default.jpg';

export default function FormationPage({ params }: PageProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [notes, setNotes] = useState<{ id: number; text: string; timestamp: string }[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [formation, setFormation] = useState<FormationWithProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFormation = async () => {
      try {
        setIsLoading(true);
        const data = await FormationApi.getById(params.formationId);
        if (data) {
          const clientFormation = toClientDocument(data);
          setFormation({
            ...clientFormation,
            progress: 0, // À implémenter avec le système de progression
            rating: 4.5, // À implémenter avec le système de notation
            students: 0, // À implémenter avec le système d'inscriptions
            isCompleted: false, // À implémenter avec le système de progression
            chapter: {
              id: params.chapterId,
              title: 'Chapitre en cours' // À remplacer par le vrai titre du chapitre
            },
            modules: [], // À implémenter avec le système de modules
            resources: [], // À implémenter avec le système de ressources
            instructor: {
              name: 'Instructeur',
              role: 'Expert UI/UX',
              avatar: '/images/default-avatar.jpg'
            },
            tags: [] // À implémenter avec le système de tags
          });
        } else {
          router.push('/dashboard/formations');
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la formation:', error);
        router.push('/dashboard/formations');
      } finally {
        setIsLoading(false);
      }
    };

    loadFormation();
  }, [params.formationId, params.chapterId, router]);

  if (isLoading || !formation) {
    return (
      <ClientOnly>
        <div className="min-h-screen p-4 sm:p-6">
          <div className="space-y-6 sm:space-y-8">
            {/* Skeleton pour le bloc principal */}
            <div className="h-[400px] sm:h-auto sm:aspect-[21/9] bg-dark-lighter rounded-xl sm:rounded-2xl overflow-hidden animate-pulse">
              <div className="h-full bg-dark/50" />
            </div>

            {/* Skeleton pour le contenu */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-12 bg-dark/50 rounded-xl animate-pulse" />
                <div className="h-64 bg-dark/50 rounded-xl animate-pulse" />
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-dark/50 rounded-xl animate-pulse" />
                <div className="h-32 bg-dark/50 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>
    );
  }

  const addNote = () => {
    if (currentNote.trim()) {
      setNotes(prev => [...prev, {
        id: Date.now(),
        text: currentNote,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setCurrentNote('');
    }
  };

  const handlePlayVideo = (videoUrl: string) => {
    setCurrentVideoUrl(videoUrl);
    setShowVideoPreview(true);
  };

  return (
    <ClientOnly>
      <div className="p-4 sm:p-6 overflow-x-hidden">
        <div className="space-y-8">
          {/* Back Button */}
          <motion.button
            onClick={() => router.push('/dashboard/formations')}
            className="mb-4 sm:mb-6 flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-dark/50 backdrop-blur rounded-lg hover:bg-dark/70 transition-colors group"
            whileHover={{ x: -5 }}
          >
            <RiArrowLeftLine className="text-lg sm:text-xl transition-transform group-hover:-translate-x-1" />
            <span className="text-sm sm:text-base">Retour aux formations</span>
          </motion.button>

          {/* Hero Section */}
          <div className="relative h-[400px] sm:h-auto sm:aspect-[21/9] rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-8">
            <img
              src={formation.coverImage || DEFAULT_COVER_IMAGE}
              alt={formation.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = DEFAULT_COVER_IMAGE;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
            
            {/* Video Preview Button - Position fixe */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-16 sm:h-16 md:w-20 md:h-20">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePlayVideo(formation.modules[0]?.videoUrl || '')}
                className="w-full h-full bg-primary/20 backdrop-blur-sm text-primary rounded-full flex items-center justify-center border-2 border-primary group hover:bg-primary hover:text-dark transition-colors z-20"
              >
                <RiPlayCircleLine className="text-3xl sm:text-3xl md:text-4xl transition-transform group-hover:scale-110" />
              </motion.button>
            </div>
            
            {/* Contenu - Séparé en deux parties */}
            <div className="absolute inset-x-0 top-0 p-6 sm:p-6 md:p-8">
              <div className="flex flex-col gap-4 sm:gap-4">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm">
                      Chapitre {formation.chapter.id} : {formation.chapter.title}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-2xl md:text-4xl font-bold mb-3">{formation.title}</h1>
                  <p className="text-gray-300 text-base sm:text-base md:text-lg line-clamp-3 md:line-clamp-none">
                    {formation.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Badges en bas */}
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3 sm:gap-3 md:gap-6">
                <span className="flex items-center gap-2 bg-dark/80 backdrop-blur rounded-full px-3 py-1.5 text-sm">
                  <RiTimeLine className="text-primary text-base" />
                  {formation.duration}
                </span>
                <span className="flex items-center gap-2 bg-dark/80 backdrop-blur rounded-full px-3 py-1.5 text-sm">
                  <RiStarLine className="text-primary text-base" />
                  {formation.rating}
                </span>
                <span className="px-3 py-1.5 bg-primary/20 text-primary rounded-full text-sm">
                  {formation.level}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotes(!showNotes)}
                  className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-dark/50 backdrop-blur rounded-lg hover:bg-dark/70 transition-colors text-sm sm:text-base border border-white/5"
                >
                  <RiStickyNoteLine className="text-lg sm:text-xl" />
                  <span>Mes notes</span>
                  {notes.length > 0 && (
                    <span className="w-4 h-4 sm:w-5 sm:h-5 bg-primary text-dark rounded-full text-xs flex items-center justify-center">
                      {notes.length}
                    </span>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-dark/50 backdrop-blur rounded-lg hover:bg-dark/70 transition-colors text-sm sm:text-base border border-white/5"
                >
                  <RiChat3Line className="text-lg sm:text-xl" />
                  <span>Commentaires</span>
                  <span className="w-4 h-4 sm:w-5 sm:h-5 bg-primary text-dark rounded-full text-xs flex items-center justify-center">
                    24
                  </span>
                </motion.button>
              </div>

              {/* Notes Panel */}
              <AnimatePresence>
                {showNotes && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-dark/50 backdrop-blur rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/5">
                      <h3 className="text-lg sm:text-xl font-bold">Mes notes</h3>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={currentNote}
                          onChange={(e) => setCurrentNote(e.target.value)}
                          placeholder="Ajouter une note..."
                          className="flex-1 bg-dark/50 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 outline-none focus:ring-2 ring-primary/50 text-sm sm:text-base"
                          onKeyPress={(e) => e.key === 'Enter' && addNote()}
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={addNote}
                          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary text-dark rounded-lg font-medium text-sm sm:text-base"
                        >
                          Ajouter
                        </motion.button>
                      </div>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {notes.map((note) => (
                          <div key={note.id} className="bg-dark/50 rounded-lg p-3 sm:p-4">
                            <p className="text-sm sm:text-base">{note.text}</p>
                            <p className="text-xs sm:text-sm text-gray-400 mt-2">{note.timestamp}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress Section */}
              <div className="bg-dark/50 backdrop-blur rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg sm:text-xl font-bold">Progression du cours</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-12 sm:w-16 h-12 sm:h-16 relative">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.1)"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#D1F34A"
                          strokeWidth="3"
                          strokeDasharray={`${formation.progress}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-bold text-sm sm:text-base">
                        {formation.progress}%
                      </div>
                    </div>
                    <div className="hidden sm:block text-sm text-gray-400">
                      <p>{Math.round(formation.modules.filter(m => m.completed).length / formation.modules.length * 100)}% complété</p>
                      <p>{formation.modules.filter(m => m.completed).length}/{formation.modules.length} modules</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {formation.modules.map((module) => (
                    <div 
                      key={module.id}
                      className={`p-4 rounded-lg transition-colors ${
                        module.current 
                          ? 'bg-primary/20 border border-primary/30' 
                          : 'bg-dark/50 hover:bg-dark/70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            module.completed 
                              ? 'bg-primary text-dark' 
                              : module.current 
                                ? 'bg-primary/20 text-primary' 
                                : 'bg-dark/70'
                          }`}>
                            {module.completed ? (
                              <RiCheckLine className="text-xl" />
                            ) : (
                              <span>{module.id}</span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{module.title}</h3>
                            <p className="text-sm text-gray-400">{module.duration}</p>
                          </div>
                        </div>
                        {module.current && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePlayVideo(module.videoUrl)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-dark rounded-lg font-medium"
                          >
                            <RiPlayCircleLine className="text-xl" />
                            Continuer
                          </motion.button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources Section */}
              <div className="bg-dark/50 backdrop-blur rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/5">
                <h2 className="text-xl font-bold mb-6">Ressources</h2>
                <div className="space-y-4">
                  {formation.resources.map((resource, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 bg-dark/50 rounded-lg hover:bg-dark/70 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/20 text-primary rounded-lg flex items-center justify-center">
                          <RiDownloadLine className="text-xl" />
                        </div>
                        <div>
                          <h3 className="font-medium">{resource.name}</h3>
                          <p className="text-sm text-gray-400">{resource.size}</p>
                        </div>
                      </div>
                      <motion.a
                        href={resource.url}
                        download
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-dark/70 hover:bg-dark rounded-lg transition-colors"
                      >
                        Télécharger
                      </motion.a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Instructor Card */}
              <div className="bg-dark/50 backdrop-blur rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/5">
                <h2 className="text-xl font-bold mb-6">Instructeur</h2>
                <div className="flex items-center gap-4">
                  <img
                    src={formation.instructor.avatar}
                    alt={formation.instructor.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-bold">{formation.instructor.name}</h3>
                    <p className="text-sm text-gray-400">{formation.instructor.role}</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-dark/50 backdrop-blur rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/5">
                <h2 className="text-xl font-bold mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {formation.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-dark/50 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Learning Path */}
              <div className="bg-dark/50 backdrop-blur rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/5">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <RiRoadMapLine className="text-primary" />
                  Parcours d'apprentissage
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary text-dark rounded-lg flex items-center justify-center">
                      <RiVideoLine className="text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{formation.title}</h3>
                      <p className="text-sm text-gray-400">Formation actuelle</p>
                    </div>
                  </div>
                  <div className="w-0.5 h-6 bg-dark/70 mx-5" />
                  <div className="flex items-center gap-4 opacity-50">
                    <div className="w-10 h-10 bg-dark/70 rounded-lg flex items-center justify-center">
                      <RiVideoLine className="text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Prochaine formation</h3>
                      <p className="text-sm text-gray-400">À venir</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Preview Modal */}
          <AnimatePresence>
            {showVideoPreview && currentVideoUrl && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
                onClick={() => setShowVideoPreview(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative w-full max-w-4xl aspect-video bg-dark rounded-xl sm:rounded-2xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <iframe
                    src={currentVideoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ClientOnly>
  );
} 