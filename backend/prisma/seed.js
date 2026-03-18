const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database safely...');

  // Check if admin user already exists
  const adminExists = await prisma.user.findUnique({
    where: { username: 'admin' }
  });

  if (!adminExists) {
    // Create default admin user
    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
      },
    });
    console.log('✅ Admin user created (admin / password123)');
  } else {
    console.log('✅ Admin user already exists. Skipping creation.');
  }

  console.log('✅ Seed complete. Existing data preserved!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
