import { Router } from "express";
import { z } from "zod";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";

const router = Router();

// GET /users/me
router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const user = await User.findById(req.userId)
    .select("-passwordHash")
    .populate("savedRoots.root");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// POST /users/me/save/:rootId  body: { language }
const saveSchema = z.object({
  language: z.enum(["English", "German", "Spanish", "Hindi", "Thai"]),
});

router.post("/me/save/:rootId", requireAuth, async (req: AuthRequest, res) => {
  const parsed = saveSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { language } = parsed.data;
  const user = await User.findByIdAndUpdate(
    req.userId,
    { $addToSet: { savedRoots: { root: req.params.rootId, language } } },
    { new: true }
  )
    .select("-passwordHash")
    .populate("savedRoots.root");
  res.json(user);
});

// DELETE /users/me/save/:rootId?language=Thai
router.delete("/me/save/:rootId", requireAuth, async (req: AuthRequest, res) => {
  const { language } = req.query;
  if (!language || typeof language !== "string") {
    return res.status(400).json({ error: "language query param required" });
  }
  const user = await User.findByIdAndUpdate(
    req.userId,
    { $pull: { savedRoots: { root: req.params.rootId, language } } },
    { new: true }
  )
    .select("-passwordHash")
    .populate("savedRoots.root");
  res.json(user);
});

// PATCH /users/me/languages  body: { languages: [...] }
const languagesSchema = z.object({
  languages: z.array(z.enum(["English", "German", "Spanish", "Hindi", "Thai"])).min(1),
});

router.patch("/me/languages", requireAuth, async (req: AuthRequest, res) => {
  const parsed = languagesSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const user = await User.findByIdAndUpdate(
    req.userId,
    { spokenLanguages: parsed.data.languages },
    { new: true }
  ).select("-passwordHash");
  res.json(user);
});

export default router;