# Final Lab Set 2 – Microservices Scale-Up + Cloud Deployment

**ENGSE207 Software Architecture**

**Team Members:**
- 67543210033-6 [Name1]
- 67543210049-2 [Name2]

## Project Overview
This project extends Final Lab Set 1 by splitting the monolith database into three separate databases (Database-per-Service pattern) and adding a User Service. It also adds a registration API. The system is deployed on Railway.

**Live URLs (Railway):**
- Auth Service: `https://...`
- Task Service: `https://...`
- User Service: `https://...`

## Architecture
![Architecture Diagram](screenshots/12_readme_architecture.png)

- **Auth Service** – handles registration, login, issues JWT.
- **Task Service** – manages user tasks (requires JWT).
- **User Service** – manages user profiles (requires JWT, admin-only list).
- Databases: auth-db (users, logs), task-db (tasks, logs), user-db (user_profiles, logs).
- JWT secret is shared across services.

## Gateway Strategy
We chose **Option A: Frontend calls services directly** because it simplifies deployment and matches the course examples. Each service has its own public URL.

## Local Development
1. Copy `.env.example` to `.env` and adjust values.
2. Run `docker compose up --build`
3. Access:
   - Auth: http://localhost:3001
   - Task: http://localhost:3002
   - User: http://localhost:3003
   - Frontend: http://localhost:8080

## Deployment on Railway
- Each service was deployed separately with its own PostgreSQL plugin.
- Environment variables were set according to `.env.example`.
- The `DATABASE_URL` was injected automatically by Railway.

## Testing
Use the following curl commands (replace URLs with actual Railway URLs). See [screenshots](screenshots) for evidence.

```bash
# Register
curl -X POST https://[AUTH_URL]/api/auth/register -H "Content-Type: application/json" -d '{"username":"test","email":"test@example.com","password":"123456"}'

# Login
TOKEN=$(curl -s -X POST https://[AUTH_URL]/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"123456"}' | jq -r '.token')

# Get own profile (auto-creates profile)
curl https://[USER_URL]/api/users/me -H "Authorization: Bearer $TOKEN"

# Update profile
curl -X PUT https://[USER_URL]/api/users/me -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"display_name":"Test User"}'

# Create task
curl -X POST https://[TASK_URL]/api/tasks -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"title":"My Task"}'

# List tasks
curl https://[TASK_URL]/api/tasks -H "Authorization: Bearer $TOKEN"

# Admin-only endpoint (use admin credentials from seed)
ADMIN_TOKEN=$(curl -s -X POST https://[AUTH_URL]/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@lab.local","password":"adminpass"}' | jq -r '.token')
curl https://[USER_URL]/api/users -H "Authorization: Bearer $ADMIN_TOKEN"
#!/bin/bash
set -e

# กำหนดรหัสนักศึกษา
STUDENT1="67543210033-6"
STUDENT2="67543210049-2"
PROJECT_DIR="engse207-final-lab2-${STUDENT1}-${STUDENT2}"

echo "======================================================"
echo "  Final Lab Set 2 - สร้างโครงสร้างสมบูรณ์              "
echo "======================================================"
echo ""

# ลบโฟลเดอร์เดิมถ้ามี
if [ -d "$PROJECT_DIR" ]; then
    read -p "⚠️  โฟลเดอร์ $PROJECT_DIR มีอยู่แล้ว ลบแล้วสร้างใหม่? (y/N): " confirm
    if [[ "$confirm" =~ ^[Yy]$ ]]; then
        rm -rf "$PROJECT_DIR"
        echo "   ลบโฟลเดอร์เดิมเรียบร้อย"
    else
        echo "❌ ยกเลิก"
        exit 1
    fi
fi

# สร้างโครงสร้างโฟลเดอร์
echo "📁 Creating folder structure..."
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

mkdir -p auth-service/src/{routes,middleware,db} \
         task-service/src/{routes,middleware,db} \
         user-service/src/{routes,middleware,db} \
         frontend screenshots

echo "✅ โครงสร้างโฟลเดอร์สร้างเสร็จ"

# ============================================
# .env.example
# ============================================
cat > .env.example << 'EOF'
# Shared JWT Secret (must be same across services)
JWT_SECRET=your-shared-jwt-secret-here-change-in-production
JWT_EXPIRES_IN=1h

# Auth DB
AUTH_DB_NAME=authdb
AUTH_DB_USER=admin
AUTH_DB_PASSWORD=secret

# Task DB
TASK_DB_NAME=taskdb
TASK_DB_USER=admin
TASK_DB_PASSWORD=secret

# User DB
USER_DB_NAME=userdb
USER_DB_USER=admin
USER_DB_PASSWORD=secret

# Service Ports (local)
AUTH_PORT=3001
TASK_PORT=3002
USER_PORT=3003
