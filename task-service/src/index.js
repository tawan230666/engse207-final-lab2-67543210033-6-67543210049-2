const express=require('express'), cors=require('cors'), {pool}=require('./db/db'), app=express();
app.use(cors()); app.use(express.json()); app.use('/api/tasks', require('./routes/tasks'));
async function start() {
  while(true) {
    try { await pool.query('SELECT 1'); await pool.query(`CREATE TABLE IF NOT EXISTS tasks (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL, title VARCHAR(200) NOT NULL, description TEXT, status VARCHAR(20) DEFAULT 'TODO', priority VARCHAR(10) DEFAULT 'medium', created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());`); break; } catch(e) { await new Promise(r=>setTimeout(r, 2000)); }
  }
  app.listen(3002, () => console.log('Task OK'));
}
start();
