const express=require('express'), cors=require('cors'), {pool}=require('./db/db'), app=express();
app.use(cors()); app.use(express.json()); app.use('/api/users', require('./routes/users'));
async function start() {
  while(true) {
    try { await pool.query('SELECT 1'); await pool.query(`CREATE TABLE IF NOT EXISTS user_profiles (id SERIAL PRIMARY KEY, user_id INTEGER UNIQUE NOT NULL, username VARCHAR(50), email VARCHAR(100), role VARCHAR(20) DEFAULT 'member', display_name VARCHAR(100), bio TEXT, avatar_url VARCHAR(255), updated_at TIMESTAMP DEFAULT NOW());`); break; } catch(e) { await new Promise(r=>setTimeout(r, 2000)); }
  }
  app.listen(3003, () => console.log('User OK'));
}
start();
