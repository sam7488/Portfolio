const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Resetting and seeding database for Admin...');

  // Clear existing data
  await prisma.message.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create default admin user
  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
    },
  });

  console.log('✅ Admin user created (admin / password123)');
  console.log('✅ All other data cleared. Ready for your projects!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
