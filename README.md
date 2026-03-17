# Final Lab Set 2 – Microservices Scale-Up + Cloud Deployment

**ENGSE207 Software Architecture**

**Team Members:**
- 67543210033-6 นายธาวัน ทิพคุณ
- 67543210049-2 นายอติโรจน์ กุหลั่น

## Project Overview
This project extends Final Lab Set 1 by splitting the monolith database into three separate databases (Database-per-Service pattern) and adding a User Service. It also adds a registration API. The system is deployed on Railway Cloud.

**Live URLs (Railway):**
- Frontend URL: `https://frontend-production-faab.up.railway.app/`
- Auth Service: `https://auth-service-production-7268.up.railway.app`
- Task Service: `https://task-service-production-747e.up.railway.app`
- User Service: `https://user-service-production-57b1.up.railway.app`

## Architecture
![Architecture Diagram](screenshots/12_readme_architecture.png)

- **Auth Service** – handles registration, login, issues JWT.
- **Task Service** – manages user tasks (requires JWT).
- **User Service** – manages user profiles (requires JWT, admin-only list).
- Databases: auth-db (users, logs), task-db (tasks, logs), user-db (user_profiles, logs).
- JWT secret is shared across services.

## Gateway Strategy
We chose **Option A: Frontend calls services directly** because it simplifies deployment and matches the course examples. Each service has its own public URL configured via `config.js`.

## Local Development
1. Copy `.env.example` to `.env` and adjust values.
2. Run `docker compose up --build -d`
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
curl -X POST [https://auth-service-production-7268.up.railway.app/api/auth/register](https://auth-service-production-7268.up.railway.app/api/auth/register) -H "Content-Type: application/json" -d '{"username":"testuser","email":"test@example.com","password":"123456"}'

# Login
TOKEN=$(curl -s -X POST [https://auth-service-production-7268.up.railway.app/api/auth/login](https://auth-service-production-7268.up.railway.app/api/auth/login) -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"123456"}' | jq -r '.token')

# Get own profile (auto-creates profile)
curl [https://user-service-production-57b1.up.railway.app/api/users/me](https://user-service-production-57b1.up.railway.app/api/users/me) -H "Authorization: Bearer $TOKEN"

# Update profile
curl -X PUT [https://user-service-production-57b1.up.railway.app/api/users/me](https://user-service-production-57b1.up.railway.app/api/users/me) -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"display_name":"Test User"}'

# Create task
curl -X POST [https://task-service-production-747e.up.railway.app/api/tasks](https://task-service-production-747e.up.railway.app/api/tasks) -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"title":"My Task", "priority": "high"}'

# List tasks
curl [https://task-service-production-747e.up.railway.app/api/tasks](https://task-service-production-747e.up.railway.app/api/tasks) -H "Authorization: Bearer $TOKEN"

# Admin-only endpoint (use admin credentials from seed)
ADMIN_TOKEN=$(curl -s -X POST [https://auth-service-production-7268.up.railway.app/api/auth/login](https://auth-service-production-7268.up.railway.app/api/auth/login) -H "Content-Type: application/json" -d '{"email":"admin@lab.local","password":"adminpass"}' | jq -r '.token')
curl [https://user-service-production-57b1.up.railway.app/api/users](https://user-service-production-57b1.up.railway.app/api/users) -H "Authorization: Bearer $ADMIN_TOKEN"
