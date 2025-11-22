

import express from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import adminRoutes from './admin';
import healthRoutes from './health.routes';
import applicantsRoutes from './applicants.routes'
import assessmentRoutes from './assessment.routes'
import studentRoutes from  './student'
import mentorRoutes from './mentor'

// Main API router mounted under /api/v1
export const MainRouter = express.Router();

// Mount sub-routers
MainRouter.use('/applicants', applicantsRoutes);
MainRouter.use('/', authRoutes);
MainRouter.use('/users', userRoutes);
MainRouter.use('/', adminRoutes);
MainRouter.use('/', studentRoutes )
// Keep default export for backward compatibility if imported elsewhere
export default MainRouter;


