'use client';

import { useState } from 'react';
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
import { getFormation } from '@/data/formations';

interface PageProps {
  params: {
    chapterId: string;
    formationId: string;
  };
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

  const formation = getFormation(parseInt(params.chapterId), parseInt(params.formationId));

  if (!formation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Formation non trouvée</h1>
        <motion.button
          onClick={() => router.push('/dashboard/formations')}
          className="px-4 py-2 bg-primary text-dark rounded-lg font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Retour aux formations
        </motion.button>
      </div>
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
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
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
        <div className="relative aspect-video sm:aspect-[21/9] rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-8">
          <img
            src={formation.image || DEFAULT_COVER_IMAGE}
            alt={formation.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = DEFAULT_COVER_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
          
          {/* Video Preview Button - Déplacé avant le contenu pour être derrière */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePlayVideo(formation.chapters[0].videoUrl)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-primary/20 backdrop-blur-sm text-primary rounded-full flex items-center justify-center border-2 border-primary group hover:bg-primary hover:text-dark transition-colors"
          >
            <RiPlayCircleLine className="text-2xl sm:text-3xl md:text-4xl transition-transform group-hover:scale-110" />
          </motion.button>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm">
                    Chapitre {formation.chapter.id} : {formation.chapter.title}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">{formation.title}</h1>
                <p className="text-gray-300 text-base md:text-lg mb-4 line-clamp-2 md:line-clamp-none">
                  {formation.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-6 text-sm">
                  <span className="flex items-center gap-2 bg-dark/80 backdrop-blur rounded-full px-3 py-1">
                    <RiTimeLine className="text-primary" />
                    {formation.duration}
                  </span>
                  <span className="flex items-center gap-2 bg-dark/80 backdrop-blur rounded-full px-3 py-1">
                    <RiStarLine className="text-primary" />
                    {formation.rating}
                  </span>
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full">
                    {formation.level}
                  </span>
                </div>
              </div>
              
              {/* Actions déplacées en haut à droite */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSaved(!isSaved)}
                  className="p-2 bg-dark/80 backdrop-blur rounded-lg hover:bg-dark transition-colors"
                >
                  {isSaved ? (
                    <RiBookmarkFill className="text-xl text-primary" />
                  ) : (
                    <RiBookmarkLine className="text-xl" />
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-dark/80 backdrop-blur rounded-lg hover:bg-dark transition-colors"
                >
                  <RiShareLine className="text-xl" />
                </motion.button>
              </div>
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
                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-dark/50 backdrop-blur rounded-lg hover:bg-dark/70 transition-colors text-sm sm:text-base"
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
                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-dark/50 backdrop-blur rounded-lg hover:bg-dark/70 transition-colors text-sm sm:text-base"
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
                  <div className="bg-dark/50 backdrop-blur rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-4">
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
            <div className="bg-dark/50 backdrop-blur rounded-lg sm:rounded-xl p-4 sm:p-6">
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
                    <p>{Math.round(formation.chapters.filter(c => c.completed).length / formation.chapters.length * 100)}% complété</p>
                    <p>{formation.chapters.filter(c => c.completed).length}/{formation.chapters.length} chapitres</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {formation.chapters.map((chapter) => (
                  <div 
                    key={chapter.id}
                    className={`p-4 rounded-lg transition-colors ${
                      chapter.current 
                        ? 'bg-primary/20 border border-primary/30' 
                        : 'bg-dark/50 hover:bg-dark/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          chapter.completed 
                            ? 'bg-primary text-dark' 
                            : chapter.current 
                              ? 'bg-primary/20 text-primary' 
                              : 'bg-dark/70'
                        }`}>
                          {chapter.completed ? (
                            <RiCheckLine className="text-xl" />
                          ) : (
                            <span>{chapter.id}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{chapter.title}</h3>
                          <p className="text-sm text-gray-400">{chapter.duration}</p>
                        </div>
                      </div>
                      {chapter.current && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePlayVideo(chapter.videoUrl)}
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
            <div className="bg-dark/50 backdrop-blur rounded-lg sm:rounded-xl p-4 sm:p-6">
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
            <div className="bg-dark/50 backdrop-blur rounded-lg sm:rounded-xl p-4 sm:p-6">
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
            <div className="bg-dark/50 backdrop-blur rounded-lg sm:rounded-xl p-4 sm:p-6">
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
            <div className="bg-dark/50 backdrop-blur rounded-lg sm:rounded-xl p-4 sm:p-6">
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
    </ClientOnly>
  );
} 