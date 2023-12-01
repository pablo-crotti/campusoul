import express from 'express';
import interestController from '../controllers/interestsController.js';
import { auth, authAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
* Route for retrieving all interests. Requires user authentication.
* Uses the 'getAllInterests' method from the interestController.
*/
router.get('/', auth, interestController.getAllInterests);

/**
* Route for creating a new interest. Requires administrator authentication.
* Uses the 'createInterest' method from the interestController.
*/
router.post('/', authAdmin, interestController.createInterest);

/**
* Route for updating an existing interest by its ID. Requires administrator authentication.
* Uses the 'updateInterest' method from the interestController.
* 
* @param {string} id - The ID of the interest to be updated, provided in the route parameters.
*/
router.patch('/:id', authAdmin, interestController.updateInterest);

/**
* Route for deleting an existing interest by its ID. Requires administrator authentication.
* Uses the 'deleteInterest' method from the interestController.
* 
* @param {string} id - The ID of the interest to be deleted, provided in the route parameters.
*/
router.delete('/:id', authAdmin, interestController.deleteInterest);

/**
* Route for retrieving a specific interest by its ID. Requires user authentication.
* Uses the 'getInterest' method from the interestController.
* 
* @param {string} id - The ID of the interest to be retrieved, provided in the route parameters.
*/
router.get('/:id', auth, interestController.getInterest);

export default router;