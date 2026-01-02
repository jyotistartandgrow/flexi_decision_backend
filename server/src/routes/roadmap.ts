import express from "express";
import db from "../db/knex";
import { softDelete, activeOnly } from "../utils/softDelete";
const router = express.Router();

router.get('/kanban', async (req, res, next) => {
  try {
    const { workspace_id } = req.query;
    const q = db('roadmap_items').select('*').where({ workspace_id }).orderBy('position', 'asc');
    const items = await activeOnly(q);
    const columns: Record<string, any[]> = {};
    items.forEach((it: any) => {
      const s = it.status || 'planned';
      columns[s] = columns[s] || [];
      columns[s].push(it);
    });
    res.json({ columns });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { workspace_id, title, status = 'planned', time_horizon = 'later', position = 0 } = req.body;
    const [item] = await db('roadmap_items').insert({ workspace_id, title, status, time_horizon, position }).returning('*');
    res.status(201).json(item);
  } catch (err) { next(err); }
});

router.post('/reorder', async (req, res, next) => {
  try {
    const { updates } = req.body;
    await db.transaction(async (trx) => {
      for (const u of updates) {
        await trx('roadmap_items').where('id', u.id).update({ status: u.status, position: u.position });
      }
    });
    res.json({ success: true });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await softDelete('roadmap_items', 'id', id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
