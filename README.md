# ENGSE207 Software Architecture - Final Lab Set 1

## ภาพรวมของระบบ
ระบบ Task Board Microservices ประกอบด้วย 3 Services หลัก (Auth, Task, Log) เชื่อมต่อกันผ่าน Nginx API Gateway 
ระบบรองรับ HTTPS (Self-signed), JWT Authentication, Rate Limiting และมีระบบ Lightweight Logging บันทึกลง PostgreSQL

## โครงสร้าง Repository
- `nginx/`: Reverse Proxy & HTTPS TLS Termination
- `auth-service/`: จัดการ Login และสร้าง JWT
- `task-service/`: API สำหรับ CRUD งาน (ป้องกันด้วย JWT)
- `log-service/`: API สำหรับบันทึกและอ่าน Log 
- `frontend/`: UI แบบ Static HTML/JS
- `db/`: Database Schema & Seed Data

## วิธีรันระบบ
1. สร้าง Certificate: `./scripts/gen-certs.sh`
2. รัน Docker: `docker compose up --build -d`
3. เข้าใช้งานที่: `https://localhost`

## บัญชีสำหรับทดสอบ (Seed Users)
- **Member 1:** `alice@lab.local` / `alice123`
- **Member 2:** `bob@lab.local` / `bob456`
- **Admin:** `admin@lab.local` / `adminpass` (สำหรับดู Log Dashboard)
*หมายเหตุ: Password ถูก Hash ด้วย Bcrypt ก่อนเก็บลงฐานข้อมูล*
