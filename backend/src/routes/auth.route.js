import express from 'express';

// controllers
import { login, logout, signup, updateProfile , checkAuth} from '../controllers/auth.controller.js';

// middleware
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Routes

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);

router.put("/update-profile", protectRoute,updateProfile);

router.get("/check", protectRoute,checkAuth);


export default router ;