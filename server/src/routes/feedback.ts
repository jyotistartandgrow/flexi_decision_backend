import express from "express";
import db from "../db/knex";
import { softDelete, activeOnly } from "../utils/softDelete";
const router = express.Router();

router.post('/boards/:boardId', async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { title, body, workspace_id, custom_fields = {} } = req.body;
    const [item] = await db('feedback_items').insert({ board_id: boardId, workspace_id, title, body, custom_fields }).returning('*');
    res.status(201).json(item);
  } catch (err) { next(err); }
});

router.get('/boards/:boardId', async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const q = db('feedback_items').select('*').where({ board_id: boardId });
    const rows = await activeOnly(q);
    res.json(rows);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await softDelete('feedback_items', 'id', id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

router.post('/:id/votes', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id, customer_id, weight = 1, type = 'upvote', source } = req.body;
    const [vote] = await db('votes').insert({ feedback_item_id: id, user_id, customer_id, weight, type, source }).returning('*');
    res.status(201).json(vote);
  } catch (err) { next(err); }
});

export default router;
