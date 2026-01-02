import express from "express";
import db from "../db/knex";
import { softDelete, activeOnly } from "../utils/softDelete";
const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { workspace_id, name, visibility = 'public', settings = {} } = req.body;
    const [board] = await db('boards').insert({ workspace_id, name, visibility, settings }).returning('*');
    res.status(201).json(board);
  } catch (err) { next(err); }
});

router.get('/', async (req, res, next) => {
  try {
    const { workspace_id } = req.query;
    const q = db('boards').select('*').where({ workspace_id });
    const rows = await activeOnly(q);
    res.json(rows);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await softDelete('boards', 'id', id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
