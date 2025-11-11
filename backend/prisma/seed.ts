import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as process from 'process';


const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || ''
  const adminPassword = process.env.ADMIN_PASSWORD || '';

  try {
    
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    
    if (existingAdmin) {
      console.log('Admin user already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: Role.ADMIN,
        adminProfile: {
          create: {
            email: adminEmail,
            firstName: 'Admin',
            lastName: 'User',
          }
        }
      },
      include: {
        adminProfile: true,
      },
    });
    console.log('Default admin user created successfully:', adminUser);
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });