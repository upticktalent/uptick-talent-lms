

import { PrismaClient,  } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error'] 
    : ['error'],
});

(async () => {
  try {
    await prisma.$connect();
    console.log('✅ Prisma is ready and connected to MongoDB');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB via Prisma:', error);
    process.exit(1);
  }
})();

export default prisma;
