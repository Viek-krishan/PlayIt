import { Router } from "express";
import {
  LogInUser,
  LogOutUser,
  RegisterUser,
} from "../controllers/Register.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { VerifyUser } from "../middlewares/auth.middleware.js";

// Initilizing router
const router = Router();

// Register route
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  RegisterUser
);

router.route("/login").post(LogInUser);

// secure routes

router.route("/logout").post(VerifyUser, LogOutUser);

export default router;
