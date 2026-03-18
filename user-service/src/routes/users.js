const express = require('express'); 
const { pool } = require('../db/db'); 
const requireAuth = require('../middleware/authMiddleware'); 
const router = express.Router();

// 💡 1. Health Check ต้องอยู่บนสุด (ไม่โดนล็อคด้วย Token)
router.get('/health', (_, res) => res.json({status:'ok'}));

// 🔒 หลังจากบรรทัดนี้ ทุก Route ต้องมี Token
router.use(requireAuth);

router.get('/me', async (req, res) => {
  try {
    let p = await pool.query('SELECT * FROM user_profiles WHERE user_id=$1', [req.user.sub]);
    
    if(!p.rows[0]) {
      const r = await pool.query('INSERT INTO user_profiles (user_id, username, email, role) VALUES ($1,$2,$3,$4) RETURNING *', [req.user.sub, req.user.username, req.user.email, req.user.role]);
      p = {rows:[r.rows[0]]};
    }

    // 💡 2. ดักบังคับอัปเดตสิทธิ์ (กันบั๊กเมนู Admin หาย)
    if (p.rows[0].role !== req.user.role) {
        await pool.query('UPDATE user_profiles SET role=$1 WHERE user_id=$2', [req.user.role, req.user.sub]);
        p.rows[0].role = req.user.role;
    }

    res.json({profile:p.rows[0]});
  } catch(e) { 
    res.status(500).json({error: e.message}); 
  }
});

router.put('/me', async (req, res) => {
  try {
    const { display_name, bio, avatar_url } = req.body;
    // 💡 3. ใช้ COALESCE ป้องกันข้อมูลเก่าหาย ถ้าส่งค่ามาไม่ครบ
    const r = await pool.query('UPDATE user_profiles SET display_name=COALESCE($1, display_name), bio=COALESCE($2, bio), avatar_url=COALESCE($3, avatar_url), updated_at=NOW() WHERE user_id=$4 RETURNING *', [display_name, bio, avatar_url, req.user.sub]);
    res.json({profile:r.rows[0]});
  } catch(e) { 
    res.status(500).json({error: e.message}); 
  }
});

router.get('/', async (req, res) => {
  try {
    if(req.user.role !== 'admin') return res.status(403).send('Forbidden');
    const r = await pool.query('SELECT * FROM user_profiles ORDER BY user_id'); 
    res.json({users:r.rows});
  } catch(e) { 
    res.status(500).json({error: e.message}); 
  }
});

module.exports = router;
