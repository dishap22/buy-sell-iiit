import express from "express";
import { authenticateToken } from "../controllers/auth.controller.js";
import { getPendingOrders, getBoughtOrders, getSoldOrders } from "../controllers/orders.controller.js";

const orderRouter = express.Router();

orderRouter.get("/pending", authenticateToken, getPendingOrders);
orderRouter.get("/bought", authenticateToken, getBoughtOrders);
orderRouter.get("/sold", authenticateToken, getSoldOrders);

export default orderRouter;