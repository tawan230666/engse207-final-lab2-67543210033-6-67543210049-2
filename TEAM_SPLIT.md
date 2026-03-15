# Team Members
- 67543210033-6 นายธาวัน  ทิพคุณ
- 67543210049-2 นายอติโรจน์  กุหลั่น

## Work Allocation
### Student 1: นายธาวัน  ทิพคุณ (67543210033-6)
- รับผิดชอบตั้งค่า Nginx Config (HTTPS, Proxy, Rate Limit)
- พัฒนา Frontend UI (Task Board & Log Dashboard)
- จัดทำ Docker Compose และ Architecture

### Student 2: 67543210049-2 (นายอติโรจน์  กุหลั่น)
- พัฒนา Backend Services (Auth, Task, Log)
- ออกแบบ Database Schema & Seed Data
- จัดการระบบ JWT Authentication

## Integration Notes
เชื่อมต่อ Frontend และ Backend ผ่าน Nginx API Gateway โดยใช้ JWT เป็นตัวยืนยันสิทธิ์ในทุกๆ Request ที่ส่งไปยัง Task และ Log Service
