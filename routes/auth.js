import express from "express";
import { signup, login, refreshToken, logout } from "../controllers/auth_controller.js";


const router = express.Router();

router.post('/signup', signup)

router.post('/login',login )

router.post('/refresh-token', refreshToken)

router.delete('/logout', logout)

export default router;