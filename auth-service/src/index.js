const express=require('express'), cors=require('cors'), {pool}=require('./db/db'), app=express();
app.use(cors()); app.use(express.json()); app.use('/api/auth', require('./routes/auth'));
async function start() {
  while(true) {
    try {
      await pool.query('SELECT 1');
      await pool.query(`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username VARCHAR(50) UNIQUE NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, role VARCHAR(20) DEFAULT 'member', created_at TIMESTAMP DEFAULT NOW(), last_login TIMESTAMP);`);
      await pool.query(`CREATE TABLE IF NOT EXISTS logs (id SERIAL PRIMARY KEY, level VARCHAR(10), event VARCHAR(100), user_id INTEGER, message TEXT, meta JSONB, created_at TIMESTAMP DEFAULT NOW());`);
      await pool.query(`INSERT INTO users (username, email, password_hash, role) VALUES ('alice', 'alice@lab.local', '$2b$10$PjnT4Aw1VHdFD89uFMsbtOunaa8XXNtp.8aGFlC4Rf2F1zAp3V.KC', 'member'), ('admin', 'admin@lab.local', '$2b$10$ZFSu9jujm16MjmDzk3fIYO36TyW7tNXJl3MGQuDkWBoiaiNJ2iFca', 'admin') ON CONFLICT (username) DO NOTHING;`);
      break;
    } catch(e) { await new Promise(r=>setTimeout(r, 2000)); }
  }
  app.listen(3001, () => console.log('Auth OK'));
}
start();
