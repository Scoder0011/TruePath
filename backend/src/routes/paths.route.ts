import { Router } from "express";
const router = Router();
router.get("/", (_req, res) => res.json([]));
router.get("/:slug", (req, res) => res.json({ slug: req.params.slug }));
export default router;

