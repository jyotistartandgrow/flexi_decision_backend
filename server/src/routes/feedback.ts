import express from "express";
import db from "../db/knex";
import { softDelete, activeOnly } from "../utils/softDelete";
const router = express.Router();

// Create feedback item for a board
router.post("/boards/:boardId", async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { title, body, workspace_id, custom_fields = {} } = req.body;
    const [item] = await db("feedback_items")
      .insert({ board_id: boardId, workspace_id, title, body, custom_fields })
      .returning("*");
    res.status(201).json(item);
  } catch (err) { next(err); }
});

// List feedback for a board (active only)
router.get("/boards/:boardId", async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const q = db("feedback_items").select("*").where({ board_id: boardId }).orderBy("created_at", "desc");
    const rows = await activeOnly(q);
    res.json(rows);
  } catch (err) { next(err); }
});

// Get single feedback item
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db("feedback_items").where({ id }).andWhere("active", true).first();
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) { next(err); }
});

// Update feedback item
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const [item] = await db("feedback_items").where({ id }).update(updates).returning("*");
    res.json(item);
  } catch (err) { next(err); }
});

// Soft-delete feedback
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await softDelete("feedback_items", "id", id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// Vote on feedback
router.post("/:id/votes", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id, customer_id, weight = 1, type = "upvote", source } = req.body;
    const [vote] = await db("votes")
      .insert({ feedback_item_id: id, user_id, customer_id, weight, type, source })
      .returning("*");
    res.status(201).json(vote);
  } catch (err) { next(err); }
});

export default router;
