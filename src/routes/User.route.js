import { Router } from "express";
import RegisterUser from "../controllers/Register.controller.js";

// Initilizing router
const router = Router();

// Register route
router.route("/register").post(RegisterUser);

export default router;
