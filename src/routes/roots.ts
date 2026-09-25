import { Router } from "express";
import { Root } from "../models/Root.js";

const router = Router();

// GET /roots — list all roots
router.get("/", async (_req, res) => {
  try {
    const roots = await Root.find().sort({ root: 1 });
    res.json(roots);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch roots" });
  }
});

// GET /roots/:id — single root
router.get("/:id", async (req, res) => {
  try {
    const root = await Root.findById(req.params.id);
    if (!root) return res.status(404).json({ error: "Root not found" });
    res.json(root);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

export default router;