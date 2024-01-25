import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

/**
* Middleware for authenticating users based on a JWT token. The token is expected to be
* in the 'Authorization' header of the request. Verifies the token, decodes it to find the user ID,
* and then retrieves the corresponding user from the database. If authentication is successful,
* the user and token are attached to the request object and the next middleware is called.
* If authentication fails, sends a 401 unauthorized response.
* 
* @param {Object} req - The HTTP request object, expected to contain the JWT token in the 'Authorization' header.
* @param {Object} res - The HTTP response object used for sending back an error message in case of authentication failure.
* @param {Function} next - The callback to the next middleware function in the stack.
*/
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id });

        console.log(user)

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

/**
* Middleware for authenticating administrator users based on a JWT token. The token is expected to be
* in the 'Authorization' header of the request. Verifies the token, decodes it to find the user ID,
* retrieves the corresponding user from the database, and checks if the user has admin privileges.
* If authentication and admin verification are successful, the user and token are attached to the request object,
* and the next middleware is called. If authentication fails or the user is not an admin, sends a 401 unauthorized response.
* 
* @param {Object} req - The HTTP request object, expected to contain the JWT token in the 'Authorization' header.
* @param {Object} res - The HTTP response object used for sending back an error message in case of authentication failure or lack of admin privileges.
* @param {Function} next - The callback to the next middleware function in the stack.
*/
const authAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id });

        if (!user) {
            throw new Error();
        }

        if (!user.isAdmin) {
            throw new Error();
        }

        req.token = token;
        req.user = user;

        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

/**
* Middleware for verifying that the user ID from the JWT token matches the user ID in the request parameters.
* The JWT token is expected to be in the 'Authorization' header of the request. If the user IDs match, the request
* is allowed to proceed; otherwise, a 403 forbidden response is sent. In case of missing or invalid token, sends a 401 unauthorized response.
* 
* @param {Object} req - The HTTP request object, expected to contain the JWT token in the 'Authorization' header and a user ID in the request parameters.
* @param {Object} res - The HTTP response object used for sending back an error message in case of a user ID mismatch or authentication failure.
* @param {Function} next - The callback to the next middleware function in the stack.
*/
const userMatch = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userIdFromToken = decoded._id;
        const userIdFromParam = req.params.userId;

        if (userIdFromToken !== userIdFromParam) {
            return res.status(403).send({ error: 'Access denied' });
        }

        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

export { auth, authAdmin, userMatch };