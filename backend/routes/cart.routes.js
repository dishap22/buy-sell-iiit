import express from "express";
import { authenticateToken } from "../controllers/auth.controller.js";
import { addToCart, getCart, removeFromCart, checkout } from "../controllers/cart.controller.js";

const cartRouter = express.Router();

cartRouter.post("/", authenticateToken, addToCart);
cartRouter.get("/", authenticateToken, getCart);
cartRouter.post("/checkout", authenticateToken, checkout);
cartRouter.delete("/:itemId", authenticateToken, removeFromCart);

export default cartRouter;