import Jwt from "jsonwebtoken";
import createHttpError from "http-errors";

export const signAcessToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {}
        const secret = process.env.ACCESS_TOKEN_SECRET
        const options = {
            expiresIn: "15s",
            issuer: "campusoul.ch",
            audience: userId
        };
        Jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                console.log(err.message);
                return reject(createHttpError.InternalServerError());
            }
            resolve(token);
        });
    });
}

export const verifyAccessToken = (req, res, next) => {
    if (!req.headers['authorization']) return next(createHttpError.Unauthorized());
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
            return next(createHttpError.Unauthorized());
        }
        req.payload = payload;
        next();
    });
}

export const signRefreshToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {}
        const secret = process.env.REFRESH_TOKEN_SECRET
        const options = {
            expiresIn: "1y",
            issuer: "campusoul.ch",
            audience: userId
        };
        Jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                console.log(err.message);
                return reject(createHttpError.InternalServerError());
            }
            resolve(token);
        });
    });
}

export const verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
            if (err) return reject(createHttpError.Unauthorized());
            const userId = payload.aud;
            resolve(userId);
        });
    });
}