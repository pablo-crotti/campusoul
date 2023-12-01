import { registerSchema, loginSchema } from '../validation/userValidationSchema.js';

const userValidation = {
  /**
  * Validates user registration data against a predefined schema.
  * If the validation fails, sends a 400 bad request response with the validation error message.
  * Otherwise, passes control to the next middleware function.
  * 
  * @param {Object} req - The HTTP request object containing the user registration data in the body.
  * @param {Object} res - The HTTP response object used for sending back a validation error message.
  * @param {Function} next - The callback to the next middleware function in the stack.
  */
  register(req, res, next) {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    next();
  },

  /**
  * Validates user login data against a predefined schema.
  * If the validation fails, sends a 400 bad request response with the validation error message.
  * Otherwise, passes control to the next middleware function.
  * 
  * @param {Object} req - The HTTP request object containing the user login data in the body.
  * @param {Object} res - The HTTP response object used for sending back a validation error message.
  * @param {Function} next - The callback to the next middleware function in the stack.
  */
  login(req, res, next) {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    next();
  }
}

export default userValidation;
