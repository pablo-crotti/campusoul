import express from 'express';
import MatchController from '../controllers/matchController.js';

const router = express.Router();

router.post('/like', MatchController.likeUser);
router.get('/list', MatchController.listMatches);
router.post('/unmatch/:matchId', MatchController.unmatchUser);

export default router;
