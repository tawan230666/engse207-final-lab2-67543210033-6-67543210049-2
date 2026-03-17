
TEAM_SPLIT.md — Final Lab Set 2
Team Members
67543210033-6 นายธาวัน ทิพคุณ

67543210049-2 นายอติโรจน์ กุหลั่น

Work Allocation
Student 1: นายธาวัน ทิพคุณ (67543210033-6)
Auth Service: เพิ่มฟังก์ชัน Register API เพื่อให้ผู้ใช้สมัครสมาชิกได้

นำ Log Service จาก Set 1 ออก และปรับแต่งฟังก์ชัน logEvent ใน Auth Service ให้บันทึกลง Database ของตัวเอง (authdb)

เขียน schema สำหรับ auth-service/init.sql เพื่อสร้างตาราง users, logs และทำการ Seed Users (admin, alice)

Deploy Auth Service และ auth-db ลงบน Railway Cloud

Student 2: นายอติโรจน์ กุหลั่น (67543210049-2)
สร้าง User Service ขึ้นมาใหม่ทั้งหมด เพื่อจัดการข้อมูลโปรไฟล์ผู้ใช้ผ่าน userdb

แก้ไข Task Service โดยปรับเอาคำสั่ง SQL JOIN ข้ามตารางออก เพื่อให้สอดคล้องกับ Database-per-Service

แก้ไข Frontend JS และ HTML (แก้ไขหน้า Index, สร้าง Profile.html และเชื่อม Config Gateway แบบ Option A)

ซ่อนปุ่มการสร้าง Task และ Edit Profile เมื่อผู้ใช้งานเป็น Admin

Deploy Task Service, User Service และ Frontend บน Railway

Shared Responsibilities
ปรับแก้ไข docker-compose.yml ให้รันฐานข้อมูลแยกกันเป็น 3 Services

วาด Architecture diagram ใหม่สำหรับโครงสร้างบน Cloud

ทดสอบ End-to-end testing บน Cloud (Postman / Curl)

จัดทำ README.md และแคปภาพ Screenshots ส่งอาจารย์

Integration Notes
JWT_SECRET ใช้ค่า "engse207-shared-jwt-secret-set2" เหมือนกันในทุก Service เพื่อให้ระบบสามารถ Verify Token ข้ามส่วนกันได้อย่างถูกต้อง

ข้อมูล user_id (sub) จาก JWT ที่ถูกออกโดย Auth Service จะถูกนำไปบันทึกเป็น Logical Reference ในตารางของ Task Service และ User Service
