const { AuthService } = require('../src/services/authService');
const { connectToDatabase } = require('../src/lib/mongodb');

async function createAdmin() {
  try {
    await connectToDatabase();
    
    const adminData = {
      email: 'admin@waib.fr',
      password: 'Admin123!',
      name: 'Admin WAIB',
      role: 'admin'
    };

    const { user } = await AuthService.register(adminData);
    console.log('Admin user created successfully:', user);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin(); 