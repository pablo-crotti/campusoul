import express from 'express';
import MatchController from '../controllers/matchController.js';

const router = express.Router();

// Route pour liker un utilisateur
router.post('/like', authenticate, MatchController.likeUser);

// Route pour lister tous les matchs d'un utilisateur
router.get('/list', authenticate, MatchController.listMatches);

// Route pour dissoudre un match
router.post('/unmatch/:matchId', authenticate, MatchController.unmatchUser);

export default router;
