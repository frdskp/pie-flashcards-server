import { Router } from "express";
import { z } from "zod";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";

const router = Router();

// GET /users/me — current user + saved roots (populated)
router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const user = await User.findById(req.userId)
    .select("-passwordHash")
    .populate("savedRoots");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// POST /users/me/save/:rootId — add a root to saved deck
router.post("/me/save/:rootId", requireAuth, async (req: AuthRequest, res) => {
  const user = await User.findByIdAndUpdate(
    req.userId,
    { $addToSet: { savedRoots: req.params.rootId } },
    { new: true }
  ).select("-passwordHash");
  res.json(user);
});

// DELETE /users/me/save/:rootId — remove a root from saved deck
router.delete("/me/save/:rootId", requireAuth, async (req: AuthRequest, res) => {
  const user = await User.findByIdAndUpdate(
    req.userId,
    { $pull: { savedRoots: req.params.rootId } },
    { new: true }
  ).select("-passwordHash");
  res.json(user);
});

// PATCH /users/me/languages — update preferred languages
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
    { preferredLanguages: parsed.data.languages },
    { new: true }
  ).select("-passwordHash");
  res.json(user);
});

export default router;