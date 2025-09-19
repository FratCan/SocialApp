import express from "express";
import { login, logout, signup, onboard,verifyCode } from "../controller/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

//router.post("/onboarding",protectRoute,onboard) bunu yapmak yerine her route a protectRoute ekleyebilirim.
//router.use(protectRoute) //bunu ekleyince alttaki tüm route ları korumaya alır.

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.post("/onboarding",protectRoute,onboard) //onboarda geçmeden önce protectRoute ile kullanıcıyı doğrula
router.post("/verify-code", verifyCode);

router.get("/me",protectRoute,(req,res)=>{
    res.status(200).json({success:true,user:req.user});
})
export default router