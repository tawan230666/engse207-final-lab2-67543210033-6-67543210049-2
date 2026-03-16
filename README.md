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
