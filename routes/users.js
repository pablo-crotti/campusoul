import express from "express";
import createHttpError from "http-errors";
import User from "../models/user.js";
import validationSchema from '../helpers/validation_schema.js';
import signAcessToken from '../helpers/jwt_helper.js';

const router = express.Router();

router.post('/signup', async (req, res, next) => {
  try {
    const result = await validationSchema.registerSchema.validateAsync(req.body);

    const doesExist = await User.findOne({ email: result.email })
    if (doesExist) throw createHttpError.Conflict(`${result.email} is already registered`);

    const user = new User({email: result.email, password: result.password});
    const savedUser = await user.save();

    const acessToken = await signAcessToken(savedUser.id);
    res.send({acessToken});

  } catch (err) {
    if (err.isJoi === true) err.status = 422;
    next(err);
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const result = await validationSchema.registerSchema.validateAsync(req.body);
    const user = await User.findOne({ email: result.email });
    if (!user) throw createHttpError.NotFound('User not registered');

    const isMatch = await user.isValidPassword(result.password);
    if (!isMatch) throw createHttpError.Unauthorized('Username/password not valid');

    const acessToken = await signAcessToken(user.id);
    res.send({acessToken});

  } catch (err) {
    if (err.isJoi === true) return next(createHttpError.BadRequest('Invalid Username/Password'));
    next(err);
  }
})

export default router;