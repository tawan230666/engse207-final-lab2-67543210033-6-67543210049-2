const express = require('express'); const { pool } = require('../db/db'); const requireAuth = require('../middleware/authMiddleware'); const router = express.Router();
router.use(requireAuth);
router.get('/me', async (req, res) => {
  let p = await pool.query('SELECT * FROM user_profiles WHERE user_id=$1', [req.user.sub]);
  if(!p.rows[0]) {
    const r = await pool.query('INSERT INTO user_profiles (user_id, username, email, role) VALUES ($1,$2,$3,$4) RETURNING *', [req.user.sub, req.user.username, req.user.email, req.user.role]);
    p = {rows:[r.rows[0]]};
  }
  res.json({profile:p.rows[0]});
});
router.put('/me', async (req, res) => {
  const { display_name, bio, avatar_url } = req.body;
  const r = await pool.query('UPDATE user_profiles SET display_name=$1, bio=$2, avatar_url=$3, updated_at=NOW() WHERE user_id=$4 RETURNING *', [display_name, bio, avatar_url, req.user.sub]);
  res.json({profile:r.rows[0]});
});
router.get('/', async (req, res) => {
  if(req.user.role !== 'admin') return res.status(403).send('Forbidden');
  const r = await pool.query('SELECT * FROM user_profiles ORDER BY user_id'); res.json({users:r.rows});
});
router.get('/health', (_, res) => res.json({status:'ok'}));
module.exports = router;
