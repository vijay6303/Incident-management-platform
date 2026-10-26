# AI-Powered Incident Management Platform

A Spring Boot REST API starter for managing IT incidents. This is the first milestone: incident CRUD, validation, status filtering, PostgreSQL persistence, and consistent API errors. Authentication, AI analysis, frontend, caching, and resilience will be added in later milestones.

## Tech stack
- Java 21
- Spring Boot 3.5.6
- Spring Web, Validation, Spring Data JPA
- PostgreSQL 16
- Docker Compose

## Prerequisites
- JDK 21
- Maven 3.9+ (or add Maven Wrapper)
- Docker Desktop / Docker Engine

## Run locally
1. Start PostgreSQL:
   ```bash
   docker compose up -d postgres
   ```
2. Start the API:
   ```bash
   mvn spring-boot:run
   ```
3. API base URL: `http://localhost:8080/api/incidents`

The local database defaults are intended for development only. Do not use these credentials in production.

## API endpoints
- `GET /api/incidents` — list incidents
- `GET /api/incidents?status=OPEN` — filter by status (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`)
- `GET /api/incidents/{id}` — get one incident
- `POST /api/incidents` — create an incident
- `PUT /api/incidents/{id}` — update an incident
- `DELETE /api/incidents/{id}` — delete an incident

### Example create request
```json
{
  "title": "VPN connection fails",
  "description": "Users cannot connect to the corporate VPN from home.",
  "priority": "HIGH",
  "reporterEmail": "reporter@example.com",
  "assigneeEmail": "technician@example.com"
}
```

### Example update request
```json
{
  "title": "VPN connection fails",
  "description": "VPN service restarted; monitoring the connection.",
  "priority": "HIGH",
  "status": "IN_PROGRESS",
  "reporterEmail": "reporter@example.com",
  "assigneeEmail": "technician@example.com"
}
```

## Configuration
The application reads `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, and `PORT` environment variables. Never commit production credentials or AI API keys.

## Roadmap
1. Incident CRUD API and PostgreSQL (current milestone)
2. Automated tests and stricter incident status transition rules
3. JWT login and role-based authorization
4. AI incident summarization / suggested resolution with provider abstraction
5. React + TypeScript dashboard
6. Dockerized deployment, hosted PostgreSQL, CI checks, and live demo
