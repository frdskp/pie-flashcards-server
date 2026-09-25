import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import rootsRouter from "./routes/roots.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/roots", rootsRouter);

const PORT = Number(process.env.PORT) || 4000;

connectDB(process.env.MONGO_URI!).then(() => {
  app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
});