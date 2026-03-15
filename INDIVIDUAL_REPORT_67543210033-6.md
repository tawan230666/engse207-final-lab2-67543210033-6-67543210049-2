# Individual Report
**ชื่อ-สกุล:** นาย นายธาวัน  ทิพคุณ (ทีม)
**รหัสนักศึกษา:** 67543210033-6

## ส่วนที่รับผิดชอบ
Nginx API Gateway, Docker Compose, Frontend UI

## สิ่งที่ได้ลงมือพัฒนาด้วยตนเอง
- คอนฟิก Nginx ทำ HTTPS, Proxy Pass, Rate Limit
- สร้าง UI ด้วย HTML/CSS/JS เชื่อมต่อ API แบบ Fetch
- แก้ไขปัญหา CORS และการสื่อสารข้าม Container ใน Docker

## ปัญหาที่พบและวิธีการแก้ไข
- **ปัญหา:** JWT Signature ไม่ตรงกันระหว่าง Service
- **แก้ไข:** ปรับ Environment variables ให้ทุก Service ใช้ JWT_SECRET จาก .env เดียวกัน
