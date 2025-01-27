import express from "express";
import { authenticateToken } from "../controllers/auth.controller.js";
import { getItems } from "../controllers/search.controller.js";

const searchRouter = express.Router();

searchRouter.get("/", authenticateToken, getItems);

export default searchRouter;