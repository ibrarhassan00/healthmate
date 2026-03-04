import express from 'express';
import multer from 'multer';
import {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword,
    updateProfile,
    uploadProfileImage,
    getMe,
} from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';

const router = express.Router();

// ============================================
// Public Routes – Koi bhi access kar sakta hai
// ============================================
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// ============================================
// Protected Routes – Sirf logged in user
// ============================================
router.post('/logout', protect, logout);
router.put('/update-password', protect, updatePassword);
router.put('/update-profile', protect, updateProfile);
router.put('/upload-image', protect, upload.single('image'), uploadProfileImage);
router.get('/me', protect, getMe);

export default router;