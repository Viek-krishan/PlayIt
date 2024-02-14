import { Router } from 'express';
import {
    getChannelStats,
    getChannelVideos,
} from "../controllers/dashboard.controller.js"
import {VerifyUser} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(VerifyUser); // Apply VerifyUser middleware to all routes in this file

router.route("/stats").get(getChannelStats);
router.route("/videos").get(getChannelVideos);

export default router