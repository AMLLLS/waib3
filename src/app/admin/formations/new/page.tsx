"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiSaveLine, RiCloseLine, RiImageAddLine, RiTimeLine, 
  RiFileTextLine, RiAddLine, RiDeleteBinLine, RiVideoAddLine,
  RiUserLine, RiHashtag, RiCheckLine
} from 'react-icons/ri';
import { FormationApi, ChapterApi } from '@/services/apiService';
import { IFormation, IModule, IResource, IInstructor } from '@/models/Formation';
import { IChapter } from '@/models/Chapter';

interface FormationFormData extends Omit<IFormation, '_id' | 'chapterId'> {
  chapter: string;
}

export default function NewFormationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [formData, setFormData] = useState<FormationFormData>({
    title: '',
    description: '',
    chapter: '',
    content: '',
    duration: '',
    status: 'draft',
    order: 0,
    level: 'Débutant',
    category: 'Formation',
    instructor: {
      name: '',
      role: '',
      avatar: ''
    },
    tags: [],
    modules: [],
    resources: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const [newModule, setNewModule] = useState<Partial<IModule>>({
    title: '',
    duration: '',
    videoUrl: ''
  });

  const [newResource, setNewResource] = useState<Partial<IResource>>({
    name: '',
    size: '',
    url: ''
  });

  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const loadChapters = async () => {
      try {
        const loadedChapters = await ChapterApi.getAll();
        setChapters(loadedChapters);
      } catch (error) {
        console.error('Erreur lors du chargement des chapitres:', error);
      }
    };

    loadChapters();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formationToCreate: Partial<IFormation> = {
        ...formData,
        chapterId: formData.chapter,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      delete (formationToCreate as any).chapter;

      await FormationApi.create(formationToCreate);
      setShowSuccess(true);
      
      // Attendre que l'animation soit terminée avant de rediriger
      setTimeout(() => {
        router.push('/admin/formations');
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de la création de la formation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInstructorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      instructor: {
        ...prev.instructor,
        [name]: value
      }
    }));
  };

  const handleAddModule = () => {
    if (newModule.title && newModule.duration && newModule.videoUrl) {
      setFormData(prev => ({
        ...prev,
        modules: [
          ...prev.modules,
          {
            id: prev.modules.length + 1,
            title: newModule.title!,
            duration: newModule.duration!,
            videoUrl: newModule.videoUrl!,
            completed: false
          }
        ]
      }));

      setNewModule({ title: '', duration: '', videoUrl: '' });
    }
  };

  const handleAddResource = () => {
    if (newResource.name && newResource.url) {
      setFormData(prev => ({
        ...prev,
        resources: [
          ...prev.resources,
          {
            name: newResource.name!,
            size: newResource.size || '0 KB',
            url: newResource.url!
          }
        ]
      }));

      setNewResource({ name: '', size: '', url: '' });
    }
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));

      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleRemoveModule = (moduleId: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter(m => m.id !== moduleId)
    }));
  };

  const handleRemoveResource = (resourceName: string) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter(r => r.name !== resourceName)
    }));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Message de succès */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50"
          >
            <RiCheckLine className="text-xl" />
            <span>Formation créée avec succès!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Nouvelle formation</h1>
          <p className="text-gray-400">
            Créez une nouvelle formation pour vos étudiants.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/admin/formations')}
            className="px-4 py-2 bg-dark/50 text-gray-400 rounded-xl flex items-center gap-2 hover:text-white transition-colors"
          >
            <RiCloseLine className="text-xl" />
            <span>Annuler</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isLoading || showSuccess}
            className={`px-4 py-2 bg-primary text-dark font-medium rounded-xl flex items-center gap-2 ${
              (isLoading || showSuccess) ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            <RiSaveLine className="text-xl" />
            <span>{isLoading ? 'Enregistrement...' : 'Enregistrer'}</span>
          </motion.button>
        </div>
      </div>

      {/* Formulaire */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonne principale */}
        <div className="space-y-6">
          {/* Informations de base */}
          <div className="bg-dark/50 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-bold">Informations de base</h2>
            
            {/* Titre */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-2">
                Titre de la formation
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
                placeholder="Entrez le titre de la formation"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
                placeholder="Décrivez votre formation"
                required
              />
            </div>

            {/* Contenu */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-400 mb-2">
                Contenu
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={8}
                className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
                placeholder="Contenu de la formation (Markdown supporté)"
                required
              />
            </div>
          </div>

          {/* Modules */}
          <div className="bg-dark/50 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-bold">Modules</h2>
            
            {/* Liste des modules */}
            <div className="space-y-4">
              {formData.modules.map((module) => (
                <div 
                  key={module.id}
                  className="flex items-center justify-between p-4 bg-dark/50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{module.title}</h3>
                    <p className="text-sm text-gray-400">{module.duration}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveModule(module.id)}
                    className="p-2 hover:bg-dark/50 rounded-lg text-gray-400 hover:text-red-500"
                  >
                    <RiDeleteBinLine />
                  </motion.button>
                </div>
              ))}
            </div>

            {/* Ajouter un module */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newModule.title}
                  onChange={(e) => setNewModule(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titre du module"
                  className="px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
                />
                <input
                  type="text"
                  value={newModule.duration}
                  onChange={(e) => setNewModule(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="Durée (ex: 30min)"
                  className="px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
                />
              </div>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newModule.videoUrl}
                  onChange={(e) => setNewModule(prev => ({ ...prev, videoUrl: e.target.value }))}
                  placeholder="URL de la vidéo"
                  className="flex-1 px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddModule}
                  className="px-4 py-2 bg-primary text-dark font-medium rounded-xl flex items-center gap-2"
                >
                  <RiVideoAddLine />
                  <span>Ajouter</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Ressources */}
          <div className="bg-dark/50 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-bold">Ressources</h2>
            
            {/* Liste des ressources */}
            <div className="space-y-4">
              {formData.resources.map((resource) => (
                <div 
                  key={resource.name}
                  className="flex items-center justify-between p-4 bg-dark/50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{resource.name}</h3>
                    <p className="text-sm text-gray-400">{resource.size}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveResource(resource.name)}
                    className="p-2 hover:bg-dark/50 rounded-lg text-gray-400 hover:text-red-500"
                  >
                    <RiDeleteBinLine />
                  </motion.button>
                </div>
              ))}
            </div>

            {/* Ajouter une ressource */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newResource.name}
                  onChange={(e) => setNewResource(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom de la ressource"
                  className="px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
                />
                <input
                  type="text"
                  value={newResource.size}
                  onChange={(e) => setNewResource(prev => ({ ...prev, size: e.target.value }))}
                  placeholder="Taille (ex: 1.2 MB)"
                  className="px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
                />
              </div>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newResource.url}
                  onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="URL de la ressource"
                  className="flex-1 px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddResource}
                  className="px-4 py-2 bg-primary text-dark font-medium rounded-xl flex items-center gap-2"
                >
                  <RiAddLine />
                  <span>Ajouter</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Paramètres de la formation */}
          <div className="bg-dark/50 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-bold">Paramètres</h2>

            {/* Image de couverture */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Image de couverture
              </label>
              <div className="aspect-video bg-dark/50 border border-white/5 rounded-xl flex items-center justify-center cursor-pointer hover:bg-dark/70 transition-colors">
                <div className="text-center">
                  <RiImageAddLine className="text-3xl text-gray-400 mx-auto mb-2" />
                  <span className="text-sm text-gray-400">
                    Cliquez pour ajouter une image
                  </span>
                </div>
              </div>
            </div>

            {/* Chapitre */}
            <div>
              <label htmlFor="chapter" className="block text-sm font-medium text-gray-400 mb-2">
                Chapitre
              </label>
              <select
                id="chapter"
                name="chapter"
                value={formData.chapter}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
                required
              >
                <option value="">Sélectionnez un chapitre</option>
                {chapters.map((chapter) => (
                  <option key={chapter._id?.toString()} value={chapter._id?.toString()}>
                    {chapter.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Durée */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-400 mb-2">
                Durée estimée
              </label>
              <div className="relative">
                <RiTimeLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
                  placeholder="Ex: 2h30"
                  required
                />
              </div>
            </div>

            {/* Niveau */}
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-400 mb-2">
                Niveau
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
                required
              >
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
              </select>
            </div>

            {/* Catégorie */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-400 mb-2">
                Catégorie
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
                required
              />
            </div>

            {/* Statut */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-400 mb-2">
                Statut
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
                required
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </div>

            {/* Ordre */}
            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-400 mb-2">
                Ordre d'affichage
              </label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
                min="0"
                required
              />
            </div>
          </div>

          {/* Informations sur l'instructeur */}
          <div className="bg-dark/50 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-bold">Instructeur</h2>

            <div>
              <label htmlFor="instructor-name" className="block text-sm font-medium text-gray-400 mb-2">
                Nom
              </label>
              <input
                type="text"
                id="instructor-name"
                name="name"
                value={formData.instructor.name}
                onChange={handleInstructorChange}
                className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
                required
              />
            </div>

            <div>
              <label htmlFor="instructor-role" className="block text-sm font-medium text-gray-400 mb-2">
                Rôle
              </label>
              <input
                type="text"
                id="instructor-role"
                name="role"
                value={formData.instructor.role}
                onChange={handleInstructorChange}
                className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
                required
              />
            </div>

            <div>
              <label htmlFor="instructor-avatar" className="block text-sm font-medium text-gray-400 mb-2">
                Avatar URL
              </label>
              <input
                type="text"
                id="instructor-avatar"
                name="avatar"
                value={formData.instructor.avatar}
                onChange={handleInstructorChange}
                className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
                required
              />
            </div>
          </div>

          {/* Tags */}
          <div className="bg-dark/50 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-bold">Tags</h2>

            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-2 px-3 py-1 bg-dark/50 rounded-full"
                >
                  <span>{tag}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <RiCloseLine />
                  </motion.button>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Nouveau tag"
                className="flex-1 px-4 py-2 bg-dark/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddTag}
                className="px-4 py-2 bg-primary text-dark font-medium rounded-xl flex items-center gap-2"
              >
                <RiHashtag />
                <span>Ajouter</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 