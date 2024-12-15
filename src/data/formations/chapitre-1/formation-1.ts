export const formation = {
  id: 1,
  chapterId: 1,
  chapter: {
    id: 1,
    title: "Installation et Configuration"
  },
  title: "Configuration de Figma",
  description: "Installez et configurez Figma pour une utilisation professionnelle",
  duration: "45min",
  level: "Débutant",
  progress: 100,
  image: "/formations/figma-setup.jpg",
  category: "Installation",
  rating: 4.8,
  students: 1234,
  isCompleted: true,
  instructor: {
    name: "Sarah Martin",
    role: "Senior UI/UX Designer",
    avatar: "/instructors/sarah.jpg"
  },
  tags: ["Figma", "Installation", "Configuration"],
  chapters: [
    {
      id: 1,
      title: "Introduction à Figma",
      duration: "10min",
      completed: true,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: 2,
      title: "Installation et compte",
      duration: "15min",
      completed: true,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: 3,
      title: "Configuration initiale",
      duration: "20min",
      completed: false,
      current: true,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
  ],
  resources: [
    { name: "Guide d'installation.pdf", size: "1.2 MB", url: "/resources/guide-installation.pdf" },
    { name: "Checklist configuration.pdf", size: "0.8 MB", url: "/resources/checklist-config.pdf" }
  ]
}; 