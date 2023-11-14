import express from 'express';
import MessageController from '../controllers/messageController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Envoyer un message
router.post('/send', auth, MessageController.sendMessage);

// Récupérer les messages d'un match
router.get('/:matchId', auth, MessageController.getMessages);

export default router;
