import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRouter   from "./routes/auth.routes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());    

// Routes
app.use("/api/auth", authRouter);

app.listen(PORT ,() => {
    connectDB();
    console.log(`Server started at http://localhost:${PORT}`); 
});
