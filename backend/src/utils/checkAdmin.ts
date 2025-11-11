import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    const email = 'amoosamson@gmail.com';
    
    console.log('🔍 Checking admin user...');
    
    const admin = await prisma.user.findUnique({
      where: { email },
      include: {
        adminProfile: true
      }
    });

    if (!admin) {
      console.log('❌ Admin user not found in database');
      console.log('📧 Email searched:', email);
      
      // Check all users in database
      const allUsers = await prisma.user.findMany({
        select: { email: true, role: true, createdAt: true }
      });
      console.log('👥 All users in database:', allUsers);
      return;
    }

    console.log('✅ Admin user found:', {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      hasAdminProfile: !!admin.adminProfile,
      createdAt: admin.createdAt
    });

    // Test password
    const testPassword = 'Name@uptick1234';
    const isPasswordValid = await bcrypt.compare(testPassword, admin.password);
    
    console.log('🔐 Password check:');
    console.log('   Input password:', testPassword);
    console.log('   Stored hash:', admin.password.substring(0, 20) + '...');
    console.log('   Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Password is incorrect');
      console.log('💡 Try using the temporary password that was generated during account creation');
    }

  } catch (error) {
    console.error('Error checking admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();