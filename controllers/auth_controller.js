import createHttpError from "http-errors";
import User from "../models/user.js";
import validationSchema from '../helpers/validation_schema.js';
import { signAcessToken, signRefreshToken, verifyRefreshToken } from '../helpers/jwt_helper.js';

export async function signup(req, res, next) {
    try {
        const result = await validationSchema.registerSchema.validateAsync(req.body);

        const doesExist = await User.findOne({ email: result.email })
        if (doesExist) throw createHttpError.Conflict(`${result.email} is already registered`);

        const user = new User({ email: result.email, password: result.password });
        const savedUser = await user.save();

        const acessToken = await signAcessToken(savedUser.id);
        const refreshToken = await signRefreshToken(user.id);

        res.send({ acessToken, refreshToken });

    } catch (err) {
        if (err.isJoi === true) err.status = 422;
        next(err);
    }
}

export async function login(req, res, next) {
    try {
        const result = await validationSchema.registerSchema.validateAsync(req.body);
        const user = await User.findOne({ email: result.email });
        if (!user) throw createHttpError.NotFound('User not registered');

        const isMatch = await user.isValidPassword(result.password);
        if (!isMatch) throw createHttpError.Unauthorized('Username/password not valid');

        const acessToken = await signAcessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);

        res.send({ acessToken, refreshToken });

    } catch (err) {
        if (err.isJoi === true) return next(createHttpError.BadRequest('Invalid Username/Password'));
        next(err);
    }
}

export async function refreshToken(req, res, next) {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) throw createHttpError.BadRequest();
        const userId = await verifyRefreshToken(refreshToken);

        const acessToken = await signAcessToken(userId);
        const refToken = await signRefreshToken(userId);

        res.send({ acessToken, refToken });

    } catch (err) {
        next(err);
    }
}

export async function logout(req, res, next) {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) throw createHttpError.BadRequest();
        const userId = await verifyRefreshToken(refreshToken, true);
        res.send({ userId });
    } catch (err) {
        next(err);
    }
}