// external lib
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

// components / inhouse files
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

//socket 
import {app, server} from "./lib/socket.js"

dotenv.config();

// no need it is created in socket.js
// const app = express()

// PORT
const PORT = process.env.PORT;

const __dirname = path.resolve();

// body parser middleware
app.use(express.json());
// cookie parser
app.use(cookieParser());
//
app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend origin
    credentials: true, // Ensure credentials are included
  })
);

// auth route
app.use("/api/auth", authRoutes);

// message route
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")));
  
  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
  })
}

// listening port
server.listen(PORT, () => {
  console.log("server is running on PORT: " + PORT);
  connectDB();
});
