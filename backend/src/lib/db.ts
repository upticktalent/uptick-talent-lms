import { PrismaClient, Prisma } from '@prisma/client';
import { EnvironmentConfig } from '../constants/environment';

const globalForPrisma = global as unknown as { 
  prisma: PrismaClient | undefined 
};

// Database log configuration based on environment
const databaseLogConfig: (Prisma.LogLevel | Prisma.LogDefinition)[] = EnvironmentConfig.IS_DEVELOPMENT 
  ? ['query', 'error', 'warn'] 
  : ['error'];

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: databaseLogConfig,
});

if (!EnvironmentConfig.IS_PRODUCTION) {
  globalForPrisma.prisma = prisma;
}

export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('✅ Successfully connected to PostgreSQL database');
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
    throw error;
  }
};

export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('❌ Database health check failed:', error);
    return false;
  }
};