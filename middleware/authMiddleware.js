import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, token: token });

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

const authUser = async (req, res, next) => {
    try {
        console.log(req.user._id.toString())
        console.log(req.params.userId)
        if (req.user._id.toString() !== req.params.userId) {
            return res.status(403).send({ error: 'Access denied' });
        }
        next();
    } catch (error) {
        res.status(400).send({ error: 'Invalid request' });
    }
};

export { auth, authUser };
