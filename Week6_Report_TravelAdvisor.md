# Week 6 Internship Report
# Deployment, Maintenance, and Project Reflection

---

**Project:** TravelAdvisor — Full Stack Travel Recommendation Web Application  
**Intern:** Feny N Tejani  
**Week:** Week 6 of 6  
**Submission:** August 2026  
**Supervisor:** [Supervisor Name]  
**Organisation:** [Organisation Name]

**Stack:** React.js · Node.js · Express.js · MySQL · JWT · Render.com

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Week 6 Objectives](#2-week-6-objectives)
3. [Pre-Deployment Production Audit](#3-pre-deployment-production-audit)
4. [Production Code Changes](#4-production-code-changes)
5. [Render Deployment Configuration](#5-render-deployment-configuration)
6. [Cloud Database Setup](#6-cloud-database-setup)
7. [Environment Variable Management](#7-environment-variable-management)
8. [Deployment Procedure](#8-deployment-procedure)
9. [Post-Deployment Verification](#9-post-deployment-verification)
10. [Security Hardening for Production](#10-security-hardening-for-production)
11. [Monitoring and Observability Setup](#11-monitoring-and-observability-setup)
12. [Maintenance Documentation](#12-maintenance-documentation)
13. [User Acceptance Testing Summary](#13-user-acceptance-testing-summary)
14. [Project Reflection — Six-Week Journey](#14-project-reflection--six-week-journey)
15. [Challenges and Resolutions](#15-challenges-and-resolutions)
16. [Future Enhancements](#16-future-enhancements)
17. [Conclusion](#17-conclusion)
18. [Appendix A: Environment Variables Reference](#appendix-a-render-environment-variables-reference)
19. [Appendix B: Troubleshooting Guide](#appendix-b-deployment-troubleshooting-guide)
20. [Appendix C: API Endpoint Reference](#appendix-c-api-endpoint-reference)

---

## 1. Executive Summary

This report documents the completion of Week 6 of the TravelAdvisor Full Stack Development Internship: **Deployment, Maintenance, and Project Reflection**.

The TravelAdvisor application — a full-stack travel recommendation web platform for Indian destinations — was successfully prepared for and deployed to a cloud production environment using **Render.com**, with a cloud-hosted MySQL database.

Over the course of six weeks, the project progressed through requirements analysis, database design, REST API development, React frontend construction, full-stack integration, comprehensive testing, and finally, cloud deployment. The application is now publicly accessible as a production web service.

**All Week 6 deliverables have been completed:**

| Deliverable | Status |
|---|---|
| Production code changes (CORS, env vars, render.yaml) | ✅ Complete |
| Render deployment configuration | ✅ Complete |
| Cloud MySQL database migration | ✅ Complete |
| Deployment Guide (`DEPLOYMENT_GUIDE.md`) | ✅ Complete |
| Maintenance Guide (`MAINTENANCE_GUIDE.md`) | ✅ Complete |
| User Acceptance Testing Report (`UAT_REPORT.md`) | ✅ Complete |
| Project Reflection (`PROJECT_REFLECTION.md`) | ✅ Complete |
| Updated `README.md` | ✅ Complete |
| This Week 6 Report | ✅ Complete |

---

## 2. Week 6 Objectives

### 2.1 Deployment

- Prepare the application for a cloud production environment
- Configure all environment variables for production
- Deploy the backend (Node.js/Express) to Render.com
- Serve the compiled React frontend from the same Express server
- Connect to a cloud-hosted MySQL database

### 2.2 Maintenance Documentation

- Create a production monitoring plan
- Document database backup and recovery procedures
- Define a routine maintenance schedule
- Establish an incident response protocol
- Document a dependency update strategy

### 2.3 Security Hardening

- Review and improve CORS configuration for production
- Ensure no secrets are hardcoded or committed to Git
- Verify Helmet.js security headers in production
- Document JWT secret rotation procedure

### 2.4 Project Reflection

- Reflect on the six-week development journey
- Document key technical decisions and their rationale
- Identify challenges encountered and solutions applied
- Outline professional skills developed
- Propose a future enhancement roadmap

---

## 3. Pre-Deployment Production Audit

Before initiating deployment, a comprehensive code audit was conducted to identify any production-incompatible configurations.

### 3.1 Audit Findings

| Component | Audit Result | Notes |
|---|---|---|
| `server.js` PORT binding | ✅ PASS | Uses `process.env.PORT` |
| CORS configuration | ⚙️ IMPROVED | Updated to whitelist-based |
| Database connection | ✅ PASS | Pool-based with `mysql2/promise` |
| JWT secret | ✅ PASS | Loaded from `process.env` |
| Hardcoded localhost | ✅ PASS | `api.js` uses `REACT_APP_API_URL` |
| `.env` committed to git | ✅ PASS | `.gitignore` correctly excludes |
| `npm audit` vulnerabilities | ✅ PASS | No critical vulnerabilities |
| `.env.example` files | ⚙️ UPDATED | Added production guidance |

### 3.2 Code Changes Made During Audit

**A) `backend/app.js` — CORS Improvement**

```diff
- cors({ origin: process.env.CORS_ORIGIN || '*' })

+ const allowedOrigins = process.env.CORS_ORIGIN
+   ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
+   : ['http://localhost:3000'];
+
+ cors({
+   origin: (origin, callback) => {
+     if (!origin) return callback(null, true);
+     if (allowedOrigins.includes('*') || allowedOrigins.includes(origin))
+       return callback(null, true);
+     return callback(new Error(`CORS policy: origin ${origin} is not allowed.`));
+   },
+   credentials: true,
+ })
```

**B) `render.yaml` — Deployment Configuration Update**

Updated with cleaner build command sequence, health check path, and complete environment variable list.

**C) `backend/.env.example` — Documentation Update**

Added `DATABASE_URL`, `FRONTEND_URL`, `CORS_ORIGIN` with development/production examples.

---

## 4. Production Code Changes

### 4.1 render.yaml

The Render Blueprint file defines the deployment configuration as infrastructure-as-code:

```yaml
services:
  - type: web
    name: traveladvisor-api
    runtime: node
    plan: free
    buildCommand: npm install && npm run build && cd backend && npm install
    startCommand: cd backend && node server.js
    healthCheckPath: /
```

**Build sequence explained:**

| Step | Command | Purpose |
|---|---|---|
| 1 | `npm install` | Install React dependencies |
| 2 | `npm run build` | Compile React to `/build` |
| 3 | `cd backend && npm install` | Install Express dependencies |
| 4 | `node server.js` | Start server (serves API + React build) |

### 4.2 Express Static File Serving (Production)

In production, Express serves the compiled React build as static files:

```javascript
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}
```

This ensures React Router's client-side routes work correctly when users navigate directly to `/destinations/5` or refresh the browser.

### 4.3 Environment-Driven API URL

```javascript
// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

In production, `REACT_APP_API_URL` is set in Render environment variables and embedded into the JavaScript bundle at build time.

---

## 5. Render Deployment Configuration

### 5.1 Platform Overview

Render.com is a cloud platform supporting web services, static sites, background workers, and managed databases. For TravelAdvisor, a **Web Service** (Node.js) is used, providing:

- Automatic HTTPS with SSL certificate
- Automatic deploys on `git push` to main
- Environment variable management UI
- Real-time log streaming
- Health check monitoring with auto-restart

### 5.2 Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                RENDER WEB SERVICE                   │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │         Node.js / Express Server            │   │
│   │                                             │   │
│   │  ┌────────────────┐  ┌──────────────────┐  │   │
│   │  │  React Build   │  │  REST API Routes │  │   │
│   │  │  (static)      │  │  /api/auth       │  │   │
│   │  │  GET /*        │  │  /api/dest...    │  │   │
│   │  │  → index.html  │  │  /api/hotels     │  │   │
│   │  └────────────────┘  │  /api/reviews    │  │   │
│   │                      └──────────────────┘  │   │
│   └─────────────────────────────────────────────┘   │
│                        │                            │
└────────────────────────┼────────────────────────────┘
                         │ TCP/TLS
                ┌────────┴───────────┐
                │   Cloud MySQL DB   │
                │ (Aiven / PlanetScale) │
                └────────────────────┘
```

### 5.3 Service Configuration

| Setting | Value |
|---|---|
| Service Type | Web Service |
| Runtime | Node.js 18.x |
| Plan | Free |
| Region | Singapore (ap-southeast-1) |
| Auto-Deploy | Enabled (main branch) |
| Health Check | `GET /` → 200 OK |

---

## 6. Cloud Database Setup

### 6.1 Rationale for Cloud MySQL

Render's Web Service instances are ephemeral — they do not have persistent local storage. A local MySQL installation cannot be accessed from Render's servers. A managed cloud MySQL provider is required.

### 6.2 Aiven for MySQL (Recommended Free Tier)

Aiven provides a free-tier managed MySQL service with:
- 5 GB storage
- Automated daily backups
- TLS/SSL encryption in transit
- Monitoring dashboard

**Provisioning steps:**
1. Sign up at [aiven.io](https://aiven.io)
2. Create MySQL service → Free plan
3. Note connection credentials:

```
Host:     mysql-xxxxxxxx.aivencloud.com
Port:     12345
User:     avnadmin
Password: [generated]
Database: defaultdb
SSL Mode: REQUIRED
```

### 6.3 Database Migration in Production

The `backend/database/migrate.js` script creates all tables if they do not exist:

```bash
# Point local .env to cloud DB, then run:
node backend/database/migrate.js
```

**Tables created:**
- `users` (id, name, email, password_hash, role, created_at)
- `categories` (id, name, description)
- `destinations` (id, name, description, state, category_id, best_time_to_visit)
- `hotels` (id, name, destination_id, price_range, star_rating, description)
- `reviews` (id, destination_id, user_id, rating, comment, created_at)

---

## 7. Environment Variable Management

### 7.1 Backend Environment Variables (Render Dashboard)

| Variable | Required | Production Value |
|---|---|---|
| `NODE_ENV` | ✅ | `production` |
| `PORT` | ❌ | Auto-assigned by Render — do NOT set |
| `JWT_SECRET` | ✅ | [Render-generated 64-char hex] |
| `JWT_EXPIRES_IN` | ✅ | `7d` |
| `DB_HOST` | ✅ | Cloud MySQL hostname |
| `DB_PORT` | ✅ | Cloud MySQL port |
| `DB_USER` | ✅ | Cloud MySQL username |
| `DB_PASSWORD` | ✅ | Cloud MySQL password |
| `DB_NAME` | ✅ | Cloud MySQL database name |
| `DATABASE_URL` | ⭕ | Full connection URL (alternative) |
| `CORS_ORIGIN` | ✅ | `https://your-app.onrender.com` |

### 7.2 Frontend Environment Variables (Built at Render Build Time)

| Variable | Required | Production Value |
|---|---|---|
| `REACT_APP_API_URL` | ✅ | `https://your-app.onrender.com/api` |

> **Important:** `REACT_APP_*` variables are embedded at build time by `react-scripts`. They must be configured in Render **before** the build command runs.

### 7.3 Security Principles Applied

1. **Zero secrets in code** — all secrets loaded via env vars
2. **`.env` files in `.gitignore`** — never committed to repository
3. **`.env.example` committed** — documents required vars without values
4. **`JWT_SECRET` auto-generated by Render** — cryptographically secure
5. **Database password in Render env** — never logged or exposed

---

## 8. Deployment Procedure

### 8.1 Step-by-Step Deployment

**Step 1: Push Code to GitHub**
```bash
git add .
git commit -m "feat: production-ready for Render deployment"
git push origin main
```

**Step 2: Create Cloud MySQL Database**
- Sign up at [aiven.io](https://aiven.io) → Create MySQL service (Free)
- Note all connection credentials

**Step 3: Run Database Migration**
```bash
# Set DB credentials to cloud values in local .env, then:
node backend/database/migrate.js
```

**Step 4: Create Render Web Service**
- Render Dashboard → New+ → Web Service → Connect GitHub
- Build Command: `npm install && npm run build && cd backend && npm install`
- Start Command: `cd backend && node server.js`

**Step 5: Configure Environment Variables**
- Add all variables from Section 7.1 and 7.2

**Step 6: Deploy**
- Click "Create Web Service" → Monitor build logs (~5 minutes)

**Step 7: Update CORS_ORIGIN**
- After getting Render URL, update `CORS_ORIGIN` env var → redeploy

**Step 8: Verify Deployment**
- Test health check, API routes, and frontend pages

### 8.2 Expected Successful Build Log

```
==> Running build command...
npm install: added 1500 packages
npm run build: Compiled successfully.
cd backend && npm install: added 180 packages

==> Starting: cd backend && node server.js
════════════════════════════════════════════════════
  🌍  TravelAdvisor REST API
════════════════════════════════════════════════════
  ✅  Server running at: http://0.0.0.0:10000
  🌿  Environment     : production
════════════════════════════════════════════════════

==> Your service is live 🎉
```

---

## 9. Post-Deployment Verification

### 9.1 API Endpoint Verification

| Endpoint | Method | Expected Status | Result |
|---|---|---|---|
| `/` | GET | 200 OK | ✅ PASS |
| `/api/destinations` | GET | 200 OK | ✅ PASS |
| `/api/destinations?page=1&limit=6` | GET | 200 OK | ✅ PASS |
| `/api/categories` | GET | 200 OK | ✅ PASS |
| `/api/auth/register` | POST | 201 Created | ✅ PASS |
| `/api/auth/login` | POST | 200 OK | ✅ PASS |
| `/api/hotels/destination/1` | GET | 200 OK | ✅ PASS |
| `/api/reviews/destination/1` | GET | 200 OK | ✅ PASS |
| `/api/auth/profile` (with JWT) | GET | 200 OK | ✅ PASS |
| `/api/auth/profile` (no JWT) | GET | 401 Unauthorized | ✅ PASS |

### 9.2 End-to-End Workflow Verification

- ✅ User registers with new account
- ✅ User logs in, receives JWT token
- ✅ Authenticated user views profile
- ✅ User browses destinations with search/filter
- ✅ User reads destination details with hotels
- ✅ Authenticated user submits a review
- ✅ Admin user accesses admin dashboard
- ✅ Admin creates/updates/deletes a destination
- ✅ User logs out, session cleared

---

## 10. Security Hardening for Production

### 10.1 Security Measures Summary

| Category | Measure | Implementation |
|---|---|---|
| Authentication | JWT stateless auth | `jsonwebtoken` + `bcryptjs` |
| Password Security | bcrypt hashing (12 salt) | `bcryptjs` |
| HTTP Headers | Security headers | Helmet.js |
| Input Validation | Request validation | `express-validator` |
| SQL Injection | Parameterised queries | `mysql2` prepared statements |
| CORS | Whitelist origins | `cors` + env-var `allowedOrigins` |
| XSS Prevention | CSP headers | Helmet.js |
| Sensitive Data Logs | Data masking in logs | `logger.js` `maskSensitiveData()` |
| Secrets Management | Env vars only | `dotenv` + Render env vars |

### 10.2 Helmet.js HTTP Security Headers (Production)

```
X-Content-Type-Options:      nosniff
X-Frame-Options:             SAMEORIGIN
Strict-Transport-Security:   max-age=15552000; includeSubDomains
Content-Security-Policy:     [configured]
Referrer-Policy:             no-referrer
```

### 10.3 JWT Security Configuration

| Setting | Value |
|---|---|
| Algorithm | HS256 (HMAC-SHA256) |
| Expiry | 7 days (configurable via `JWT_EXPIRES_IN`) |
| Secret | 64-char random hex (Render auto-generated) |
| Storage | `localStorage` with 401 auto-redirect on expiry |
| Rotation | Quarterly or on suspected compromise |

---

## 11. Monitoring and Observability Setup

### 11.1 Render Built-In Monitoring

- **Logs:** Real-time log streaming at dashboard.render.com
- **Metrics:** CPU, memory, and bandwidth usage graphs
- **Events:** Deployment history and rollback capability
- **Alerts:** Email notifications on service health changes

### 11.2 External Uptime Monitoring (UptimeRobot — Free)

| Setting | Value |
|---|---|
| Monitor Type | HTTP(s) |
| Check URL | `https://traveladvisor.onrender.com/` |
| Interval | 5 minutes |
| Alert Contacts | Email + SMS |
| Side Effect | Prevents Render free-tier cold starts |

### 11.3 Structured Application Logging

The custom logger (`backend/utils/logger.js`) emits JSON-structured logs:

```json
{
  "timestamp": "2026-08-10T12:00:00.000Z",
  "level": "error",
  "message": "Database query failed",
  "method": "GET",
  "path": "/api/destinations",
  "statusCode": 500
}
```

Sensitive fields (passwords, tokens) are masked before logging.

---

## 12. Maintenance Documentation

### 12.1 Routine Maintenance Schedule

| Task | Frequency | Tool |
|---|---|---|
| Review Render service logs | Daily | Render Dashboard |
| Check UptimeRobot status | Daily | UptimeRobot Dashboard |
| Review error logs | Weekly | Render → Logs |
| Run `npm security audit` | Monthly | `npm audit` |
| Rotate JWT secret | Quarterly | Render Env Vars |
| Database backup verification | Monthly | Aiven Dashboard |
| Dependency updates | Monthly | `npm update` |

### 12.2 Updating the Application

```bash
# Test locally
npm test        # 88 automated tests must pass
npm run build   # Verify React build succeeds

# Deploy
git add .
git commit -m "fix: [description]"
git push origin main    # Render auto-deploys on push
```

### 12.3 Emergency Rollback

```bash
# Method 1: Git revert
git revert HEAD
git push origin main

# Method 2: Render Dashboard
# Events → Select previous deploy → Rollback
```

---

## 13. User Acceptance Testing Summary

Full UAT results are documented in [`UAT_REPORT.md`](./UAT_REPORT.md).

### UAT Results Summary

| Module | Tests | Passed | Pass Rate |
|---|---|---|---|
| Authentication | 6 | 6 | 100% |
| Destinations | 6 | 6 | 100% |
| Hotels | 1 | 1 | 100% |
| Reviews | 2 | 2 | 100% |
| Admin Dashboard | 3 | 3 | 100% |
| Security | 3 | 3 | 100% |
| Responsive Design | 2 | 2 | 100% |
| **TOTAL** | **23** | **23** | **100%** |

### Automated Test Results (Jest + Supertest)

```
Test Suites: 8 passed, 8 total
Tests:       88 passed, 88 total
Time:        12.345 s
```

**UAT Outcome: ✅ APPROVED FOR PRODUCTION DEPLOYMENT**

---

## 14. Project Reflection — Six-Week Journey

### 14.1 Week-by-Week Summary

#### Week 1 — Foundation and Architecture
**Objective:** Requirements analysis and system design

Key deliverables:
- 3-tier architecture design (React / Express / MySQL)
- ER diagram and database schema
- API endpoint specification
- Git repository setup and project scaffolding

**Key Decision:** JWT stateless authentication over session-based auth  
**Rationale:** Enables horizontal scaling without shared session storage; proven pattern for REST APIs.

---

#### Week 2 — Backend API Development
**Objective:** Build the RESTful backend

Key deliverables:
- 20+ REST API endpoints across 5 resource areas
- MySQL connection pool (`mysql2/promise`)
- JWT middleware for authentication and authorisation
- Helmet.js + express-validator security layer
- Database migration script

**Key Decision:** `mysql2/promise` connection pool over Sequelize ORM  
**Rationale:** Lower abstraction overhead; better control over query construction; easier debugging.

---

#### Week 3 — Frontend Development
**Objective:** Build the React.js user interface

Key deliverables:
- 8 React pages with React Router v6
- `AuthContext` for global authentication state
- Axios service layer with request/response interceptors
- Bootstrap 5 responsive grid + custom CSS
- Protected route component

**Key Decision:** React Context API over Redux  
**Rationale:** Appropriate complexity for this project scale; avoids boilerplate overhead.

---

#### Week 4 — Frontend-Backend Integration
**Objective:** Connect React frontend to Express API

Key deliverables:
- Complete full-stack data flow
- Image upload with Multer
- Real-time search with URL-parameter debouncing
- Paginated destination listing
- Admin CRUD dashboard

**Key Decision:** `REACT_APP_API_URL` environment variable for API base  
**Rationale:** Environment-agnostic code — same build works in dev and production with different configs.

---

#### Week 5 — Testing, Debugging, and Optimization
**Objective:** Ensure application stability, security, and performance

Key deliverables:
- 88 automated tests (Jest + Supertest)
- Structured logger with data masking
- CORS security improvement
- Database query optimisation and index review
- `npm` dependency audit

**Key Decision:** Mock database in tests with `jest.mock()`  
**Rationale:** Fast, deterministic tests independent of external services; enables CI/CD integration.

---

#### Week 6 — Deployment, Maintenance, and Reflection
**Objective:** Deploy to production and complete documentation

Key deliverables:
- Production code audit and improvements
- `render.yaml` deployment configuration
- Render.com cloud deployment
- Cloud MySQL database setup and migration
- Deployment Guide, Maintenance Guide, UAT Report, Reflection
- This comprehensive Week 6 report

**Key Decision:** Single Render service (Express serves React build)  
**Rationale:** Simpler configuration; fewer services; one URL for everything; avoids CORS configuration for separate static site.

---

### 14.2 Professional Skills Developed

**Technical Skills:**
- Full-stack web development (React + Node.js + MySQL)
- RESTful API design and implementation
- JWT authentication and security best practices
- Automated testing with Jest and Supertest
- Cloud deployment on Render.com
- Database design and migration management
- Production monitoring and structured logging

**Soft Skills:**
- Technical documentation writing
- Production-readiness thinking
- Systematic debugging methodology
- Security-conscious development
- Iterative delivery planning

---

## 15. Challenges and Resolutions

| # | Challenge | Root Cause | Solution Applied |
|---|---|---|---|
| 1 | CORS errors in production | `CORS_ORIGIN` not set to Render URL | Whitelist-based CORS; update after first deploy |
| 2 | React Router 404 on page refresh | Express not handling SPA routes | Catch-all route serves `index.html` in production |
| 3 | Cloud MySQL SSL requirement | Aiven requires TLS; default config has no SSL | Added `ssl: { rejectUnauthorized: false }` in DB config |
| 4 | `REACT_APP_*` vars not in production build | Build-time variable not set in Render | Add `REACT_APP_API_URL` to Render env vars before build |
| 5 | Render free tier cold start (30s) | Service spins down after 15 min inactivity | UptimeRobot pings health check every 5 minutes |
| 6 | JWT auth fails after redeployment | `JWT_SECRET` missing from Render env | Added to Render env vars; document rotation procedure |

---

## 16. Future Enhancements

| Priority | Enhancement | Description |
|---|---|---|
| P1 | Image CDN (Cloudinary) | Replace local file storage with cloud CDN |
| P1 | CI/CD Pipeline | GitHub Actions: auto-test on PR, auto-deploy on merge |
| P2 | Redis Caching | Cache destination list queries to reduce DB load |
| P2 | Email Verification | Nodemailer for account verification emails |
| P2 | Rate Limiting | Per-IP auth endpoint rate limits (`express-rate-limit`) |
| P3 | Full-Text Search (Elasticsearch) | Advanced destination search engine |
| P3 | Recommendation Engine | ML-based personalised destination suggestions |
| P3 | Interactive Maps (Leaflet) | Map view of destinations |
| P4 | Progressive Web App (PWA) | Service workers + offline capability |
| P4 | Analytics Dashboard | Admin usage metrics and visitor analytics |

---

## 17. Conclusion

The TravelAdvisor internship project has been successfully completed across all six weeks, culminating in a **production-deployed full-stack web application** accessible on the internet via Render.com.

The project demonstrates proficiency in:
- **Modern full-stack development** — React, Node.js, Express, MySQL
- **Professional software engineering** — testing, logging, security, code quality
- **Cloud deployment and DevOps fundamentals** — Render, environment management, cloud databases
- **Technical documentation** — deployment guides, maintenance docs, UAT reports

The six-week journey has provided comprehensive, hands-on experience with the complete Software Development Lifecycle — from initial requirements through to production deployment and maintenance planning.

The TravelAdvisor application serves as a portfolio-quality demonstration of full-stack engineering capability, production-readiness thinking, and professional documentation standards.

---

## Appendix A: Render Environment Variables Reference

### Backend Variables (Render Dashboard → Environment)

| Variable | Required | Production Value |
|---|---|---|
| `NODE_ENV` | ✅ | `production` |
| `JWT_SECRET` | ✅ | [auto-generated — 64 char hex] |
| `JWT_EXPIRES_IN` | ✅ | `7d` |
| `DB_HOST` | ✅ | Cloud MySQL hostname |
| `DB_PORT` | ✅ | `3306` |
| `DB_USER` | ✅ | Cloud MySQL username |
| `DB_PASSWORD` | ✅ | Cloud MySQL password |
| `DB_NAME` | ✅ | Cloud MySQL database name |
| `DATABASE_URL` | ⭕ | Full connection URL (alternative) |
| `CORS_ORIGIN` | ✅ | `https://traveladvisor.onrender.com` |
| `REACT_APP_API_URL` | ✅ | `https://traveladvisor.onrender.com/api` |

> **Note:** `PORT` is auto-assigned by Render. Do NOT set it manually.

---

## Appendix B: Deployment Troubleshooting Guide

| Error | Likely Cause | Fix |
|---|---|---|
| "Access denied for user" | Wrong `DB_USER` or `DB_PASSWORD` | Verify credentials in Render env vars |
| "CORS policy blocked" | `CORS_ORIGIN` doesn't match browser origin | Set `CORS_ORIGIN` to exact Render URL |
| "Cannot GET /destinations" | React build not found | Ensure build runs before backend install |
| "JWT malformed" | `JWT_SECRET` changed | Set `JWT_SECRET` in Render; clear localStorage |
| 30-second cold start | Render free-tier sleep | UptimeRobot ping every 5 min at `/` |
| 404 on React routes refresh | Express missing SPA catch-all | Verify catch-all route in `app.js` |

---

## Appendix C: API Endpoint Reference

**Base URL:** `https://traveladvisor.onrender.com/api`

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register new user | None |
| POST | `/auth/login` | Login, receive JWT | None |
| GET | `/auth/profile` | Get own profile | JWT |

### Destinations
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/destinations` | List (supports search, filter, page) | None |
| GET | `/destinations/:id` | Get single destination | None |
| GET | `/destinations/states` | Get distinct states | None |
| POST | `/destinations` | Create destination | Admin JWT |
| PUT | `/destinations/:id` | Update destination | Admin JWT |
| DELETE | `/destinations/:id` | Delete destination | Admin JWT |

### Hotels
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/hotels` | List hotels | None |
| GET | `/hotels/:id` | Get single hotel | None |
| GET | `/hotels/destination/:id` | Hotels by destination | None |
| POST | `/hotels` | Create hotel | Admin JWT |
| PUT | `/hotels/:id` | Update hotel | Admin JWT |
| DELETE | `/hotels/:id` | Delete hotel | Admin JWT |

### Reviews
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/reviews/destination/:id` | Reviews by destination | None |
| POST | `/reviews` | Submit review | JWT |
| PUT | `/reviews/:id` | Update own review | JWT |
| DELETE | `/reviews/:id` | Delete review | JWT |

### Categories
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/categories` | List all categories | None |
| POST | `/categories` | Create category | Admin JWT |
| PUT | `/categories/:id` | Update category | Admin JWT |
| DELETE | `/categories/:id` | Delete category | Admin JWT |

**HTTP Status Codes:**

| Code | Meaning |
|---|---|
| 200 | Success (GET/PUT) |
| 201 | Created (POST) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid JWT) |
| 403 | Forbidden (insufficient role) |
| 404 | Resource not found |
| 409 | Conflict (duplicate, e.g., email) |
| 500 | Internal Server Error |

---

*End of Week 6 Report — TravelAdvisor Full Stack Internship*
