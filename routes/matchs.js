import express from 'express';
import MatchController from '../controllers/matchController.js';
import { auth } from '../middleware/authMiddleware.js';
import { broadcastMessage } from '../config/ws.js';

const router = express.Router();

/**
* Route for liking a user. Requires user authentication.
* If a match is created as a result of the like, a message is broadcasted.
* Uses the 'likeUser' method from the MatchController.
* 
* On successful like, a response message is sent indicating whether a match was created.
* 
* @param {Object} req - The HTTP request object. The liked user's ID is expected in 'req.body.toUserId'.
* @param {Object} res - The HTTP response object used for sending back the status of the like and a response message.
*/
router.post('/like', auth, async (req, res) => {
    try {
        const like = await MatchController.likeUser(req, res);
        if (!like) {
            return res.status(500).json({ message: 'Failed to like user' });
        }
        let responseMessage = '';
        const isMatched = JSON.parse(JSON.stringify(like)).hasOwnProperty('users');
        if (isMatched) {
            broadcastMessage({ newMatch: like });
            responseMessage = 'Match créé avec succès!';
        } else {
            responseMessage = 'Like créé avec succès!';
        }
        res.status(201).json({ message: responseMessage, like });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
* Route for listing user matches. Requires user authentication.
* Uses the 'listMatches' method from the MatchController.
*/
router.get('/list', auth, MatchController.listMatches);

/**
* Route for unmatching a user by a specific match ID. Requires user authentication.
* Uses the 'unmatchUser' method from the MatchController.
* 
* @param {string} matchId - The ID of the match to be dissolved, provided in the route parameters.
*/
router.post('/unmatch/:matchId', auth, MatchController.unmatchUser);

router.get('/:matchId', auth, MatchController.getMatch);

export default router;