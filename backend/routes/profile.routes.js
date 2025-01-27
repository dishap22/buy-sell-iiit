import express from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import { authenticateToken } from "../controllers/auth.controller.js";

const profileRouter = express.Router();

profileRouter.get("/", authenticateToken, getProfile);
profileRouter.put("/", authenticateToken, updateProfile);

export default profileRouter;