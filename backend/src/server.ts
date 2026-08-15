import "dotenv/config";
import express from "express";
import cors from "cors";
import pathsRouter from "./routes/paths.route.js";
import progressRouter from "./routes/progress.route.js";
import authRouter from "./routes/auth.route.js";

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());
app.use("/api/paths", pathsRouter);
app.use("/api/progress", progressRouter);
app.use("/api/auth", authRouter);
app.listen(Number(process.env.PORT ?? 4000), () => console.log("TruePath API running"));

