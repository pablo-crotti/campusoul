import express from 'express';
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';
import { auth, userMatch } from '../middleware/authMiddleware.js';
import userValidation from '../middleware/userValidation.js';

const router = express.Router();

/**
* Route for user registration. Validates user input before registration.
* Uses the 'register' method from the authController.
*/
router.post('/register', userValidation.register, authController.register);

/**
* Route for user login. Validates user input before login.
* Uses the 'login' method from the authController.
*/
router.post('/login', userValidation.login, authController.login);


/**
* Route for retrieving a list of all users. Requires user authentication.
* Uses the 'getAllUsers' method from the userController.
*/
router.get('', auth, userController.getAllUsers);

/**
* Route for retrieving user profile information by ID. Requires user authentication.
* Uses the 'getProfile' method from the userController.
* 
* @param {string} userId - The ID of the user profile to be retrieved, provided in the route parameters.
*/
router.get('/:userId', auth, userController.getProfile);

/**
* Route for updating user profile information by ID. Requires user authentication and user match verification.
* Uses the 'updateProfile' method from the userController.
* 
* @param {string} userId - The ID of the user profile to be updated, provided in the route parameters.
*/
router.patch('/:userId', auth, userMatch, userController.updateProfile);

/**
* Route for deleting user profile by ID. Requires user authentication and user match verification.
* Uses the 'deleteProfile' method from the userController.
* 
* @param {string} userId - The ID of the user profile to be deleted, provided in the route parameters.
*/
router.delete('/:userId', auth, userMatch, userController.deleteProfile);

/**
* Route for adding an interest to a user's profile. Requires user authentication.
* Uses the 'addInterestToUser' method from the userController.
*/
router.post('/interests', auth, userController.addInterestToUser);

/**
* Route for removing an interest from a user's profile. Requires user authentication and user match verification.
* Uses the 'removeInterestFromUser' method from the userController.
* 
* @param {string} userId - The ID of the user whose interest is being removed, provided in the route parameters.
* @param {string} interestId - The ID of the interest to be removed, provided in the route parameters.
*/
router.delete('/:userId/interests/:interestId', auth, userMatch, userController.removeInterestFromUser);


/**
* Route for retrieving a user's interests. Requires user authentication.
* Uses the 'getUserInterests' method from the userController.
* 
* @param {string} userId - The ID of the user whose interests are being retrieved, provided in the route parameters.
*/
router.get('/:userId/interests', auth, userController.getUserInterests);

/**
* Route for setting a user's location. Requires user authentication and user match verification.
* Uses the 'setUserLocation' method from the userController.
* 
* @param {string} userId - The ID of the user whose location is being set, provided in the route parameters.
*/
router.post('/location/:userId', auth, userMatch, userController.setUserLocation);

export default router;