import express from 'express';
import { login, getMe, updateProfile, changePassword, forgotPassword, resetPassword, validateResetToken } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { urls } from '../constants/urls';

const router = express.Router();

// Your existing auth routes remain exactly the same
router.post(urls.auth.login().path, login);
router.post(urls.auth.forgotPassword().path, forgotPassword);
router.post(urls.auth.resetPassword().path, resetPassword);
router.post(urls.auth.validateResetToken().path, validateResetToken);
router.get(urls.auth.me().path, authenticate, getMe);
router.put(urls.auth.profile().path, authenticate, updateProfile);
router.put(urls.auth.changePassword().path, authenticate, changePassword);

export default router;

