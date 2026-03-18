const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db/db');
const { generateToken, verifyToken } = require('../middleware/jwtUtils');
const router = express.Router();
const DUMMY_HASH = '$2b$10$CwTycUXWue0Thq9StjUM0uJ8y0R6VQwWi4KFOeFHrgb3R04QLbL7a';

async function logEvent({ level, event, userId, ip, message, meta }) {
  try { await pool.query('INSERT INTO logs (level, event, user_id, ip_address, message, meta) VALUES ($1,$2,$3,$4,$5,$6)', [level, event, userId || null, ip || null, message || null, meta ? JSON.stringify(meta) : null]); } catch (e) {}
}
router.get('/health', (_, res) => res.json({ 
    status: 'ok', 
    service: 'auth-service',
    time: new Date().toISOString(),      // บอกเวลาปัจจุบันของ Server
    uptime: process.uptime()             // บอกว่า Service นี้รันมานานกี่วินาทีแล้ว (แถมให้ครับ มีประโยชน์มากเวลาเช็ค Server รีสตาร์ทเอง)
}));

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'ครบทุกช่อง' });
  try {
    const exists = await pool.query('SELECT id FROM users WHERE email=$1 OR username=$2', [email.toLowerCase(), username]);
    if (exists.rows.length > 0) return res.status(409).json({ error: 'Email หรือ Username ถูกใช้งานแล้ว' });
    const hash = await bcrypt.hash(password, 10);
    const r = await pool.query("INSERT INTO users (username, email, password_hash, role) VALUES ($1,$2,$3,'member') RETURNING id, username, email, role", [username, email.toLowerCase(), hash]);
    await logEvent({ level: 'INFO', event: 'REGISTER_SUCCESS', userId: r.rows[0].id, ip: req.ip, message: `New user: ${username}` });
    res.status(201).json({ message: 'Success', user: r.rows[0] });
  } catch (err) { res.status(500).json({ error: 'Server Error' }); }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const r = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    const user = r.rows[0] || null;
    const isValid = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);
    if (!user || !isValid) {
      await logEvent({ level: 'WARN', event: 'LOGIN_FAILED', ip: req.ip, message: `Failed login: ${email}` });
      return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านผิด' });
    }
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
    const token = generateToken({ sub: user.id, email: user.email, role: user.role, username: user.username });
    await logEvent({ level: 'INFO', event: 'LOGIN_SUCCESS', userId: user.id, ip: req.ip, message: `Logged in: ${user.username}` });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) { res.status(500).json({ error: 'Server Error' }); }
});

router.get('/verify', (req, res) => {
  const token = (req.headers['authorization'] || '').split(' ')[1];
  if (!token) return res.status(401).json({ valid: false });
  try { res.json({ valid: true, user: verifyToken(token) }); } catch (e) { res.status(401).json({ valid: false }); }
});

router.get('/me', async (req, res) => {
  const token = (req.headers['authorization'] || '').split(' ')[1];
  try {
    const decoded = verifyToken(token);
    const r = await pool.query('SELECT id, username, email, role FROM users WHERE id = $1', [decoded.sub]);
    res.json({ user: r.rows[0] });
  } catch (e) { res.status(401).json({ error: 'Invalid token' }); }
});

// 💡 เพิ่ม API ดึง Logs ให้ Admin ใช้ (แก้ปัญหาค้างที่ "กำลังดึงข้อมูล...")
router.get('/logs', async (req, res) => {
  const token = (req.headers['authorization'] || '').split(' ')[1];
  try {
    const { verifyToken } = require('../middleware/jwtUtils');
    const user = verifyToken(token);
    if (user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const r = await pool.query('SELECT * FROM logs ORDER BY created_at DESC LIMIT 100');
    const c = await pool.query('SELECT COUNT(*) FROM logs');
    res.json({ logs: r.rows, total: parseInt(c.rows[0].count) });
  } catch (e) { res.status(401).json({ error: 'Unauthorized' }); }
});

module.exports = router;
