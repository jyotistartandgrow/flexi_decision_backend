import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRouter from "./routes/auth";
import boardsRouter from "./routes/boards";
import feedbackRouter from "./routes/feedback";
import roadmapRouter from "./routes/roadmap";
import changelogsRouter from "./routes/changelogs";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRouter);
app.use("/api/boards", boardsRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/roadmap", roadmapRouter);
app.use("/api/changelogs", changelogsRouter);

// Basic error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: any) => {
  console.error(err);
  res.status(500).json({ error: err.message || "internal" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
