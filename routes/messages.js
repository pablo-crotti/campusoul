import express from 'express';
import MessageController from '../controllers/messageController.js';
import { auth } from '../middleware/authMiddleware.js';
import { broadcastMessage } from '../config/ws.js';

const router = express.Router();

// Envoyer un message
router.post('/send', auth, async (req, res) => {
    try {
        const message = await MessageController.sendMessage(req, res);
        if(!message) {
            return res.status(500).json({ message: 'Failed to send message' });
        }
        const targetUserIds = [req.user._id, message.receiver];

        broadcastMessage({newMessage: message}, targetUserIds);
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Récupérer les messages d'un match
router.get('/:matchId', auth, MessageController.getMessages);

export default router;
