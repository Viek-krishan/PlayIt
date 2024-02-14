import { Router } from "express";
import {
  GetUser,
  LogInUser,
  LogOutUser,
  UpdateAvatar,
  RegisterUser,
  GetWatchHistory,
  UpdateCoverImage,
  UpdateUserDetails,
  ChangeCurrentPassword,
  GetUserChannelDetails,
  regenerateRefreshToken,
} from "../controllers/User.controller.js";
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
router.route("/refresh-token").get(VerifyUser,regenerateRefreshToken);
router.route("/change-password").post(VerifyUser, ChangeCurrentPassword);
router.route("/get-user").get(VerifyUser, GetUser);
router.route("/update-user-details").patch(VerifyUser, UpdateUserDetails);
router
  .route("/update-user-avatar")
  .patch(VerifyUser, upload.single("avatar"), UpdateAvatar);
router
  .route("/update-user-cover-image")
  .patch(VerifyUser, upload.single("coverImage"), UpdateCoverImage);
router.route("/get-user-channel/:username").get(VerifyUser, GetUserChannelDetails);
router.route("/get-watch-history").get(VerifyUser, GetWatchHistory);

export default router;
