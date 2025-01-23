const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://amcmrlls:oEJLyz7C6Viiw30t@clusterwaib.bcaij.mongodb.net/?retryWrites=true&w=majority&appName=ClusterWaib';

async function createAdmin() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const usersCollection = db.collection('users');

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await usersCollection.findOne({ email: 'admin@waib.fr' });
    if (existingUser) {
      console.log('Admin user already exists');
      return;
    }

    // Créer le nouvel utilisateur admin
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    const adminUser = {
      email: 'admin@waib.fr',
      password: hashedPassword,
      name: 'Admin WAIB',
      role: 'admin',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await usersCollection.insertOne(adminUser);
    console.log('Admin user created successfully:', result.insertedId);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await client.close();
  }
}

createAdmin(); 