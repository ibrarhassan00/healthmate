import express from 'express';
import {
    addVitals,
    getAllVitals,
    updateVitals,
    deleteVitals,
} from '../controllers/vitalsController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes
router.post('/add', protect, addVitals);
router.get('/all', protect, getAllVitals);
router.put('/:id', protect, updateVitals);
router.delete('/:id', protect, deleteVitals);

export default router;