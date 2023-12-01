import express from 'express';
import MatchController from '../controllers/matchController.js';
import { auth } from '../middleware/authMiddleware.js';
import { broadcastMessage } from '../config/ws.js';

const router = express.Router();

router.post('/like', auth, async (req, res) => {
    try {
        const like = await MatchController.likeUser(req, res);
        if(!like) {
            return res.status(500).json({ message: 'Failed to like user' });
        }
        let responseMessage = '';
        const isMatched = JSON.parse(JSON.stringify(like)).hasOwnProperty('users');
        if(isMatched) {
            broadcastMessage({newMatch: like});
            responseMessage = 'Match créé avec succès!';
        } else {
            responseMessage = 'Like créé avec succès!';
        }
        res.status(201).json({ message: responseMessage, like});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/list', auth, MatchController.listMatches);
router.post('/unmatch/:matchId', auth, MatchController.unmatchUser);

export default router;