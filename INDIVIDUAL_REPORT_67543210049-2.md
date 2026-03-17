
Individual Report
ชื่อ-นามสกุล: นายอติโรจน์ กุหลั่น
รหัสนักศึกษา: 67543210049-2

ส่วนที่รับผิดชอบ
สร้าง User Service สำหรับการจัดการ Profile ของผู้ใช้งาน (สร้าง Auto-profile เมื่อเรียกครั้งแรก)

ปรับแต่ง Task Service ให้รองรับโครงสร้างการแยก Database

จัดทำระบบ Frontend และเชื่อมต่อ Config Gateway (Option A) ให้ยิงไปยัง Cloud

ปรับแต่ง UI ให้ดักจับสิทธิ์ของผู้ดูแลระบบ (ซ่อนปุ่ม)

Deploy Task Service และ User Service ลง Railway

สิ่งที่ลงมือทำจริง
สร้าง User Service ขึ้นมาใหม่โดยมี API ในการดูและแก้ไข Profile (/api/users/me) โดยถ้ายังไม่มี Profile ระบบจะ Auto-create ให้จากข้อมูลใน JWT จากนั้นได้ไปแก้ไข task-service โดยลบคำสั่ง JOIN users ออก เนื่องจากตาราง users ไม่ได้อยู่ใน Database เดียวกันแล้ว และปรับหน้า HTML Frontend ทั้งหน้า Profile และ หน้า Dashboard ให้เรียกใช้งานตัวแปร URL จาก config.js ตามหลัก Gateway Strategy แบบ A

ปัญหาที่พบและวิธีแก้
ปัญหา: หน้า Task Board ดึงข้อมูลไม่ขึ้น (เกิด Error 500) เนื่องจาก Backend ของ Task Service พยายามทำ SQL JOIN เพื่อหาชื่อผู้ใช้งาน
วิธีแก้: แก้ไขคำสั่ง SQL ฝั่ง Task Service ให้ Select ข้อมูลเฉพาะจากตาราง Tasks อย่างเดียว และส่งค่ากลับมา จากนั้นได้ปรับโค้ดฝั่ง Frontend (index.html) ให้แสดงผลเป็น UID: [id] แทนการโชว์ชื่อ Username เพื่อแก้ปัญหาการดึงข้อมูลข้าม Database

ปัญหา: คอนเทนเนอร์ของ Frontend ไม่สามารถหาไฟล์ config.js และ profile.html เจอ (Error 404 Not Found)
วิธีแก้: แก้ไขคำสั่งใน Dockerfile ของ Frontend จากการ Copy ไฟล์ทีละตัว เปลี่ยนเป็นคำสั่ง COPY . /usr/share/nginx/html/ เพื่อสั่งให้คัดลอกไฟล์ทั้งหมดใน Directory ปัจจุบันเข้าไปใน Nginx Container ทำให้โหลดหน้าเว็บได้ครบถ้วน

สิ่งที่เรียนรู้เชิงสถาปัตยกรรมจาก Set 2
เข้าใจถึงข้อจำกัดของการทำ Database-per-Service ที่เราไม่สามารถใช้ Foreign Key ข้ามฐานข้อมูลได้ ทำให้ต้องใช้เทคนิคการอ้างอิงข้อมูลทางตรรกะ (Logical Reference) ด้วย user_id แทน และได้เรียนรู้การกำหนดค่า Gateway Strategy แบบให้ Frontend จัดการการเชื่อมต่อทั้งหมด ซึ่งทำได้รวดเร็วและเหมาะกับโปรเจกต์ขนาดเล็ก

ส่วนที่ยังไม่สมบูรณ์หรืออยากปรับปรุง
หากมีผู้ใช้กด "ลบบัญชีตัวเอง" ระบบปัจจุบันจะยังไม่ได้ทำการลบข้อมูลงาน (Tasks) ของคนๆ นั้นออกไปด้วย เนื่องจาก Service ไม่ได้เชื่อมฐานข้อมูลกัน ในระบบจริงอาจต้องใช้ Message Broker (เช่น RabbitMQ) เพื่อยิง Event สั่งให้ Task Service ลบข้อมูลงานที่ค้างอยู่ออก
