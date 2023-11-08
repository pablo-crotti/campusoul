import { registerSchema, loginSchema } from '../validation/userValidationSchema.js';

const userValidation = {
  register(req, res, next) {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    next();
  },

  login(req, res, next) {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    next();
  }
}


export default userValidation;
