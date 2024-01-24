import express from 'express';
import MessageController from '../controllers/messageController.js';
import { auth } from '../middleware/authMiddleware.js';
import { broadcastMessage } from '../config/ws.js';

const router = express.Router();

/**
* Route for sending a message to a user. Requires user authentication.
* After sending the message, it is broadcasted to notify the recipient.
* Uses the 'sendMessage' method from the MessageController.
* 
* On successful message sending, the message is broadcasted and a response with the sent message is returned.
* 
* @param {Object} req - The HTTP request object. The message content and match ID are expected in 'req.body'.
* @param {Object} res - The HTTP response object used for sending back the status of the message sending and the sent message.
*/
router.post('/send', auth, async (req, res) => {
    try {
        const message = await MessageController.sendMessage(req, res);
        if (!message) {
            return res.status(500).json({ message: 'Failed to send message' });
        }
        broadcastMessage({ newChatMessage: message });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
* Route for retrieving messages for a specific match. Requires user authentication.
* Uses the 'getMessages' method from the MessageController.
* 
* @param {Object} req - The HTTP request object. The match ID is expected in 'req.params.matchId'.
* @param {Object} res - The HTTP response object used for sending back the requested messages or an error message.
* 
* On successful retrieval, the messages for the specified match are returned.
* If the match is not found or there are no messages, appropriate responses are sent.
* Errors during the retrieval process result in a 500 internal server error response.
*/
router.get('/:matchId', auth, MessageController.getMessages);

router.get('/last/:matchId', auth, MessageController.getLastMessage);

export default router;