import express from "express";
import { authenticateToken } from "../controllers/auth.controller.js";
import { getItems, addItems, getItem, getSellerItems, deleteItem } from "../controllers/items.controller.js";

const itemsRouter = express.Router();

itemsRouter.get("/", authenticateToken, getItems);
itemsRouter.post("/add", authenticateToken, addItems);
itemsRouter.get("/seller-products", authenticateToken, getSellerItems);
itemsRouter.delete("/:itemId", authenticateToken, deleteItem);
itemsRouter.get("/:itemId", authenticateToken, getItem);

export default itemsRouter;