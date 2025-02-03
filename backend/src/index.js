// external lib
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from "cookie-parser";

// components / inhouse files
import authRoutes from './routes/auth.route.js';


dotenv.config();

const app = express();

// PORT
const PORT = process.env.PORT;

// body parser middleware
app.use(express.json())
// cookie parser
app.use(cookieParser());

// auth route
app.use("/api/auth",authRoutes);

// listening port
app.listen(PORT,()=>{
    console.log("server is running on PORT: "+PORT);
    connectDB();
});