const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://waib3:waib3@cluster0.aqwgwlm.mongodb.net/waib3?retryWrites=true&w=majority';

const demoTemplates = [
  {
    title: 'Restaurant Moderne',
    description: 'Template épuré avec réservation en ligne et menu digital',
    category: 'Restauration',
    difficulty: 'Intermédiaire',
    technologies: ['React', 'Tailwind', 'Next.js'],
    imageUrl: '/templates/restaurant-1.jpg',
    demoUrl: '#',
    githubUrl: '#',
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Café & Bistrot',
    description: 'Design chaleureux pour café et petite restauration',
    category: 'Restauration',
    difficulty: 'Débutant',
    technologies: ['Vue.js', 'Tailwind', 'Nuxt.js'],
    imageUrl: '/templates/restaurant-2.jpg',
    demoUrl: '#',
    githubUrl: '#',
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Boutique Mode',
    description: 'Template e-commerce moderne avec panier et paiement intégré',
    category: 'E-commerce',
    difficulty: 'Avancé',
    technologies: ['React', 'Stripe', 'Next.js'],
    imageUrl: '/templates/ecommerce-1.jpg',
    demoUrl: '#',
    githubUrl: '#',
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Agence Créative',
    description: 'Design moderne pour agence de création',
    category: 'Agence',
    difficulty: 'Intermédiaire',
    technologies: ['React', 'GSAP', 'Next.js'],
    imageUrl: '/templates/agency-1.jpg',
    demoUrl: '#',
    githubUrl: '#',
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function migrateTemplates() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('waib3');
    const templatesCollection = db.collection('templates');

    // Supprime les templates existants
    await templatesCollection.deleteMany({});
    console.log('Existing templates deleted');

    // Insère les nouveaux templates
    const result = await templatesCollection.insertMany(demoTemplates);
    console.log(`${result.insertedCount} templates inserted into waib3.templates`);

  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

migrateTemplates().catch(console.error); 