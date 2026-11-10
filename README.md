# ICMS Campus Suite — Integrated Campus Management System
**Enterprise Higher Education Platform**

[![Project Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/your-org/icms)
[![Architecture](https://img.shields.io/badge/architecture-Modular%20Monolith-navy.svg)](#)
[![TypeScript](https://img.shields.io/badge/language-TypeScript-3178C6.svg)](#)
[![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-green.svg)](#)

---

## 1. Project Overview

**ICMS Campus Suite** is an enterprise-grade digital platform designed to centralize and automate university operations across 19 core functional modules. Architected as a **Modular Monolith**, the system balances rapid development velocity, clean domain separation, and database-level transactional integrity.

### Primary Technology Stack:
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router v7, TanStack Query, React Hook Form, Zod, Recharts.
- **Backend**: Node.js, NestJS 11, TypeScript, REST API v1, Prisma ORM v6, JWT Authentication, Argon2id.
- **Database & Persistence**: PostgreSQL 16+ / 18, Redis 7 (Caching), S3-compatible Object Storage (MinIO / Cloud Storage).
- **Infrastructure**: Docker Compose, Nginx Reverse Proxy, Linux VPS readiness.

---

## 2. Monorepo Project Structure

```
ICMS/
├── apps/
│   ├── web/                    # React 18 + Vite SPA Frontend
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI & atomic components
│   │   │   ├── layouts/        # Sidebar, Navbar, and Shell layouts
│   │   │   ├── pages/          # Dashboard & domain page views
│   │   │   ├── services/       # Typed HTTP API client
│   │   │   └── utils/          # Formatting & class merging
│   │   └── package.json
│   │
│   └── api/                    # NestJS 11 Core Backend API
│       ├── src/
│       │   ├── common/         # Filters, Interceptors, Decorators, Guards
│       │   ├── config/         # Environment configuration
│       │   ├── database/       # Prisma Client Service & Module
│       │   ├── modules/        # Domain business modules (Health, Auth, Academic, etc.)
│       │   └── main.ts         # Server bootstrap, Swagger, Pipes
│       └── package.json
│
├── packages/
│   └── shared/                 # Shared TypeScript contracts, enums, DTOs
│       ├── src/index.ts
│       └── package.json
│
├── prisma/
│   ├── schema.prisma           # 35+ Domain models with PostgreSQL types
│   ├── migrations/             # Versioned schema migrations
│   └── seed.ts                 # Database seed script for roles & master data
│
├── infrastructure/
│   ├── docker/                 # Production multi-stage Dockerfiles
│   │   ├── Dockerfile.api
│   │   └── Dockerfile.web
│   └── nginx/                  # Reverse proxy & SPA routing config
│
├── docs/                       # Comprehensive architectural documentation
│   ├── blueprint/roadmap.md
│   ├── architecture/
│   ├── database/database-architecture.md
│   └── api/
│
├── docker-compose.yml          # Containerized environment (Postgres, Redis, MinIO)
├── .env.example                # Full environment variable blueprint
├── package.json                # Root workspace orchestration
└── README.md
```

---

## 3. Quick Start Guide (Local Development)

### Prerequisites:
- **Node.js**: v20.x or v22.x LTS (`node -v` -> v22.15.0)
- **Package Manager**: npm (`npm -v` -> 10.9.2) or pnpm
- **PostgreSQL**: Local PostgreSQL 16/18 service or Docker

### Step 1: Install Dependencies
Run from the root directory:
```bash
npm install
```

### Step 2: Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `DATABASE_URL` matches your local PostgreSQL credentials:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/icms_db?schema=public"
```

### Step 3: Generate Prisma Client & Build Shared Package
```bash
npm run build:shared
npm run prisma:generate
```

### Step 4: Run Development Servers
To run both backend and frontend concurrently:
```bash
npm run dev:all
```
Or run individually:
- **Backend API**: `npm run dev:api` (Runs on `http://localhost:4000`)
- **Frontend SPA**: `npm run dev:web` (Runs on `http://localhost:5173`)

### Access Points:
- **Web Application**: [http://localhost:5173](http://localhost:5173)
- **API Health Check**: [http://localhost:4000/api/v1/health](http://localhost:4000/api/v1/health)
- **Swagger OpenAPI Docs**: [http://localhost:4000/api/v1/docs](http://localhost:4000/api/v1/docs)

---

## 4. Running with Docker Compose

For a fully isolated containerized environment (Postgres, Redis, MinIO):
```bash
docker compose up -d postgres redis minio
```
Or to run the entire stack including API and Nginx-served Web:
```bash
docker compose up -d --build
```

---

## 5. Development Phases

The project follows a phased implementation strategy:
- **Phase 0 — Project Analysis & Scaffolding** *(COMPLETED)*
- **Phase 1 — Foundation (Auth, RBAC, Master Data)** *(NEXT)*
- **Phase 2 — Academic Core (Students, Lecturers, KRS/KHS)**
- **Phase 3 — Campus Operations (Finance, Attendance)**
- **Phase 4 — Digital Learning (LMS, Online Exams)**
- **Phase 5 — Enterprise Modules (Library, HR, Facilities)**
- **Phase 6 — Analytics & AI Dashboards**
- **Phase 7 — Production Hardening & CI/CD**

---

## 6. License & Institutional Attribution
Proprietary & Confidential — Developed for Modern University / Higher Education Enterprise Operations.

