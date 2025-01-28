import express from "express";
import { authenticateToken } from "../controllers/auth.controller.js";
import { addToCart } from "../controllers/cart.controller.js";

const cartRouter = express.Router();

cartRouter.post("/", authenticateToken, addToCart);
// cartRouter.get("/", authenticateToken, getCart);
// cartRouter.delete("/:itemID", authenticateToken, removeFromCart);

export default cartRouter;