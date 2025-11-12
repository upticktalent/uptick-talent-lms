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
import { urls } from '../constants/urls';
import { validateCreateUser, validateUpdateUser, validatePagination } from '../middleware/validation';
import { Role } from '@prisma/client';

const router = express.Router();

// All routes protected and only accessible by ADMIN
router.use(authenticate, authorize(Role.ADMIN));

/**
 * @swagger
 * tags:
 *   name: User Management
 *   description: Admin user management endpoints
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user (Student or Mentor)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 */
router.post(urls.users.create().path, validateCreateUser, createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users with pagination
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 */
router.get(urls.users.getAll().path, validatePagination, getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 */
router.get(urls.users.getById().path, getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user information
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 */
router.put(urls.users.update().path, validateUpdateUser, updateUser);

/**
 * @swagger
 * /users/{id}/reset-password:
 *   put:
 *     summary: Reset user password (Admin only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 */
router.put(urls.users.resetPassword().path, resetUserPassword);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 */
router.delete(urls.users.delete().path, deleteUser);

export default router;