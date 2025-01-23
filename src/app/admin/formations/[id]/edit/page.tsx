"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  RiSaveLine, RiCloseLine, RiImageAddLine, RiTimeLine, 
  RiFileTextLine, RiAddLine, RiDeleteBinLine, RiVideoAddLine,
  RiUserLine, RiHashtag
} from 'react-icons/ri';
import { FormationApi, ChapterApi } from '@/services/apiService';
import { IFormation, IModule, IResource } from '@/models/Formation';
import { IChapter } from '@/models/Chapter';
import { WithClientId, toClientDocument, toClientDocuments } from '@/types/mongodb';
import ClientOnly from '@/components/animations/ClientOnly';

interface FormationFormData extends Omit<IFormation, '_id' | 'chapterId'> {
  chapter: string;
  chapterId: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  modules: {
    id: number;
    title: string;
    duration: string;
    videoUrl: string;
    completed: boolean;
  }[];
  resources: {
    name: string;
    size: string;
    url: string;
  }[];
  tags: string[];
}

export default function EditFormationPage() {
  const router = useRouter();
  const params = useParams();
  const formationId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [chapters, setChapters] = useState<WithClientId<IChapter>[]>([]);
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
    chapterId: '',
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
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [formationData, chaptersData] = await Promise.all([
          FormationApi.getById(formationId),
          ChapterApi.getAll()
        ]);

        if (formationData) {
          const formation = toClientDocument<IFormation>(formationData);
          const clientChapters = toClientDocuments<IChapter>(chaptersData);
          const { _id, ...formationWithoutId } = formation;

          setFormData({
            ...formationWithoutId,
            chapter: formation.chapterId,
            chapterId: formation.chapterId,
            instructor: formation.instructor || {
              name: '',
              role: '',
              avatar: ''
            },
            modules: formation.modules || [],
            resources: formation.resources || [],
            tags: formation.tags || []
          });
          setChapters(clientChapters);
        } else {
          router.push('/admin/formations');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        router.push('/admin/formations');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [formationId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formationToUpdate: Partial<IFormation> = {
        ...formData,
        chapterId: formData.chapter,
        updatedAt: new Date()
      };

      delete (formationToUpdate as any).chapter;

      await FormationApi.update(formationId, formationToUpdate);
      router.push('/admin/formations');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la formation:', error);
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

  if (isLoading) {
    return (
      <ClientOnly>
        <div className="p-4 sm:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-dark/50 rounded-lg animate-pulse" />
              <div className="h-4 w-64 bg-dark/50 rounded-lg animate-pulse" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-24 bg-dark/50 rounded-xl animate-pulse" />
              <div className="h-10 w-32 bg-dark/50 rounded-xl animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-dark/50 rounded-xl p-6 space-y-6">
                <div className="h-6 w-32 bg-dark/50 rounded-lg animate-pulse" />
                <div className="space-y-4">
                  <div className="h-24 bg-dark/50 rounded-lg animate-pulse" />
                  <div className="h-24 bg-dark/50 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-dark/50 rounded-xl p-6 space-y-6">
                <div className="h-6 w-32 bg-dark/50 rounded-lg animate-pulse" />
                <div className="space-y-4">
                  <div className="h-24 bg-dark/50 rounded-lg animate-pulse" />
                  <div className="h-24 bg-dark/50 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <div className="p-4 sm:p-6 space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Modifier la formation</h1>
            <p className="text-gray-400">
              Modifiez les informations de votre formation.
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
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-dark font-medium rounded-xl flex items-center gap-2"
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
                  className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-lg focus:outline-none focus:ring-2 ring-primary/50"
                  placeholder="Entrez le titre de la formation"
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
                  className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-lg focus:outline-none focus:ring-2 ring-primary/50"
                  placeholder="Décrivez votre formation"
                />
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
                  className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-lg focus:outline-none focus:ring-2 ring-primary/50"
                >
                  <option value="">Sélectionnez un chapitre</option>
                  {chapters.map((chapter) => (
                    <option key={chapter._id} value={chapter._id}>
                      Chapitre {chapter.order} : {chapter.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Durée */}
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-400 mb-2">
                  Durée
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-lg focus:outline-none focus:ring-2 ring-primary/50"
                  placeholder="Ex: 2h30"
                />
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
                  className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-lg focus:outline-none focus:ring-2 ring-primary/50"
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
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-lg focus:outline-none focus:ring-2 ring-primary/50"
                >
                  <option value="Formation">Formation</option>
                  <option value="Tutoriel">Tutoriel</option>
                  <option value="Workshop">Workshop</option>
                </select>
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
                  className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-lg focus:outline-none focus:ring-2 ring-primary/50"
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                </select>
              </div>
            </div>

            {/* Modules */}
            <div className="bg-dark/50 rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-bold">Modules</h2>
              
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
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRemoveModule(module.id)}
                      className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <RiDeleteBinLine className="text-xl" />
                    </motion.button>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="moduleTitle" className="block text-sm font-medium text-gray-400 mb-2">
                    Titre du module
                  </label>
                  <input
                    type="text"
                    id="moduleTitle"
                    value={newModule.title}
                    onChange={(e) => setNewModule(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-lg focus:outline-none focus:ring-2 ring-primary/50"
                    placeholder="Entrez le titre du module"
                  />
                </div>

                <div>
                  <label htmlFor="moduleDuration" className="block text-sm font-medium text-gray-400 mb-2">
                    Durée du module
                  </label>
                  <input
                    type="text"
                    id="moduleDuration"
                    value={newModule.duration}
                    onChange={(e) => setNewModule(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-lg focus:outline-none focus:ring-2 ring-primary/50"
                    placeholder="Ex: 15min"
                  />
                </div>

                <div>
                  <label htmlFor="moduleVideo" className="block text-sm font-medium text-gray-400 mb-2">
                    URL de la vidéo
                  </label>
                  <input
                    type="text"
                    id="moduleVideo"
                    value={newModule.videoUrl}
                    onChange={(e) => setNewModule(prev => ({ ...prev, videoUrl: e.target.value }))}
                    className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-lg focus:outline-none focus:ring-2 ring-primary/50"
                    placeholder="Entrez l'URL de la vidéo"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddModule}
                  className="w-full px-4 py-2 bg-primary/20 text-primary rounded-lg flex items-center justify-center gap-2"
                >
                  <RiVideoAddLine className="text-xl" />
                  <span>Ajouter un module</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Colonne secondaire */}
          <div className="space-y-6">
            {/* Ressources */}
            <div className="bg-dark/50 rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-bold">Ressources</h2>
              
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
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRemoveResource(resource.name)}
                      className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <RiDeleteBinLine className="text-xl" />
                    </motion.button>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="resourceName" className="block text-sm font-medium text-gray-400 mb-2">
                    Nom de la ressource
                  </label>
                  <input
                    type="text"
                    id="resourceName"
                    value={newResource.name}
                    onChange={(e) => setNewResource(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-lg focus:outline-none focus:ring-2 ring-primary/50"
                    placeholder="Entrez le nom de la ressource"
                  />
                </div>

                <div>
                  <label htmlFor="resourceSize" className="block text-sm font-medium text-gray-400 mb-2">
                    Taille du fichier
                  </label>
                  <input
                    type="text"
                    id="resourceSize"
                    value={newResource.size}
                    onChange={(e) => setNewResource(prev => ({ ...prev, size: e.target.value }))}
                    className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-lg focus:outline-none focus:ring-2 ring-primary/50"
                    placeholder="Ex: 2.5 MB"
                  />
                </div>

                <div>
                  <label htmlFor="resourceUrl" className="block text-sm font-medium text-gray-400 mb-2">
                    URL de la ressource
                  </label>
                  <input
                    type="text"
                    id="resourceUrl"
                    value={newResource.url}
                    onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-lg focus:outline-none focus:ring-2 ring-primary/50"
                    placeholder="Entrez l'URL de la ressource"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddResource}
                  className="w-full px-4 py-2 bg-primary/20 text-primary rounded-lg flex items-center justify-center gap-2"
                >
                  <RiFileTextLine className="text-xl" />
                  <span>Ajouter une ressource</span>
                </motion.button>
              </div>
            </div>

            {/* Instructeur */}
            <div className="bg-dark/50 rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-bold">Instructeur</h2>
              
              <div>
                <label htmlFor="instructorName" className="block text-sm font-medium text-gray-400 mb-2">
                  Nom de l'instructeur
                </label>
                <input
                  type="text"
                  id="instructorName"
                  name="name"
                  value={formData.instructor.name}
                  onChange={handleInstructorChange}
                  className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-lg focus:outline-none focus:ring-2 ring-primary/50"
                  placeholder="Entrez le nom de l'instructeur"
                />
              </div>

              <div>
                <label htmlFor="instructorRole" className="block text-sm font-medium text-gray-400 mb-2">
                  Rôle de l'instructeur
                </label>
                <input
                  type="text"
                  id="instructorRole"
                  name="role"
                  value={formData.instructor.role}
                  onChange={handleInstructorChange}
                  className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-lg focus:outline-none focus:ring-2 ring-primary/50"
                  placeholder="Ex: Expert UI/UX"
                />
              </div>

              <div>
                <label htmlFor="instructorAvatar" className="block text-sm font-medium text-gray-400 mb-2">
                  Avatar de l'instructeur
                </label>
                <input
                  type="text"
                  id="instructorAvatar"
                  name="avatar"
                  value={formData.instructor.avatar}
                  onChange={handleInstructorChange}
                  className="w-full px-4 py-2 bg-dark/50 border border-white/5 rounded-lg focus:outline-none focus:ring-2 ring-primary/50"
                  placeholder="URL de l'avatar"
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
                    className="px-3 py-1 bg-dark/50 rounded-lg flex items-center gap-2"
                  >
                    <span>{tag}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveTag(tag)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <RiCloseLine />
                    </motion.button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1 px-4 py-2 bg-dark/50 border border-white/5 rounded-lg focus:outline-none focus:ring-2 ring-primary/50"
                  placeholder="Ajouter un tag"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-primary/20 text-primary rounded-lg flex items-center gap-2"
                >
                  <RiAddLine className="text-xl" />
                  <span>Ajouter</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
} 