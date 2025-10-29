import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'amoosamson@gmail.com';
  const adminPassword = 'Name@uptick1234';

  try {
    
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    console.log('Existing admin:', existingAdmin);
    
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
        admin: {
          create: {
            email: adminEmail,
            firstName: 'Admin',
            lastName: 'User',
          }
        }
      },
      include: {
        admin: true,
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