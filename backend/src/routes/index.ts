// import express from 'express';
// import authRoutes from './auth';
// import userRoutes from './users';
// import adminRoutes from './admin';
// import healthRoutes from './health.routes';

// const router = express.Router();

// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/admin', adminRoutes);
// router.use('/health', healthRoutes);


// export default router;


import express from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import adminRoutes from './admin';
import healthRoutes from './health.routes';

// Main API router mounted under /api/v1
export const MainRouter = express.Router();

// Mount sub-routers
MainRouter.use('/', authRoutes);
MainRouter.use('/', userRoutes);
MainRouter.use('/', adminRoutes);
MainRouter.use('/', healthRoutes);

// Keep default export for backward compatibility if imported elsewhere
export default MainRouter;