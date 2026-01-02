import express from "express";
import db from "../db/knex";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, workspace_id } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const [user] = await db('users').insert({ email, name, password_hash: hash, workspace_id }).returning(['id','email','name']);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token, user });
  } catch (err) { next(err); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await db('users').where({ email }).first();
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash || '');
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) { next(err); }
});

router.post('/forgot', async (req, res, next) => {
  try {
    // stub: in production send email with reset token
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
