

import express from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import adminRoutes from './admin';
import healthRoutes from './health.routes';
import studentRoutes from './student';

// Main API router mounted under /api/v1
export const MainRouter = express.Router();

// Mount sub-routers
MainRouter.use('/', authRoutes);
MainRouter.use('/', userRoutes);
MainRouter.use('/', adminRoutes);
MainRouter.use('/', healthRoutes);
MainRouter.use('/', studentRoutes )
// Keep default export for backward compatibility if imported elsewhere
export default MainRouter;


