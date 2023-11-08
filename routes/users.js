import express from 'express';
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';
import { auth, authUser } from '../middleware/authMiddleware.js';
import userValidation from '../middleware/userValidation.js';

const router = express.Router();

// Routes d'authentification
router.post('/register', userValidation.register, authController.register);
router.post('/login', userValidation.login, authController.login);



// Routes de profil d'utilisateur
router.get('/:userId', auth, userController.getProfile);
router.put('/:userId', auth, userController.updateProfile);

router.post('/interests', auth, userController.addInterestToUser);

router.delete('/interests/:interestId', auth, userController.removeInterestFromUser);
router.get('/:userId/interests', auth, userController.getUserInterests);



export default router;
