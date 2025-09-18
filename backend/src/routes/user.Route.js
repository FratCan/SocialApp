import express from "express";
import { getRecommendedUsers,getMyFriends,sendFriendRequest,acceptFriendRequest,getFriendRequests,getOutgoingFriendRequests } from "../controller/user.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute) //bunu ekleyince alttaki tüm route ları korumaya alır.

router.get("/",getRecommendedUsers)
router.get("/friends",getMyFriends)
router.post("/friend-request/:id",sendFriendRequest)
router.put("/friend-request/:id/accept",acceptFriendRequest);
router.get("/friend-request",getFriendRequests);
router.get("/outgoing-friend-requests",getOutgoingFriendRequests);
export default router;