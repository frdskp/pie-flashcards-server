import { Router } from "express";
import { Root } from "../models/Root.js";

const router = Router();

// GET /roots — optional filters: ?language=Thai&curated=true
router.get("/", async (req, res) => {
  try {
    const { language, curated } = req.query;
    const filter: any = {};

    if (language && typeof language === "string") {
      filter["cognates.language"] = language;
    }
    if (curated === "true") {
      filter.isCurated = true;
    }

    const roots = await Root.find(filter).sort({ isCurated: -1, root: 1 });
    res.json(roots);
  } catch {
    res.status(500).json({ error: "Failed to fetch roots" });
  }
});

// GET /roots/:id
router.get("/:id", async (req, res) => {
  try {
    const root = await Root.findById(req.params.id);
    if (!root) return res.status(404).json({ error: "Root not found" });
    res.json(root);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
});

export default router;