const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = 'amoosamson@gmail.com';
  const password = 'Name@uptick1234';
  
  console.log('🚀 Creating admin...');
  
  try {
    await prisma.user.deleteMany({ where: { email } });
    const hashed = await bcrypt.hash(password, 12);
    const admin = await prisma.user.create({
      data: {
        email, password: hashed, firstName: 'Admin', lastName: 'User', role: Role.ADMIN,
        adminProfile: { create: { email, firstName: 'Admin', lastName: 'User' } }
      }
    });
    console.log('✅ Admin created!');
    console.log('Email:', email);
    console.log('Password:', password);
  } catch(e) { 
    console.error('Error:', e.message);
  } finally { 
    await prisma.$disconnect(); 
  }
}
main();