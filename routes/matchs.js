import express from 'express';
import MatchController from '../controllers/matchController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/like', auth, async (req, res) => {
    MatchController.likeUser
    try {
        const like = await MatchController.likeUser(req, res);
        if(!like) {
            return res.status(500).json({ message: 'Failed to like user' });
        }
        if(like.match) {
            broadcastMessage({newMatch: like});
        }
        res.status(201).json(like);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/list', auth, MatchController.listMatches);
router.post('/unmatch/:matchId', auth, MatchController.unmatchUser);

export default router;
