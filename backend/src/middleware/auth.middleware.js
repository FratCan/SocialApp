import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const protectRoute = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Not authorized, no token provided"}) //token yoksa
        }

        const decoded= jwt.verify(token,process.env.JWT_SECRET_KEY); //tokeni çözüyoruz.

        if(!decoded){
            return res.status(401).json({message:"Not authorized, invalid token"}) //token geçersizse
        }

        const user= await User.findById(decoded.userId).select("-password"); //şifre hariç kullanıcıyı buluyoruz.
        if(!user){
            return res.status(401).json({message:"Not authorized, user not found"}) //kullanıcı yoksa
        }
        req.user=user; //kullanıcıyı request objesine ekliyoruz.
        next(); //sonraki middleware'e geçiyoruz. onboard a geçer auth.Route üzerinden
    } catch (error) {
        console.log("Error in protectRoute middleware",error.message)
        res.status(500).json({message:"Internal server error"});
    }
}