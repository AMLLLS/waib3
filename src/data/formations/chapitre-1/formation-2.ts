export const formation = {
  id: 2,
  chapterId: 1,
  chapter: {
    id: 1,
    title: "Installation et Configuration"
  },
  title: "Plugins essentiels",
  description: "Découvrez les plugins indispensables pour votre workflow",
  duration: "1h 15min",
  level: "Débutant",
  progress: 30,
  image: "/formations/plugins.jpg",
  category: "Installation",
  rating: 4.9,
  students: 856,
  isCompleted: false,
  instructor: {
    name: "Sarah Martin",
    role: "Senior UI/UX Designer",
    avatar: "/instructors/sarah.jpg"
  },
  tags: ["Figma", "Plugins", "Workflow"],
  chapters: [
    {
      id: 1,
      title: "Introduction aux plugins",
      duration: "15min",
      completed: true,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: 2,
      title: "Installation des plugins",
      duration: "20min",
      completed: true,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: 3,
      title: "Plugins de productivité",
      duration: "25min",
      completed: false,
      current: true,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: 4,
      title: "Plugins de design",
      duration: "15min",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
  ],
  resources: [
    { name: "Liste des plugins.pdf", size: "1.5 MB", url: "/resources/liste-plugins.pdf" },
    { name: "Guide d'utilisation.pdf", size: "2.1 MB", url: "/resources/guide-plugins.pdf" }
  ]
}; 