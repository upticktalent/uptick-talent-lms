import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  resetUserPassword,
  deleteUser
} from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// All routes protected and only accessible by ADMIN
router.use(authenticate, authorize('ADMIN'));

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.put('/:id/reset-password', resetUserPassword);
router.delete('/:id', deleteUser);

export default router;