import express from 'express';
import {
    uploadFile,
    getAllFiles,
    getOneFile,
    deleteFile,
} from '../controllers/fileController.js';
import protect from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';

const router = express.Router();

// Routes
router.post('/upload', protect, upload.single('file'), uploadFile);
router.get('/all', protect, getAllFiles);
router.get('/:id', protect, getOneFile);
router.delete('/:id', protect, deleteFile);

export default router;