import User from "../models/userModel.js"
import jwt from "jsonwebtoken"
import { promisify } from "util";
//import { jwtSecret } from "../config.js";

const signJwt = promisify(jwt.sign);

// ...
export async function generateValidJwt(user) {
    const exp = (new Date().getTime() + 7 * 24 * 3600 * 1000) / 1000;
    const claims = { _id: user._id.toString(), exp: exp };
    return await signJwt(claims, process.env.JWT_SECRET);
  }

export const cleanUpDatabase = async function() {
  await Promise.all([
    User.deleteMany()
  ]);
};