import { Router } from "express";
import RegisterUser from "../controllers/Register.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

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

export default router;
