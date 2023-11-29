import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

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
