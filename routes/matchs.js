import express from 'express';
import MatchController from '../controllers/matchController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/like', auth, MatchController.likeUser);
router.get('/list', auth, MatchController.listMatches);
router.post('/unmatch/:matchId', auth, MatchController.unmatchUser);

export default router;
