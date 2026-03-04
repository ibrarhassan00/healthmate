import express from 'express';
import { analyzeFile } from '../controllers/aiController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes
router.get('/analyze/:fileId', protect, analyzeFile);

export default router;