import User from "../models/User.js";
import jwt from  "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";
import nodemailer from "nodemailer";

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function signup(req,res){
    const {email , password, fullName} = req.body;

    try {
        if(!email || !password || !fullName){
            return res.status(400).json({ message: "All fields are required"});
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"})
        }

        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({error:'invalid email format.'});
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Email already exists please use a different one. "});
        }
        const code = generateVerificationCode();

        const idx = Math.floor(Math.random()*100)+1;
        const randomAvatar = `https:\\avatar.iran.liara.run/public/${idx}.png`

        await User.create({
            email,
            password,
            fullName,
            profilePic: randomAvatar,
            verificationCode: code,
            verificationCodeExpires: Date.now() + 15 * 60 * 1000 // 15 dk geçerli
        });

        const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: true,
                auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        });
        await transporter.sendMail({
                from: `"My App" <${process.env.SMTP_USER}>`,
                to: email,
                subject: "Hesap Doğrulama Kodu",
                text: `Kodunuz: ${code}`,
                html: `<p>Merhaba <b>${fullName}</b>, doğrulama kodunuz: <b>${code}</b></p>`
        });
        res.status(201).json({success:true, message:"Signup successful. Check your email for verification code."});

    } catch (error) {
        console.log("Error in signup controller",error.message)
        res.status(500).json({message:"Internal server error"});
    }
}

export async function login(req,res){
    const {email , password} = req.body;
    try {
        if(!email || !password){
            return res.status(400).json({error: 'All fields are required.'});
        }

        const user= await User.findOne({email});
        if(!user) return res.status(401).json({message:"Invalid email or password"});


        if (!user.verified) {
            return res.status(403).json({ message: "Please verify your email before logging in." });
        }

        const isPasswordMatched = await user.matchPassword(password)
        if(!isPasswordMatched) return res.status(401).json({message:"Invalid email or password"});

        const token=jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"7d"})

        res.cookie("jwt",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true, // XSS atağını önlemek için
            sameSite:"strict",  // CSRF atağını önlemek için
            secure: process.env.NODE_ENV === "production"
        })
        res.status(200).json({succes:true,user})
    } catch (error) {
        consol.log("Error in login controller",error.message)
        res.status(500).json({message:"Internal server error"});
    }
}

export function logout(req,res){
    res.clearCookie("jwt");
    res.status(200).json({succes:true,message:"Logged out successfully"})
}

export async function onboard(req,res){
    try {
        const userId=req.user._id;
        const {fullName,bio,nativeLanguage,learningLanguage,location}=req.body;

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({
                message:"All fields are required.",
                missingFields:[
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ].filter(Boolean) //eksik olanları filtreler.
            });
        }

        const updatedUser= await User.findByIdAndUpdate(
        userId,
        {
            ...req.body,
            isOnaboarded:true
        },{new:true}
        );
        if(!updatedUser) return res.status(404).json({message:"User not found"});

        try {
            await upsertStreamUser({
            id:updatedUser._id.toString(),
            name:updatedUser.fullName,
            image:updatedUser.profilePic || "",
        });
        console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`)
        } catch (error) {
            console.log("Error updating Stream user during onboarding",error.message)
        }

        res.status(200).json({succes:true,user:updatedUser})

    } catch (error) {
        console.log("Onboarding controller error",error.message)
        res.status(500).json({message:"Internal server error"});
    }
}

export async function verifyCode(req, res) {
    const { email, code } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.verified) return res.status(400).json({ message: "User already verified" });

        if (user.verificationCode !== code) {
        return res.status(400).json({ message: "Invalid verification code" });
        }

        if (user.verificationCodeExpires < Date.now()) {
        return res.status(400).json({ message: "Verification code expired" });
        }


        user.verified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        try {
            await upsertStreamUser({
                id: user._id.toString(),
                name: user.fullName,
                image: user.profilePic || ""
            });
            console.log(`Stream user created successfully for ${user.fullName}`);
        } catch (error) {
            console.log("Error creating Stream user", error.message);
        }


        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, {expiresIn:"7d"});
        res.cookie("jwt", token, {
            maxAge: 7*24*60*60*1000,
            httpOnly: true,
            sameSite:"strict",
            secure: process.env.NODE_ENV==="production"
        });

        res.json({success:true, user, message:"Email verified successfully"});
    } catch (error) {
        console.log("Verify error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
