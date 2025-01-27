import express from "express";
import { authenticateToken } from "../controllers/auth.controller.js";
import { getItems, addItems } from "../controllers/items.controller.js";

const itemsRouter = express.Router();

itemsRouter.get("/", authenticateToken, getItems);
itemsRouter.post("/add", authenticateToken, addItems);

export default itemsRouter;