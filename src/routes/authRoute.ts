import { Router } from "express";
import { loginCtrl, meCtrl, signUpCtrl } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/auth.js";
import { validate } from '../middlewares/validate.js';
import { signUpSchema } from '../schema/userSchema.js';

const authRoutes:Router = Router();

authRoutes.post("/signup", validate(signUpSchema), signUpCtrl);

authRoutes.post("/login", loginCtrl);

authRoutes.get("/me", authMiddleware, meCtrl);

export default authRoutes;