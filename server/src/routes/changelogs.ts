import express from "express";
import db from "../db/knex";
import { softDelete, activeOnly } from "../utils/softDelete";
const router = express.Router();

// List changelogs for a workspace (active only)
router.get("/", async (req, res, next) => {
  try {
    const { workspace_id } = req.query;
    const q = db("changelogs").select("*").where({ workspace_id }).orderBy("created_at", "desc");
    const rows = await activeOnly(q);
    res.json(rows);
  } catch (err) { next(err); }
});

// Get single changelog
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const row = await db("changelogs").where({ id }).andWhere("active", true).first();
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) { next(err); }
});

// Create changelog
router.post("/", async (req, res, next) => {
  try {
    const { workspace_id, title, body, category, scheduled_at } = req.body;
    const [entry] = await db("changelogs")
      .insert({ workspace_id, title, body, category, scheduled_at })
      .returning("*");
    res.status(201).json(entry);
  } catch (err) { next(err); }
});

// Update changelog
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const [entry] = await db("changelogs").where({ id }).update(updates).returning("*");
    res.json(entry);
  } catch (err) { next(err); }
});

// Soft-delete changelog
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await softDelete("changelogs", "id", id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
