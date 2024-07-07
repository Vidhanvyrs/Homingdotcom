import express from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
const router = express.Router();

//going to use the function from the controllers
//user registration
router.post("/register", register);
//user login
router.post("/login", login);
//user logout
router.post("/logout", logout);

export default router;
