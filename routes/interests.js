import express from 'express';
import interestController from '../controllers/interestsController.js';
import { auth, authAdmin } from '../middleware/authMiddleware.js';   

const router = express.Router();


router.post('/', authAdmin, interestController.createInterest);
router.delete('/:id', authAdmin, interestController.deleteInterest);
router.get('/', auth, interestController.getAllInterests);
router.get('/:id', auth, interestController.getInterest);

export default router;