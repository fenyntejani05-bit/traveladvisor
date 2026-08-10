# TravelAdvisor — Full Stack Application

> **Week 6 — Deployment, Maintenance, and Project Reflection**  
> A production-deployed, fully tested, and cloud-hosted travel recommendation web application for discovering tourist destinations and hotels across India.

🌐 **Live App:** `https://traveladvisor.onrender.com` *(update after first deploy)*

---

## Table of Contents

1. [Project Overview](#1-project-overview)  
2. [Tech Stack](#2-tech-stack)  
3. [Architecture](#3-architecture)  
4. [Project Structure](#4-project-structure)  
5. [Prerequisites & Installation](#5-prerequisites--installation)  
6. [Database Setup](#6-database-setup)  
7. [Running the Application](#7-running-the-application)  
8. [API Integration Process](#8-api-integration-process)  
9. [Authentication Flow](#9-authentication-flow)  
10. [Key Features](#10-key-features)  
11. [Challenges Faced & Solutions](#11-challenges-faced--solutions)  
12. [API Endpoints Reference](#12-api-endpoints-reference)  
13. [Backend Unit Tests](#13-backend-unit-tests)  
14. [Deployment on Render](#14-deployment-on-render)  
15. [Environment Variables](#15-environment-variables)  
16. [Future Improvements](#16-future-improvements)  

---

## 1. Project Overview

**TravelAdvisor** is a full-stack travel recommendation platform where users can:

- Browse and search tourist destinations across India
- Filter by **category** (Beaches, Hills, Heritage, Adventure, Wildlife) and **state**
- View destination details including galleries, hotels, and user reviews
- Register, log in, and manage their personal profile
- Submit, edit, and delete reviews (authenticated users)
- Admin users can create, edit, and delete destinations and hotels via a dedicated Admin Panel

This README covers the **Week 4 Full Stack Integration** — connecting the React frontend to the Node.js/Express/MySQL backend via RESTful APIs.

---

## 2. Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework with hooks |
| React Router DOM v6 | Client-side routing |
| Axios | HTTP client with interceptors |
| Bootstrap 5 | Responsive layout utility classes |
| Bootstrap Icons | Icon library |
| React Context API | Global authentication state |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | RESTful API server |
| MySQL | Relational database |
| JWT (jsonwebtoken) | Stateless authentication tokens |
| bcrypt | Password hashing |
| express-validator | Input validation middleware |
| helmet | HTTP security headers |
| cors | Cross-Origin Resource Sharing |
| morgan | HTTP request logger |
| multer | File/image upload handling |
| dotenv | Environment variable management |

---

## 3. Architecture

```
┌──────────────────────────────────────────────────────┐
│                  REACT FRONTEND                        │
│  (localhost:3000)                                      │
│                                                        │
│  AuthContext  ──►  Protected Routes                    │
│  Axios Instance ──► Request Interceptor (Bearer Token) │
│                     Response Interceptor (401 handler) │
└──────────────────────────┬───────────────────────────┘
                           │  HTTP / REST
                           ▼
┌──────────────────────────────────────────────────────┐
│                 EXPRESS.JS BACKEND                     │
│  (localhost:5000)                                      │
│                                                        │
│  Routes ─► Controllers ─► Models ─► MySQL DB          │
│  Middleware: JWT Auth, Validation, Helmet, CORS        │
└──────────────────────────┬───────────────────────────┘
                           │  SQL Queries
                           ▼
                ┌─────────────────┐
                │  MySQL Database │
                │  travel_advisor_db │
                └─────────────────┘
```

**Pattern**: MVC (Model-View-Controller) on the backend, Context + Hooks on the frontend.

---

## 4. Project Structure

```
traveladvisor/                    ← Root (Frontend)
├── public/
├── src/
│   ├── components/
│   │   ├── Header.js             ← Dynamic auth-aware navbar
│   │   ├── Footer.js
│   │   └── ProtectedRoute.js     ← Route guard (auth + admin)
│   ├── context/
│   │   └── AuthContext.js        ← Global JWT session state
│   ├── pages/
│   │   ├── HomePage.js           ← Trending destinations (live data)
│   │   ├── DestinationListingPage.js  ← Search, filter, pagination
│   │   ├── DestinationDetailsPage.js  ← Details, hotels, reviews CRUD
│   │   ├── LoginPage.js          ← JWT login
│   │   ├── RegistrationPage.js   ← User registration
│   │   ├── ProfilePage.js        ← User profile + their reviews
│   │   └── AdminDashboardPage.js ← Admin CRUD panel
│   ├── services/
│   │   └── api.js                ← Axios instance + all service calls
│   ├── App.js                    ← Routes with AuthProvider
│   └── App.css                   ← Global design system
├── .env                          ← REACT_APP_API_URL
├── .env.example
├── package.json
│
└── backend/                      ← Backend (API Server)
    ├── config/
    │   └── db.js                 ← MySQL connection pool
    ├── controllers/
    │   ├── authController.js
    │   ├── destinationController.js
    │   ├── hotelController.js
    │   ├── reviewController.js
    │   └── categoryController.js
    ├── middleware/
    │   ├── auth.js               ← JWT verification
    │   ├── adminAuth.js          ← Admin role guard
    │   └── upload.js             ← Multer file upload
    ├── models/
    │   ├── User.js
    │   ├── Destination.js
    │   ├── Hotel.js
    │   ├── Review.js
    │   └── Category.js
    ├── routes/
    │   ├── auth.js
    │   ├── destinations.js
    │   ├── hotels.js
    │   ├── reviews.js
    │   └── categories.js
    ├── tests/
    │   ├── auth.test.js
    │   ├── destinations.test.js
    │   ├── hotels.test.js
    │   ├── reviews.test.js
    │   └── categories.test.js
    ├── docs/
    │   └── API_DOCUMENTATION.md
    ├── uploads/
    ├── .env
    ├── .env.example
    ├── server.js
    └── package.json
```

---

## 5. Prerequisites & Installation

### Requirements
- Node.js v16 or higher
- MySQL 8.0+
- npm v8+

### Step 1 — Clone / Open the Project

```bash
cd traveladvisor
```

### Step 2 — Install Frontend Dependencies

```bash
npm install
```

### Step 3 — Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

---

## 6. Database Setup

### Step 1 — Create the MySQL Database

```sql
CREATE DATABASE travel_advisor_db;
USE travel_advisor_db;
```

### Step 2 — Run the Schema

Import the provided SQL schema file:

```bash
mysql -u root -p travel_advisor_db < backend/database/schema.sql
```

Or run it directly in MySQL Workbench.

### Step 3 — Seed Sample Data

```bash
mysql -u root -p travel_advisor_db < backend/database/seed.sql
```

This inserts:
- 5 destination categories
- 15 sample destinations across India
- 20+ hotels linked to destinations
- 2 user accounts (`admin@traveladvisor.com` / `user@traveladvisor.com`)

### Step 4 — Configure Backend Environment

Create `backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=travel_advisor_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

### Step 5 — Configure Frontend Environment

Verify `traveladvisor/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 7. Running the Application

Open **two terminal windows**:

### Terminal 1 — Start Backend

```bash
cd traveladvisor/backend
npm run dev
```

✅ Backend running at: `http://localhost:5000`  
✅ Health check: `GET http://localhost:5000/api/health`

### Terminal 2 — Start Frontend

```bash
cd traveladvisor
npm start
```

✅ Frontend running at: `http://localhost:3000`

---

## 8. API Integration Process

### Axios Instance (`src/services/api.js`)

A central Axios instance handles all HTTP communication:

```js
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});
```

**Request Interceptor** — automatically injects JWT token:
```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('travelAdvisorToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Response Interceptor** — handles token expiry globally:
```js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('travelAdvisorToken');
      localStorage.removeItem('travelAdvisorUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Service Modules

Each backend resource has a dedicated service object:

| Service | Methods |
|---|---|
| `authService` | `login`, `register`, `getProfile` |
| `destinationService` | `getAll`, `getById`, `create`, `update`, `delete`, `getStates` |
| `hotelService` | `getAll`, `getByDestination`, `create`, `update`, `delete` |
| `reviewService` | `getByDestination`, `create`, `update`, `delete` |
| `categoryService` | `getAll` |

---

## 9. Authentication Flow

```
User submits login credentials
       │
       ▼
POST /api/auth/login
       │
       ▼
Backend validates credentials with bcrypt
       │
       ▼
Returns JWT token (expires in 7 days)
       │
       ▼
AuthContext stores token in localStorage
       │
       ▼
Axios interceptor injects token in every subsequent request
       │
       ▼
Protected routes check isAuthenticated (via AuthContext)
Admin routes additionally check isAdmin (role === 'admin')
```

### Session Persistence
On app load, `AuthContext` reads `localStorage`:
```js
const storedToken = localStorage.getItem('travelAdvisorToken');
const storedUser = localStorage.getItem('travelAdvisorUser');
```
If a token exists, it calls `GET /api/auth/profile` to validate and refresh the user state.

### Role-Based Access Control (RBAC)
- **Public**: Home, Destinations, Details
- **Authenticated users**: Profile, Submit Reviews, Edit/Delete own reviews
- **Admin users**: Admin Dashboard (`/admin`) — full CRUD on destinations and hotels

---

## 10. Key Features

| Feature | Details |
|---|---|
| 🔍 Search & Filter | Real-time search by name/state/city, filter by category, filter by state |
| 📃 Pagination | Backend-driven page-by-page navigation on destinations listing |
| 🔐 JWT Auth | Secure login/registration with bcrypt + JWT tokens |
| ⭐ Review CRUD | Authenticated users submit, edit, delete reviews; ratings recalculate |
| 👤 Profile Dashboard | Users see their details, membership date, and submitted reviews |
| 🛡️ Admin Panel | Admins manage destinations and hotels (create/edit/delete via modals) |
| 📱 Responsive UI | Mobile-first design with Bootstrap 5 |
| 🔒 Security | Helmet HTTP headers, CORS policy, input validation, rate limiting |
| 🏨 Hotel Listings | Hotels displayed per destination with price, rating, and location |

---

## 11. Challenges Faced & Solutions

### Challenge 1 — CORS Blocking API Requests
**Problem**: The React dev server on port 3000 was being blocked by the Express API on port 5000 due to missing CORS headers.  
**Solution**: Configured the `cors` npm package in `server.js` with an explicit origin whitelist:
```js
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
```

---

### Challenge 2 — JWT Token Expiry Causing Silent Failures
**Problem**: Expired tokens would cause API calls to fail silently with `401 Unauthorized`, leaving users stuck on pages with empty data.  
**Solution**: Added a global Axios **response interceptor** that catches `401` errors, clears `localStorage`, and redirects to `/login` automatically.

---

### Challenge 3 — API Payload Field Name Mismatches
**Problem**: The backend expected snake_case field names (`hotel_name`, `price_per_night`) but early frontend forms were sending camelCase (`hotelName`, `pricePerNight`), causing `400 Bad Request` validation errors.  
**Solution**: Standardized all form payloads to use snake_case to match backend `express-validator` schema definitions.

---

### Challenge 4 — React State Race Conditions on Async Loads
**Problem**: On the `DestinationDetailsPage`, simultaneously fetching destination details, hotels, and reviews caused UI flickers and incomplete renders if the three `await` calls were sequential.  
**Solution**: Used `Promise.all()` to fetch all three resources in parallel:
```js
const [destRes, hotelsRes, reviewsRes] = await Promise.all([
  destinationService.getById(id),
  hotelService.getByDestination(id),
  reviewService.getByDestination(id),
]);
```

---

### Challenge 5 — Keeping Auth State Across Page Refreshes
**Problem**: React Context is in-memory; a browser refresh wiped the auth state, logging users out unintentionally.  
**Solution**: Persisted `token` and `user` JSON in `localStorage`. On app boot, `AuthContext` reads these values and re-validates via `GET /api/auth/profile`.

---

### Challenge 6 — Database Connection Pool Exhaustion During Tests
**Problem**: Running Jest tests rapidly opened MySQL connections without closing them, causing pool exhaustion and test timeouts.  
**Solution**: Added `afterAll(() => pool.end())` in every test suite to properly close the connection pool after each test file completes.

---

### Challenge 7 — Admin Routes Accessible Without Token
**Problem**: Initially, the frontend `/admin` route was accessible by manually navigating to the URL even without authentication.  
**Solution**: Created a `ProtectedRoute` component that checks `isAuthenticated` and `isAdmin` from `AuthContext`, redirecting to `/login` or `/` if either condition fails.

---

## 12. API Endpoints Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | None | Register new user |
| POST | `/api/auth/login` | None | Login and get JWT token |
| GET | `/api/auth/profile` | JWT | Get current user profile |
| GET | `/api/destinations` | None | List destinations (search, filter, paginate) |
| GET | `/api/destinations/:id` | None | Get single destination details |
| POST | `/api/destinations` | Admin | Create new destination |
| PUT | `/api/destinations/:id` | Admin | Update destination |
| DELETE | `/api/destinations/:id` | Admin | Delete destination |
| GET | `/api/destinations/states` | None | List all destination states |
| GET | `/api/hotels` | None | List all hotels |
| GET | `/api/hotels/destination/:id` | None | Get hotels for a destination |
| POST | `/api/hotels` | Admin | Create new hotel |
| PUT | `/api/hotels/:id` | Admin | Update hotel |
| DELETE | `/api/hotels/:id` | Admin | Delete hotel |
| GET | `/api/reviews/destination/:id` | None | Get reviews for a destination |
| POST | `/api/reviews` | JWT | Submit a review |
| PUT | `/api/reviews/:id` | JWT (Owner) | Edit own review |
| DELETE | `/api/reviews/:id` | JWT (Owner/Admin) | Delete review |
| GET | `/api/categories` | None | List all categories |

---

## 13. Testing & Logging (Week 5)

Unit and integration tests are written using **Jest + Supertest**.

### Run All Tests

To run the test suite sequentially (bypassing execution policies on Windows):

```bash
cd backend
node node_modules/jest/bin/jest.js --runInBand --detectOpenHandles --forceExit
```

### Test Coverage

| Test Suite | Tests | Description |
|---|---|---|
| `auth.test.js` | Register, Login, Profile, Invalid credentials | Auth API mock unit tests |
| `destinations.test.js` | CRUD operations, Search, Filtering, Pagination | Destination API mock unit tests |
| `hotels.test.js` | CRUD operations, Destination linking | Hotel API mock unit tests |
| `reviews.test.js` | Create, Edit, Delete, Permission checks | Review API mock unit tests |
| `categories.test.js` | List all categories | Category API mock unit tests |
| `errorHandler.test.js` | Error status code mappings and fallback | Centralized error handler unit tests |
| `validation.test.js` | Request payload rules and password checks | Validation configuration unit tests |
| `integration.test.js` | Registration -> Login -> Destination -> Hotel -> Review | End-to-end integration workflow tests |

### Structured Error Logging

Structured logging is implemented in `backend/utils/logger.js` and handles masking sensitive database payload details (like user passwords and tokens) while logging issues to `backend/logs/combined.log` and `backend/logs/error.log`.

---

## 14. Video Demo Script

Use this script to record a 3–5 minute demonstration video:

1. **[0:00]** Open VS Code — show the project folder structure (frontend + backend side by side)
2. **[0:20]** Open Terminal 1 — run `cd backend && npm run dev` — show server starting on port 5000
3. **[0:35]** Open Terminal 2 — run `npm start` — show React compiling and opening on port 3000
4. **[0:50]** Show the **Home Page** — trending destinations load from MySQL in real time
5. **[1:05]** Navigate to **Destinations** — demonstrate live search (type "Goa"), category filter (select "Beaches"), state filter
6. **[1:25]** Click a destination card — show **Destination Details** page (details, hotel list, and existing reviews)
7. **[1:45]** Click **Log In** — register a new account OR log in with `user@traveladvisor.com`
8. **[2:00]** Show navbar changes — user name badge and Dashboard link appear
9. **[2:10]** Return to a destination — submit a **new review** (rating + comment) — show it appears live
10. **[2:30]** Edit and then delete the review — show real-time update
11. **[2:45]** Log out → Log in as `admin@traveladvisor.com` — show **Admin Panel** link appears
12. **[3:00]** Go to **Admin Dashboard** — create a new destination, edit a hotel entry
13. **[3:20]** Open MySQL Workbench / show the database — verify the new record was inserted
14. **[3:35]** (Optional) Open Postman — test `GET /api/destinations` and `POST /api/auth/login`

---

## 15. Future Improvements

| Feature | Description |
|---|---|
| 💳 Payment Gateway | Integrate Razorpay or Stripe for hotel booking payments |
| ✈️ Flight Search | Integrate third-party flight API (Skyscanner / Amadeus) |
| 🤖 AI Recommendations | Personalized destination suggestions using user history |
| 🗺️ Interactive Maps | Google Maps / Leaflet integration for destination location views |
| 🌤️ Weather Widget | Real-time weather at destinations using OpenWeatherMap API |
| 🔔 Push Notifications | Booking reminders and review notifications via Firebase |
| 📊 Admin Analytics | Dashboard with charts for visitor stats, top destinations, revenue |
| 🌍 Multi-language | i18n support for Hindi, Tamil, Bengali alongside English |
| 📱 Mobile App | React Native app using the same Express.js backend |
| 🔍 Elasticsearch | Full-text search across destinations, hotels, and reviews |

---

## 14. Deployment on Render

TravelAdvisor is deployed as a single **Render Web Service** — Express serves both the REST API and the compiled React production build.

### Quick Deployment Steps

1. **Push to GitHub**
   ```bash
   git add . && git commit -m "feat: deploy" && git push origin main
   ```

2. **Create Cloud MySQL** — Sign up at [Aiven](https://aiven.io) and create a free MySQL service

3. **Run Database Migration**
   ```bash
   node backend/database/migrate.js
   ```

4. **Create Render Web Service**
   - Build Command: `npm install && npm run build && cd backend && npm install`
   - Start Command: `cd backend && node server.js`

5. **Set Environment Variables** in Render Dashboard (see Section 15)

6. **Deploy** → Monitor logs → Verify at your Render URL

> 📖 See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for the complete step-by-step guide with troubleshooting.

---

## 15. Environment Variables

### Backend (set in Render Dashboard)

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | ✅ | Set to `production` |
| `JWT_SECRET` | ✅ | Random 64-char string (Render auto-generates) |
| `JWT_EXPIRES_IN` | ✅ | Token expiry e.g. `7d` |
| `DB_HOST` | ✅ | Cloud MySQL host |
| `DB_PORT` | ✅ | Cloud MySQL port |
| `DB_USER` | ✅ | Cloud MySQL user |
| `DB_PASSWORD` | ✅ | Cloud MySQL password |
| `DB_NAME` | ✅ | Cloud MySQL database name |
| `CORS_ORIGIN` | ✅ | Your Render app URL |

### Frontend (also add to Render — used at build time)

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_API_URL` | ✅ | `https://your-app.onrender.com/api` |

> 📋 Copy `backend/.env.example` → `backend/.env` and fill in values for local development.

---

## 16. Future Improvements

| Feature | Description |
|---|---|
| 🖼️ Image CDN | Cloudinary or AWS S3 for image hosting |
| ⚡ Redis Cache | Cache destination lists to reduce database load |
| 🔄 CI/CD Pipeline | GitHub Actions: auto-test PRs, auto-deploy on merge |
| 📧 Email Verification | Nodemailer account verification |
| 🛡️ Rate Limiting | Per-IP rate limiting on authentication endpoints |
| 🌍 Multi-language | i18n support for Hindi, Tamil, Bengali |
| 📱 Mobile App | React Native app using the same Express.js backend |
| 🔍 Elasticsearch | Full-text search across destinations, hotels, and reviews |

---

## License

This project was developed as part of an internship program. All rights reserved.

---

*TravelAdvisor — Discover the beauty of India, one destination at a time.* 🌍
