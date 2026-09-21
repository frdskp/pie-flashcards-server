import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const PORT = Number(process.env.PORT) || 4000;

connectDB(process.env.MONGO_URI!).then(() => {
  app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
});