import express from 'express';
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';
import { auth, userMatch } from '../middleware/authMiddleware.js';
import userValidation from '../middleware/userValidation.js';

const router = express.Router();

// Routes d'authentification
router.post('/register', userValidation.register, authController.register);
router.post('/login', userValidation.login, authController.login);

// Routes de profil d'utilisateur
router.get('', auth, userController.getAllUsers);
router.get('/:userId', auth, userController.getProfile);
router.patch('/:userId', auth, userMatch, userController.updateProfile);
router.delete('/:userId', auth, userMatch, userController.deleteProfile);

router.post('/interests', auth, userController.addInterestToUser);

router.delete('/:userId/interests/:interestId', auth, userMatch, userController.removeInterestFromUser);
router.get('/:userId/interests', auth, userController.getUserInterests);

router.post('/location/:userId', auth, userMatch, userController.setUserLocation);





export default router;
