import express from "express";
import { getRecommendedUsers,getMyFriends,sendFriendRequest } from "../controller/user.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute) //bunu ekleyince alttaki tüm route ları korumaya alır.

router.get("/",getRecommendedUsers)
router.get("/friends",getMyFriends)
router.post("/friend-request/:id",sendFriendRequest)

export default router;