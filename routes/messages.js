import express from 'express';
import MessageController from '../controllers/messageController.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

// Envoyer un message
router.post('/send', authenticate, MessageController.sendMessage);

// Récupérer les messages d'un match
router.get('/:matchId', authenticate, MessageController.getMessages);

export default router;
