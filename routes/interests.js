import express from 'express';
import interestController from '../controllers/interestsController.js';
import { auth, authUser } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/', auth, authUser, interestController.createInterest);
router.delete('/:id', auth, authUser, interestController.deleteInterest);


export default router;
