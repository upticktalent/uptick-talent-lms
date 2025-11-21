

import express from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import adminRoutes from './admin';
import healthRoutes from './health.routes';
import applicantsRoutes from './applicants.routes'
import assessmentRoutes from './assessment.routes'
import studentRoutes from  './student'

// Main API router mounted under /api/v1
export const MainRouter = express.Router();

// Mount sub-routers
MainRouter.use('/applicants', applicantsRoutes);
MainRouter.use('/', authRoutes);
MainRouter.use('/users', userRoutes);
MainRouter.use('/', adminRoutes);
MainRouter.use('/', studentRoutes )
MainRouter.use('/health', healthRoutes);
MainRouter.use('/assessment', assessmentRoutes);
// Keep default export for backward compatibility if imported elsewhere
export default MainRouter;


