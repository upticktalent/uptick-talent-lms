import express from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import adminRoutes from './admin';
import healthRoutes from './health.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/health', healthRoutes);


export default router;