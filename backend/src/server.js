import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.Route.js"
import {connectDB} from "./lib/db.js"
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.Route.js"
import chatRoutes from "./routes/chat.Route.js"

dotenv.config(); /*dosya içeriğini okuyabilmesi için config methodunu run etmemiz gerekiyor.*/

const app=express()
const PORT= process.env.PORT

app.use(cors({ origin: "http://localhost:5173" , credentials:true})); //frontendin cookileri backende göndermesi için credentials:true yapıyoruz.
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/chat",chatRoutes)

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
    connectDB();
})