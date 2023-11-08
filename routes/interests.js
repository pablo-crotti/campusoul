import express from 'express';
import interestController from '../controllers/interestsController.js';
import { auth, authUser } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/', interestController.createInterest);
router.delete('/:id', interestController.deleteInterest);


export default router;
