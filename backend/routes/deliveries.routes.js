import express from "express";
import { getDeliveries, completeTransaction } from "../controllers/deliveries.controller.js";
import { authenticateToken } from "../controllers/auth.controller.js";

const deliveriesRouter = express.Router();

deliveriesRouter.get("/", authenticateToken, getDeliveries);
deliveriesRouter.post("/complete", authenticateToken, completeTransaction);


export default deliveriesRouter;