import User from "../models/userModel.js"
import jwt from "jsonwebtoken"
import { promisify } from "util";

const signJwt = promisify(jwt.sign);

/**
* Generates a valid JSON Web Token (JWT) for a user with a specified expiration time.
*
* @param {object} user - The user object for whom the JWT is being generated.
* @returns {string} - The JWT token string.
*
* @param {object} user - The user object for whom the JWT is being generated.
* @param {string} user._id - The unique identifier of the user.
*
* @returns {string} - A valid JWT token string with the user's unique identifier (_id) and expiration time (exp) claim.
*/
export async function generateValidJwt(user) {
  const exp = (new Date().getTime() + 7 * 24 * 3600 * 1000) / 1000;
  const claims = { _id: user._id.toString(), exp: exp };
  return await signJwt(claims, process.env.JWT_SECRET);
}

/**
* Cleans up the database by deleting all data from specific collections.
*
* @async
* @function cleanUpDatabase
*
* @returns {Promise<void>} - A Promise that resolves when the database cleanup is complete.
*
* @description
* This function deletes all data from specific collections in the database, ensuring a clean slate for testing purposes.
*/
export const cleanUpDatabase = async function () {
  await Promise.all([
    User.deleteMany()
  ]);
};