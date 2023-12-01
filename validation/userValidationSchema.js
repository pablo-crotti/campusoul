import Joi from 'joi';

/**
* Joi schema for user registration data validation.
*
* @constant {object} registerSchema
*
* @property {Joi.string} email - Validates the email address as a string with the email format and requires it.
* @property {Joi.string} password - Validates the password as a string with a minimum length of 6 characters and requires it.
*/
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

/**
* Joi schema for user login data validation.
*
* @constant {object} loginSchema
*
* @property {Joi.string} email - Validates the email address as a string with the email format and requires it.
* @property {Joi.string} password - Validates the password as a string and requires it.
*/
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export { registerSchema, loginSchema };