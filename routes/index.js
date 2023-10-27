import express from "express";
import { verifyAccessToken } from "../helpers/jwt_helper.js";

const router = express.Router();

router.get("/", verifyAccessToken, function (req, res, next) {
  // console.log(req.headers['authorization'])
  res.send("Ignition!");
});

export default router;
