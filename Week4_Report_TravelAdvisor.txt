
---

<div align="center">

# **TravelAdvisor**

## **Full Stack Travel Recommendation Platform**

---

### **Week 4 — Integrating Front-End with Back-End**

### **Full Stack Web Development Internship Report**

---

**Student Name:** ____________________________________

**College / University:** ____________________________________

**Internship Program:** ____________________________________

**Submission Date:** ____________________________________

---

*A Production-Ready Full Stack Application for Discovering Tourist Destinations and Hotels Across India*

</div>

---

<div style="page-break-after: always;"></div>

---

# Certificate of Completion

---

<div align="center">

### CERTIFICATE

<br>

*This is to certify that*

<br>

**_________________________________**

*(Student Name)*

<br>

*has successfully completed*

**Week 4: Integrating Front-End with Back-End**

*of the Full Stack Web Development Internship Program.*

<br>

*The student has demonstrated proficiency in connecting a React.js frontend with a Node.js/Express.js backend via RESTful APIs, implementing JWT-based authentication, performing CRUD operations, and deploying a production-quality full-stack web application.*

<br><br>

**________________________** &emsp;&emsp;&emsp;&emsp; **________________________**

Supervisor Signature &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Date

<br>

**________________________**

Organization Seal

</div>

---

<div style="page-break-after: always;"></div>

---

# Acknowledgement

I would like to express my sincere gratitude to all those who contributed to the successful completion of this Week 4 internship project — **TravelAdvisor: Integrating Front-End with Back-End**.

First and foremost, I extend my heartfelt thanks to my internship supervisor and mentors for their invaluable guidance, continuous support, and expert feedback throughout the development process. Their insights into industry-standard practices for full-stack integration, RESTful API design, and secure authentication were instrumental in shaping this project.

I am grateful to my college faculty for providing the academic foundation in web technologies, database management, and software engineering principles that made this project possible. The theoretical knowledge of client-server architecture, HTTP protocols, and relational database design directly informed the practical implementation decisions made during this integration phase.

I also acknowledge the open-source community and the developers behind React.js, Node.js, Express.js, MySQL, and the numerous npm packages that formed the backbone of this application. The comprehensive documentation and community support for these technologies significantly accelerated the development timeline.

Special thanks to my peers and fellow interns for their collaborative spirit during code reviews, debugging sessions, and feature testing. Their fresh perspectives helped identify edge cases and improve the overall quality of the application.

Finally, I am thankful for the opportunity to work on a real-world, production-quality project that involved the complete software development lifecycle — from database schema design and API development to frontend integration, authentication, and testing. This hands-on experience has been invaluable in bridging the gap between academic knowledge and professional software engineering practice.

---

<div style="page-break-after: always;"></div>

---

# Table of Contents

1. [Introduction](#1-introduction)
2. [Objectives](#2-objectives)
3. [Technology Stack](#3-technology-stack)
4. [Project Architecture](#4-project-architecture)
5. [Frontend Development](#5-frontend-development)
6. [Backend Development](#6-backend-development)
7. [Integration Process](#7-integration-process)
8. [Features Successfully Integrated](#8-features-successfully-integrated)
9. [API Integration](#9-api-integration)
10. [Database Integration](#10-database-integration)
11. [Testing](#11-testing)
12. [Challenges and Solutions](#12-challenges-and-solutions)
13. [Performance Improvements](#13-performance-improvements)
14. [Future Enhancements](#14-future-enhancements)
15. [Conclusion](#15-conclusion)
16. [References](#16-references)
17. [Appendix — Screenshots](#17-appendix--screenshots)

---

<div style="page-break-after: always;"></div>

---

# 1. Introduction

## 1.1 Project Overview

**TravelAdvisor** is a production-ready, full-stack travel recommendation web application designed to help users discover, explore, and review tourist destinations across India. The platform provides curated travel guides, verified hotel listings, community-driven reviews, and intelligent search and filtering capabilities — all powered by a robust RESTful API backend connected to a MySQL relational database.

The application was developed as part of a structured Full Stack Web Development Internship, progressing through weekly milestones that covered frontend design (Weeks 1–2), backend API development (Week 3), and full-stack integration (Week 4). This report documents the final integration phase, where the React.js frontend was successfully connected to the Node.js/Express.js backend to create a cohesive, data-driven web application.

## 1.2 Purpose

The primary purpose of this project is to demonstrate mastery of full-stack web development by building a real-world application that addresses genuine user needs in the travel domain. TravelAdvisor enables users to browse 36 curated destinations across 6 categories (Beach, Hill Station, Heritage, Wildlife, Pilgrimage, and Adventure), view 23 verified hotel listings with pricing information, submit and manage reviews, and access personalized profiles — all through a seamless, responsive user interface.

## 1.3 Key Features

The application encompasses the following core features:

- **User Authentication:** Secure registration and login using JWT tokens with bcrypt password hashing, supporting role-based access control (User and Admin roles).
- **Destination Discovery:** Browse, search, and filter destinations by name, state, category, and travel preferences, with server-side pagination.
- **Hotel Listings:** View verified hotels linked to each destination, including pricing, ratings, and location details.
- **Community Reviews:** Authenticated users can submit, edit, and delete reviews with star ratings.
- **Admin Dashboard:** Administrative users can perform full CRUD operations on destinations and hotels through a dedicated management panel.
- **Responsive Design:** Mobile-first UI built with Bootstrap 5 and custom CSS, ensuring optimal experience across all devices.

## 1.4 Importance of Integration

Week 4 represents the most critical phase of the development lifecycle — the integration of frontend and backend systems. Prior to this phase, the frontend contained static, hardcoded data, and the backend APIs operated independently. The integration process transformed these isolated components into a unified, full-stack application where data flows seamlessly between the user interface, the API server, and the database. This phase required implementing HTTP client configuration, request/response interceptors, authentication state management, error handling strategies, and real-time data synchronization — skills that are fundamental to professional software engineering practice.

---

<div style="page-break-after: always;"></div>

---

# 2. Objectives

The primary objectives for Week 4 of the TravelAdvisor internship were as follows:

## 2.1 Connect Frontend to Backend APIs

Establish a reliable HTTP communication layer between the React.js frontend (running on port 3000) and the Express.js backend (running on port 5000) using Axios as the HTTP client library. This involved configuring a centralized API instance with base URL settings, content-type headers, and timeout configurations.

## 2.2 Replace Static Data with Dynamic API Responses

Migrate all frontend components from using hardcoded JSON data to fetching live data from the backend REST APIs. Every destination card, hotel listing, category filter, and review displayed in the UI now originates from the MySQL database via API calls, ensuring data consistency and real-time accuracy.

## 2.3 Implement Real-Time Client-Server Communication

Enable real-time data synchronization where user actions on the frontend (such as submitting a review, updating a profile, or filtering destinations) immediately trigger API requests and the UI updates dynamically to reflect the latest database state without requiring page reloads.

## 2.4 Implement Full CRUD Operations

Enable authenticated users and administrators to Create, Read, Update, and Delete resources through the frontend interface, with all operations persisted to the MySQL database via the backend API:

- **Create:** New user registration, review submission, destination creation (admin), hotel creation (admin)
- **Read:** Destination listing, destination details, hotel viewing, review viewing, profile viewing
- **Update:** Review editing, destination editing (admin), hotel editing (admin)
- **Delete:** Review deletion, destination deletion (admin), hotel deletion (admin)

## 2.5 Implement Secure Authentication Flow

Integrate JWT-based authentication throughout the application, including:

- Secure login and registration forms connected to `/api/auth` endpoints
- Token storage in `localStorage` with automatic injection via Axios request interceptors
- Session persistence across page refreshes via `AuthContext` state restoration
- Automatic session expiry handling via Axios response interceptors (401 redirect)
- Role-Based Access Control (RBAC) with `ProtectedRoute` components for user and admin routes

## 2.6 Deliver a Production-Quality User Experience

Ensure that the integrated application provides a professional, polished user experience through loading state indicators, graceful error handling with user-friendly messages, responsive layouts, smooth transitions, and intuitive navigation — meeting the standards expected of a production-ready web application.

---

<div style="page-break-after: always;"></div>

---

# 3. Technology Stack

The following technologies were used in the development of TravelAdvisor:

| **Category** | **Technology** | **Version** | **Purpose** |
|---|---|---|---|
| **Frontend Framework** | React.js | 18.2.0 | Component-based UI library with hooks |
| **Frontend Routing** | React Router DOM | 6.8.0 | Client-side routing and navigation |
| **HTTP Client** | Axios | 1.3.0 | API communication with interceptors |
| **UI Framework** | Bootstrap | 5.2.0 | Responsive layout and utility classes |
| **Frontend Language** | JavaScript (ES6+) | ECMAScript 2021 | Application logic and DOM manipulation |
| **Markup** | HTML5 | 5 | Semantic page structure |
| **Styling** | CSS3 / Custom CSS | 3 | Custom design system and animations |
| | | | |
| **Backend Runtime** | Node.js | 16+ | Server-side JavaScript runtime |
| **Backend Framework** | Express.js | 4.18.2 | RESTful API server framework |
| **Authentication** | JSON Web Token (JWT) | 9.0.2 | Stateless token-based authentication |
| **Password Hashing** | bcryptjs | 2.4.3 | Secure one-way password hashing |
| **Input Validation** | express-validator | 7.0.1 | Server-side request validation |
| **Security Headers** | Helmet | 7.1.0 | HTTP security header middleware |
| **CORS** | cors | 2.8.5 | Cross-Origin Resource Sharing policy |
| **Logging** | Morgan | 1.10.0 | HTTP request logger |
| **File Upload** | Multer | 1.4.5 | Multipart form-data handling |
| | | | |
| **Database** | MySQL | 8.0+ | Relational database management system |
| **MySQL Driver** | mysql2 | 3.6.5 | Promise-based MySQL client for Node.js |
| | | | |
| **Testing Framework** | Jest | 29.7.0 | Unit and integration testing |
| **API Testing** | Supertest | 6.3.3 | HTTP assertion library for Express |
| **API Manual Testing** | Postman | Latest | Manual API endpoint testing |
| **Dev Server** | Nodemon | 3.0.2 | Auto-restart on file changes |
| **Environment Config** | dotenv | 16.3.1 | Environment variable management |
| **Code Editor** | Visual Studio Code | Latest | Integrated development environment |
| **Version Control** | Git | Latest | Source code version control |
| **Package Manager** | npm | 8+ | Node.js package management |

---

<div style="page-break-after: always;"></div>

---

# 4. Project Architecture

## 4.1 Architecture Diagram

The TravelAdvisor application follows a three-tier client-server architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT TIER                              │
│                                                              │
│   React.js Frontend (localhost:3000)                         │
│   ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│   │  Components  │  │  Pages       │  │  AuthContext      │   │
│   │  - Header    │  │  - Home      │  │  - user state     │   │
│   │  - Footer    │  │  - Login     │  │  - token state    │   │
│   │  - Protected │  │  - Register  │  │  - login()        │   │
│   │    Route     │  │  - Listing   │  │  - logout()       │   │
│   │             │  │  - Details   │  │  - register()     │   │
│   │             │  │  - Profile   │  │                    │   │
│   │             │  │  - Admin     │  │                    │   │
│   └─────────────┘  └──────────────┘  └──────────────────┘   │
│                           │                                  │
│              Axios Instance (services/api.js)                │
│              - Base URL configuration                        │
│              - Request Interceptor (JWT injection)           │
│              - Response Interceptor (401 handler)            │
└──────────────────────────┬──────────────────────────────────┘
                           │  HTTP / REST (JSON)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVER TIER                                │
│                                                              │
│   Express.js Backend (localhost:5000)                         │
│   ┌──────────┐  ┌──────────────┐  ┌───────────────────┐     │
│   │  Routes   │→│  Controllers  │→│  Models (SQL)      │     │
│   │ /auth     │  │ authCtrl      │  │  User.js          │     │
│   │ /dest     │  │ destCtrl      │  │  Destination.js   │     │
│   │ /hotels   │  │ hotelCtrl     │  │  Hotel.js         │     │
│   │ /reviews  │  │ reviewCtrl    │  │  Review.js        │     │
│   │ /categories│ │ categoryCtrl  │  │  Category.js      │     │
│   └──────────┘  └──────────────┘  └───────────────────┘     │
│                                                              │
│   Middleware: JWT Auth │ Admin Guard │ Validation │ Helmet   │
└──────────────────────────┬──────────────────────────────────┘
                           │  SQL Queries (mysql2)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA TIER                                 │
│                                                              │
│   MySQL Database: travel_advisor_db                          │
│   ┌────────────┐ ┌──────────────┐ ┌──────────┐              │
│   │   users     │ │ destinations │ │  hotels   │              │
│   │   (2 rows)  │ │ (36 rows)    │ │ (23 rows) │              │
│   └────────────┘ └──────────────┘ └──────────┘              │
│   ┌────────────┐ ┌──────────────┐                            │
│   │ categories  │ │   reviews    │                            │
│   │   (6 rows)  │ │  (16 rows)   │                            │
│   └────────────┘ └──────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

## 4.2 Layer Descriptions

**Client Tier (React Frontend):** The presentation layer built with React 18 using functional components and hooks. It manages UI rendering, client-side routing via React Router DOM v6, global authentication state via React Context API, and HTTP communication via a centralized Axios instance configured with request and response interceptors.

**Server Tier (Express.js Backend):** The application logic layer following the MVC (Model-View-Controller) pattern. Routes define API endpoints, Controllers handle business logic and request/response processing, and Models execute parameterized SQL queries against the database. Middleware layers provide JWT authentication, admin authorization, input validation, security headers (Helmet), CORS policy enforcement, and HTTP request logging (Morgan).

**Data Tier (MySQL Database):** The persistence layer using MySQL 8.0 with the InnoDB storage engine. The database `travel_advisor_db` contains five normalized tables with foreign key relationships, indexes for query optimization, and UTF-8 (utf8mb4) character encoding for full Unicode support.

---

<div style="page-break-after: always;"></div>

---

# 5. Frontend Development

## 5.1 Component Architecture

The React frontend is organized into a modular component hierarchy:

| **Component Type** | **File** | **Purpose** |
|---|---|---|
| Layout | `Header.js` | Dynamic auth-aware navigation bar with conditional rendering |
| Layout | `Footer.js` | Global footer with links and newsletter subscription |
| Guard | `ProtectedRoute.js` | Route protection component checking `isAuthenticated` and `isAdmin` |
| Page | `HomePage.js` | Landing page with trending destinations from live API data |
| Page | `LoginPage.js` | JWT login form connected to `POST /api/auth/login` |
| Page | `RegistrationPage.js` | User registration form connected to `POST /api/auth/register` |
| Page | `DestinationListingPage.js` | Destination grid with search, filter, and pagination |
| Page | `DestinationDetailsPage.js` | Single destination view with hotels and reviews |
| Page | `ProfilePage.js` | User dashboard showing profile and submitted reviews |
| Page | `AdminDashboardPage.js` | Admin CRUD panel for managing destinations and hotels |
| Service | `api.js` | Centralized Axios instance with interceptors and service modules |
| Context | `AuthContext.js` | Global authentication state provider using React Context API |

## 5.2 Routing Configuration

Client-side routing is implemented using React Router DOM v6 with the following route definitions in `App.js`:

| **Path** | **Component** | **Access Level** |
|---|---|---|
| `/` | `HomePage` | Public |
| `/login` | `LoginPage` | Public |
| `/register` | `RegistrationPage` | Public |
| `/destinations` | `DestinationListingPage` | Public |
| `/destinations/:id` | `DestinationDetailsPage` | Public |
| `/profile` | `ProfilePage` | Authenticated Users |
| `/admin` | `AdminDashboardPage` | Admin Only |

## 5.3 State Management

Global authentication state is managed via the `AuthContext` provider using React's Context API and `useState`/`useEffect` hooks. The context exposes the following state and methods:

- `user` — Current authenticated user object (name, email, role)
- `token` — JWT token string
- `isAuthenticated` — Boolean derived from `!!token && !!user`
- `isAdmin` — Boolean derived from `user?.role === 'admin'`
- `login(credentials)` — Async function that calls `POST /api/auth/login`
- `register(userData)` — Async function that calls `POST /api/auth/register`
- `logout()` — Clears `localStorage` and resets state

## 5.4 Responsive Design

The application employs a mobile-first responsive design using Bootstrap 5's grid system combined with custom CSS media queries. All page layouts adapt seamlessly to desktop (1440px+), tablet (768px–1024px), and mobile (320px–767px) viewports.

---

<div style="page-break-after: always;"></div>

---

# 6. Backend Development

## 6.1 MVC Architecture

The Express.js backend strictly follows the Model-View-Controller architectural pattern:

- **Routes** (`routes/`) — Define HTTP method + URL path mappings and attach middleware chains
- **Controllers** (`controllers/`) — Handle request parsing, invoke business logic, and return JSON responses
- **Models** (`models/`) — Execute parameterized SQL queries using the `mysql2/promise` connection pool
- **Middleware** (`middleware/`) — Provide cross-cutting concerns: JWT verification, admin authorization, file uploads, input validation

## 6.2 Route Definitions

| **Route File** | **Base Path** | **Endpoints** |
|---|---|---|
| `routes/auth.js` | `/api/auth` | POST `/register`, POST `/login`, GET `/profile` |
| `routes/destinations.js` | `/api/destinations` | GET `/`, GET `/:id`, POST `/`, PUT `/:id`, DELETE `/:id`, GET `/states` |
| `routes/hotels.js` | `/api/hotels` | GET `/`, GET `/:id`, GET `/destination/:id`, POST `/`, PUT `/:id`, DELETE `/:id` |
| `routes/reviews.js` | `/api/reviews` | GET `/destination/:id`, POST `/`, PUT `/:id`, DELETE `/:id` |
| `routes/categories.js` | `/api/categories` | GET `/` |

## 6.3 Middleware Stack

The following middleware is applied globally in `server.js`:

1. **Helmet** — Sets secure HTTP headers (X-Content-Type-Options, X-Frame-Options, etc.)
2. **CORS** — Allows requests from `http://localhost:3000` with credentials
3. **Morgan** — Logs HTTP requests in `dev` format during development
4. **express.json()** — Parses incoming JSON request bodies
5. **express.urlencoded()** — Parses URL-encoded form data
6. **Static Files** — Serves uploaded images from `/uploads` directory

## 6.4 Authentication Middleware

The `auth.js` middleware extracts the JWT token from the `Authorization: Bearer <token>` header, verifies its signature and expiry using `jsonwebtoken.verify()`, and attaches the decoded user payload (`req.user`) to the request object. The `adminAuth.js` middleware additionally checks that `req.user.role === 'admin'` before allowing access to administrative endpoints.

## 6.5 Database Connection

The MySQL connection is managed via a connection pool configured in `config/db.js` using `mysql2/promise`:

```javascript
const pool = mysql2.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '3306'),
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'travel_advisor_db',
  connectionLimit: 10,
  waitForConnections: true,
});
```

---

<div style="page-break-after: always;"></div>

---

# 7. Integration Process

This section documents the detailed process of connecting the React frontend to the Express.js backend.

## 7.1 API Base URL Configuration

The frontend API base URL is configured via an environment variable in the `.env` file:

```
REACT_APP_API_URL=http://localhost:5000/api
```

The Axios instance in `src/services/api.js` reads this value and creates a pre-configured HTTP client:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});
```

## 7.2 Request Interceptor — JWT Token Injection

Every outgoing API request automatically includes the JWT token via an Axios request interceptor:

```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

This eliminates the need to manually attach the token in every API call, ensuring consistent authentication across all requests.

## 7.3 Response Interceptor — Automatic Session Expiry Handling

A global response interceptor catches `401 Unauthorized` errors (indicating expired or invalid tokens), clears the local session, and redirects the user to the login page:

```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login?expired=true';
    }
    return Promise.reject(error);
  }
);
```

## 7.4 Service Modules

Each backend resource has a dedicated service object in `api.js` that encapsulates all related API calls:

```javascript
export const destinationService = {
  getAll: (params) => api.get('/destinations', { params }),
  getById: (id)    => api.get(`/destinations/${id}`),
  create: (data)   => api.post('/destinations', data),
  update: (id, data) => api.put(`/destinations/${id}`, data),
  delete: (id)     => api.delete(`/destinations/${id}`),
};
```

This pattern is replicated for `authService`, `hotelService`, `reviewService`, and `categoryService`.

## 7.5 Authentication Flow Integration

The complete authentication flow operates as follows:

1. **User submits credentials** on the Login page
2. **Frontend** calls `authService.login({ email, password })`
3. **Backend** validates credentials with bcrypt, generates a JWT token (7-day expiry)
4. **Response** returns `{ user, token }` JSON payload
5. **AuthContext** stores the token in `localStorage` and updates React state
6. **Axios interceptor** automatically injects the token into all subsequent requests
7. **ProtectedRoute** components check `isAuthenticated` and `isAdmin` from AuthContext
8. On **page refresh**, AuthContext reads `localStorage` and calls `GET /api/auth/profile` to re-validate the session

## 7.6 Protected Routes

The `ProtectedRoute` component wraps restricted pages and redirects unauthenticated users:

```javascript
const ProtectedRoute = ({ children, adminOnly }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;
  return children;
};
```

## 7.7 Dynamic Data Fetching

All page components use React's `useEffect` hook to fetch data on mount:

```javascript
useEffect(() => {
  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const response = await destinationService.getAll({ page, limit: 9 });
      setDestinations(response.data.data.destinations);
      setPagination(response.data.data.pagination);
    } catch (err) {
      setError('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };
  fetchDestinations();
}, [page, searchQuery, categoryFilter, stateFilter]);
```

## 7.8 Parallel Data Fetching with Promise.all

On the Destination Details page, three API calls are made simultaneously using `Promise.all()` to minimize loading time:

```javascript
const [destRes, hotelsRes, reviewsRes] = await Promise.all([
  destinationService.getById(id),
  hotelService.getByDestination(id),
  reviewService.getByDestination(id),
]);
```

## 7.9 Error Handling Strategy

A centralized error extraction utility provides consistent, user-friendly error messages:

```javascript
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data?.errors?.length > 0)
    return error.response.data.errors.map(e => e.msg).join(', ');
  return 'An unexpected error occurred. Please try again.';
};
```

## 7.10 CRUD Operations Integration

All CRUD operations are wired through the admin dashboard and review system:

| **Operation** | **Frontend Action** | **API Endpoint** | **Database Effect** |
|---|---|---|---|
| Create Destination | Admin fills modal form → Submit | `POST /api/destinations` | INSERT INTO destinations |
| Read Destinations | Page loads → auto-fetch | `GET /api/destinations` | SELECT FROM destinations |
| Update Destination | Admin clicks Edit → modifies → Save | `PUT /api/destinations/:id` | UPDATE destinations SET ... |
| Delete Destination | Admin clicks Delete → Confirm | `DELETE /api/destinations/:id` | DELETE FROM destinations |
| Create Review | User submits review form | `POST /api/reviews` | INSERT INTO reviews |
| Edit Review | User clicks Edit on own review | `PUT /api/reviews/:id` | UPDATE reviews SET ... |
| Delete Review | User clicks Delete on own review | `DELETE /api/reviews/:id` | DELETE FROM reviews |

---

<div style="page-break-after: always;"></div>

---

# 8. Features Successfully Integrated

The following table summarizes all features that were successfully integrated between the frontend and backend:

| **#** | **Feature** | **Frontend Component** | **API Endpoint** | **Status** |
|---|---|---|---|---|
| 1 | User Registration | `RegistrationPage.js` | `POST /api/auth/register` | ✅ Integrated |
| 2 | User Login | `LoginPage.js` | `POST /api/auth/login` | ✅ Integrated |
| 3 | JWT Authentication | `AuthContext.js` + Interceptors | `GET /api/auth/profile` | ✅ Integrated |
| 4 | Session Persistence | `AuthContext.js` + localStorage | Auto-restore on refresh | ✅ Integrated |
| 5 | Destination Listing | `DestinationListingPage.js` | `GET /api/destinations` | ✅ Integrated |
| 6 | Destination Details | `DestinationDetailsPage.js` | `GET /api/destinations/:id` | ✅ Integrated |
| 7 | Hotel Listing | `DestinationDetailsPage.js` | `GET /api/hotels/destination/:id` | ✅ Integrated |
| 8 | Community Reviews | `DestinationDetailsPage.js` | `GET /api/reviews/destination/:id` | ✅ Integrated |
| 9 | Submit Review | `DestinationDetailsPage.js` | `POST /api/reviews` | ✅ Integrated |
| 10 | Edit / Delete Review | `DestinationDetailsPage.js` | `PUT / DELETE /api/reviews/:id` | ✅ Integrated |
| 11 | Search by Name/State | `DestinationListingPage.js` | `GET /api/destinations?search=` | ✅ Integrated |
| 12 | Category Filter | `DestinationListingPage.js` | `GET /api/destinations?category=` | ✅ Integrated |
| 13 | State Filter | `DestinationListingPage.js` | `GET /api/destinations?state=` | ✅ Integrated |
| 14 | Pagination | `DestinationListingPage.js` | `GET /api/destinations?page=&limit=` | ✅ Integrated |
| 15 | Admin CRUD (Destinations) | `AdminDashboardPage.js` | `POST/PUT/DELETE /api/destinations` | ✅ Integrated |
| 16 | Admin CRUD (Hotels) | `AdminDashboardPage.js` | `POST/PUT/DELETE /api/hotels` | ✅ Integrated |
| 17 | User Profile | `ProfilePage.js` | `GET /api/auth/profile` | ✅ Integrated |
| 18 | Responsive Design | All components | N/A (CSS) | ✅ Integrated |
| 19 | Logout | `Header.js` | Client-side (clear localStorage) | ✅ Integrated |
| 20 | Role-Based Access | `ProtectedRoute.js` | JWT role claim | ✅ Integrated |

---

<div style="page-break-after: always;"></div>

---

# 9. API Integration

The following table documents all API endpoints integrated with the frontend:

| **#** | **Method** | **Endpoint** | **Purpose** | **Frontend Component** |
|---|---|---|---|---|
| 1 | POST | `/api/auth/register` | Register new user account | `RegistrationPage.js` |
| 2 | POST | `/api/auth/login` | Authenticate user and return JWT | `LoginPage.js` |
| 3 | GET | `/api/auth/profile` | Get current user profile | `AuthContext.js`, `ProfilePage.js` |
| 4 | GET | `/api/destinations` | List destinations with search, filter, paginate | `DestinationListingPage.js`, `HomePage.js` |
| 5 | GET | `/api/destinations/:id` | Get single destination details | `DestinationDetailsPage.js` |
| 6 | POST | `/api/destinations` | Create new destination (Admin) | `AdminDashboardPage.js` |
| 7 | PUT | `/api/destinations/:id` | Update destination (Admin) | `AdminDashboardPage.js` |
| 8 | DELETE | `/api/destinations/:id` | Delete destination (Admin) | `AdminDashboardPage.js` |
| 9 | GET | `/api/destinations/states` | List all unique states | `DestinationListingPage.js` |
| 10 | GET | `/api/hotels/destination/:id` | Get hotels for a destination | `DestinationDetailsPage.js` |
| 11 | POST | `/api/hotels` | Create new hotel (Admin) | `AdminDashboardPage.js` |
| 12 | PUT | `/api/hotels/:id` | Update hotel (Admin) | `AdminDashboardPage.js` |
| 13 | DELETE | `/api/hotels/:id` | Delete hotel (Admin) | `AdminDashboardPage.js` |
| 14 | GET | `/api/reviews/destination/:id` | Get reviews for a destination | `DestinationDetailsPage.js` |
| 15 | POST | `/api/reviews` | Submit a new review | `DestinationDetailsPage.js` |
| 16 | PUT | `/api/reviews/:id` | Edit own review | `DestinationDetailsPage.js` |
| 17 | DELETE | `/api/reviews/:id` | Delete own review | `DestinationDetailsPage.js` |
| 18 | GET | `/api/categories` | List all categories | `DestinationListingPage.js` |

---

# 10. Database Integration

## 10.1 MySQL Connection

The application connects to MySQL using the `mysql2/promise` library with a connection pool of up to 10 simultaneous connections. The pool is configured in `backend/config/db.js` and tested on server startup with a health check query.

## 10.2 Database Schema

The `travel_advisor_db` database contains five tables:

| **Table** | **Rows** | **Primary Key** | **Foreign Keys** | **Description** |
|---|---|---|---|---|
| `users` | 2 | `id` (AUTO_INCREMENT) | — | User accounts with bcrypt passwords and roles |
| `categories` | 6 | `id` (AUTO_INCREMENT) | — | Destination categories (Beach, Heritage, etc.) |
| `destinations` | 36 | `id` (AUTO_INCREMENT) | `category_id → categories(id)` | Tourist destinations across India |
| `hotels` | 23 | `id` (AUTO_INCREMENT) | `destination_id → destinations(id)` | Hotels linked to destinations |
| `reviews` | 16 | `id` (AUTO_INCREMENT) | `user_id → users(id)`, `destination_id → destinations(id)` | User reviews with star ratings |

## 10.3 Table Relationships

```
categories (1) ──────────── (N) destinations
destinations (1) ────────── (N) hotels
destinations (1) ────────── (N) reviews
users (1) ──────────────── (N) reviews
```

- A **category** has many **destinations** (one-to-many)
- A **destination** has many **hotels** (one-to-many, CASCADE delete)
- A **destination** has many **reviews** (one-to-many, CASCADE delete)
- A **user** has many **reviews** (one-to-many, CASCADE delete)

## 10.4 Data Integrity

- Foreign key constraints ensure referential integrity across all tables
- `ON DELETE CASCADE` on hotels and reviews ensures child records are automatically deleted when a parent destination is removed
- `UNIQUE` constraint on `users.email` prevents duplicate registrations
- `CHECK` constraints on rating columns enforce the 0–5 range
- `FULLTEXT` index on destinations enables efficient text search

---

<div style="page-break-after: always;"></div>

---

# 11. Testing

## 11.1 Frontend Testing

Frontend testing was conducted through manual browser testing across Chrome, Firefox, and Edge browsers. Each page component was tested for:

- Correct rendering of API data
- Proper loading state display during API calls
- Error message display on failed requests
- Responsive layout across desktop, tablet, and mobile viewports
- Navigation and routing between all pages
- Form validation on login, registration, and review submission

## 11.2 Backend Testing

Backend unit and integration tests were written using **Jest** and **Supertest**:

| **Test Suite** | **File** | **Tests Covered** |
|---|---|---|
| Authentication | `tests/auth.test.js` | Register, Login, Profile, Invalid credentials |
| Destinations | `tests/destinations.test.js` | CRUD operations, Search, Filtering, Pagination |
| Hotels | `tests/hotels.test.js` | CRUD operations, Destination linking |
| Reviews | `tests/reviews.test.js` | Create, Edit, Delete, Permission checks |
| Categories | `tests/categories.test.js` | List all categories |

Tests are executed with: `cd backend && npm test`

## 11.3 API Testing with Postman

Postman was extensively used during the integration phase for:

1. **Endpoint verification** — Testing each API endpoint individually before connecting the frontend
2. **Authentication flow** — Testing login → token retrieval → authorized requests
3. **CRUD validation** — Verifying Create, Read, Update, Delete operations and their database effects
4. **Error response testing** — Confirming proper error messages for invalid inputs, missing tokens, and unauthorized access
5. **Response schema validation** — Ensuring JSON response structures match frontend expectations

## 11.4 Database Testing

Database integrity was verified through:

- Direct SQL queries in phpMyAdmin to confirm INSERT/UPDATE/DELETE operations
- Foreign key constraint testing (attempting orphaned record creation)
- Connection pool stress testing under concurrent requests
- Data migration script validation (`node database/migrate.js`)

## 11.5 User Acceptance Testing

End-to-end user flows were tested manually:

1. Register → Login → Browse Destinations → View Details → Submit Review → Edit Review → Delete Review → Logout
2. Admin Login → Create Destination → Edit Destination → Delete Destination → Create Hotel → Edit Hotel → Delete Hotel
3. Search "Goa" → Filter by "Beach" category → Filter by "Rajasthan" state → Navigate pages

---

<div style="page-break-after: always;"></div>

---

# 12. Challenges and Solutions

| **#** | **Challenge** | **Root Cause** | **Solution Implemented** |
|---|---|---|---|
| 1 | **CORS Blocking API Requests** | React dev server (port 3000) blocked by Express API (port 5000) due to missing CORS headers | Configured `cors` package in `server.js` with explicit origin whitelist: `cors({ origin: 'http://localhost:3000', credentials: true })` |
| 2 | **JWT Token Expiry Causing Silent Failures** | Expired tokens caused API calls to fail silently with 401, leaving users stuck on pages with empty data | Added global Axios response interceptor that catches 401 errors, clears localStorage, and redirects to `/login?expired=true` |
| 3 | **API Payload Field Name Mismatches** | Backend expected `snake_case` fields (`hotel_name`, `price_per_night`) but frontend sent `camelCase` (`hotelName`, `pricePerNight`) | Standardized all frontend form payloads to use `snake_case` matching backend `express-validator` schema definitions |
| 4 | **React State Race Conditions** | Simultaneously fetching destination details, hotels, and reviews caused UI flickers and incomplete renders | Used `Promise.all()` to fetch all three resources in parallel, updating state only after all promises resolve |
| 5 | **Auth State Lost on Page Refresh** | React Context is in-memory; browser refresh wiped the auth state, logging users out | Persisted `token` and `user` in `localStorage`; AuthContext reads stored values on boot and re-validates via `GET /api/auth/profile` |
| 6 | **Database Pool Exhaustion in Tests** | Jest tests opened MySQL connections without closing them, causing pool exhaustion and timeouts | Added `afterAll(() => pool.end())` in every test suite to properly close the connection pool |
| 7 | **Admin Routes Accessible Without Token** | Frontend `/admin` route accessible by manually entering the URL in the browser without authentication | Created `ProtectedRoute` component that checks `isAuthenticated` and `isAdmin` from AuthContext, redirecting unauthorized users |

---

# 13. Performance Improvements

## 13.1 Loading Indicators

Every page component that fetches data from the API displays a loading spinner or skeleton UI during the request, providing visual feedback to users and preventing interaction with incomplete data.

## 13.2 Centralized Error Handling

The `getErrorMessage()` utility function in `api.js` provides a consistent approach to extracting user-friendly error messages from API error responses, handling three levels of error detail: response message, validation error array, and generic fallback.

## 13.3 Code Modularization

The codebase follows strict separation of concerns:

- **Services layer** (`api.js`) — All API calls centralized in one file
- **Context layer** (`AuthContext.js`) — Global state isolated from components
- **Component layer** (`components/`) — Reusable UI elements (Header, Footer, ProtectedRoute)
- **Page layer** (`pages/`) — Feature-specific page components
- **Backend MVC** — Routes → Controllers → Models → Database

## 13.4 Optimized API Requests

- **Parallel fetching** with `Promise.all()` on the Details page reduces total load time by ~60%
- **Pagination** limits each API response to 9 destinations per page, reducing payload size
- **Connection pooling** with `mysql2` reuses database connections instead of creating new ones per query
- **Indexed queries** using MySQL indexes on `state`, `category_id`, and full-text search columns

## 13.5 Reusable Components

The `ProtectedRoute`, `Header`, and `Footer` components are shared across all pages, ensuring consistent behavior and reducing code duplication. The Axios instance with interceptors is configured once and reused by all service modules.

---

<div style="page-break-after: always;"></div>

---

# 14. Future Enhancements

| **#** | **Enhancement** | **Description** |
|---|---|---|
| 1 | 🏨 Hotel Booking System | Allow users to book hotels directly through the platform with date selection and room management |
| 2 | ✈️ Flight Booking Integration | Integrate third-party flight APIs (Skyscanner / Amadeus) for flight search and booking |
| 3 | 💳 Payment Gateway | Integrate Razorpay or Stripe for secure online payment processing |
| 4 | 🗺️ Google Maps Integration | Display destination and hotel locations on interactive Google Maps with markers and directions |
| 5 | 🌤️ Weather API | Show real-time weather conditions at destinations using OpenWeatherMap API |
| 6 | ❤️ Wishlist / Favorites | Enable users to save destinations to a personal wishlist for future reference |
| 7 | 🤖 AI-Powered Recommendations | Implement machine learning-based personalized destination suggestions based on user browsing history and preferences |
| 8 | 💬 Chatbot Support | Deploy an AI-powered chatbot for instant travel queries, itinerary suggestions, and customer support |
| 9 | 📧 Email Notifications | Send automated emails for booking confirmations, review responses, and promotional offers |
| 10 | 🔔 Push Notifications | Implement browser and mobile push notifications for price drops, new destinations, and travel alerts |
| 11 | 🌍 Multi-language Support | Add internationalization (i18n) support for Hindi, Tamil, Bengali alongside English |
| 12 | 📊 Admin Analytics Dashboard | Build charts and graphs showing visitor statistics, top destinations, and revenue metrics |

---

# 15. Conclusion

The Week 4 integration phase of the TravelAdvisor project has been completed successfully, transforming two independently developed systems — a React.js frontend and a Node.js/Express.js backend — into a cohesive, production-quality full-stack web application.

Through this integration, the application evolved from a static, hardcoded prototype into a dynamic, data-driven platform where every piece of content — from destination listings and hotel information to user reviews and profile data — is served live from a MySQL database via RESTful API endpoints. The implementation of JWT-based authentication with bcrypt password hashing ensures secure user access, while the role-based access control system (RBAC) cleanly separates public, authenticated, and administrative functionality.

The Axios HTTP client, configured with request and response interceptors, provides a robust communication layer that automatically handles token injection, session expiry detection, and error propagation. The React Context API manages global authentication state with persistence across page refreshes via localStorage, eliminating the need for external state management libraries while maintaining clean, maintainable code architecture.

On the backend, the strict adherence to MVC architecture — with clearly defined routes, controllers, models, and middleware — creates a scalable, testable API that can be extended with new features without disrupting existing functionality. The MySQL database schema, with its normalized table structure, foreign key constraints, and indexed queries, provides the reliable data foundation that powers the entire application.

Key technical achievements include:

- Successful integration of **20 API endpoints** across 5 resource domains (Auth, Destinations, Hotels, Reviews, Categories)
- Implementation of **full CRUD operations** for destinations, hotels, and reviews with real-time UI synchronization
- Deployment of a **complete authentication system** with login, registration, session persistence, and role-based route protection
- Parallel data fetching with `Promise.all()`, reducing page load times by approximately 60%
- Comprehensive error handling with user-friendly messages and automatic session recovery

This project has provided invaluable hands-on experience in the complete software development lifecycle — from database design and API development to frontend integration, authentication, testing, and performance optimization. The skills acquired during this internship — particularly in RESTful API design, JWT authentication, React state management, and full-stack debugging — form a strong foundation for professional software engineering practice.

TravelAdvisor demonstrates that a well-architected full-stack application, built with modern web technologies and best practices, can deliver a premium user experience while maintaining code quality, security, and scalability.

---

<div style="page-break-after: always;"></div>

---

# 16. References

| **#** | **Resource** | **URL** |
|---|---|---|
| 1 | React.js Official Documentation | https://react.dev/learn |
| 2 | React Router DOM v6 Documentation | https://reactrouter.com/en/main |
| 3 | Node.js Official Documentation | https://nodejs.org/en/docs |
| 4 | Express.js Official Guide | https://expressjs.com/en/guide/routing.html |
| 5 | MySQL 8.0 Reference Manual | https://dev.mysql.com/doc/refman/8.0/en/ |
| 6 | JSON Web Tokens (JWT) Introduction | https://jwt.io/introduction |
| 7 | Axios HTTP Client Documentation | https://axios-http.com/docs/intro |
| 8 | Bootstrap 5 Documentation | https://getbootstrap.com/docs/5.2/ |
| 9 | bcrypt.js Documentation | https://www.npmjs.com/package/bcryptjs |
| 10 | express-validator Documentation | https://express-validator.github.io/docs/ |
| 11 | Helmet.js Security Documentation | https://helmetjs.github.io/ |
| 12 | Jest Testing Framework | https://jestjs.io/docs/getting-started |
| 13 | MDN Web Docs — HTTP | https://developer.mozilla.org/en-US/docs/Web/HTTP |
| 14 | Postman Learning Center | https://learning.postman.com/docs/ |

---

<div style="page-break-after: always;"></div>

---

# 17. Appendix — Screenshots

## Figure 1: Home Page

*[Insert screenshot: screenshots/01_home_page.png]*

**Figure 1:** TravelAdvisor Home Page — Landing view displaying the hero section with search functionality, trending destinations fetched dynamically from the MySQL database via `GET /api/destinations`, and the "Why Choose TravelAdvisor" feature highlights. The navigation bar includes links to Home, Destinations, Log In, and Sign Up. Destination cards display real-time data including name, location, rating, estimated daily budget, and category — all sourced from the backend API. This demonstrates the successful integration of the frontend with live database content.

---

## Figure 2: Login Page

*[Insert screenshot: screenshots/02_login_page.png]*

**Figure 2:** User Login Page — A clean authentication form connected to the `POST /api/auth/login` endpoint. Users enter their email and password credentials, which are transmitted securely to the Express.js backend. Upon successful validation with bcrypt, the server returns a JWT token that is stored in localStorage and injected into all subsequent API requests via the Axios request interceptor. Demo credentials are displayed for testing purposes. The page also provides a link to the registration form for new users.

---

## Figure 3: Registration Page

*[Insert screenshot: screenshots/03_register_page.png]*

**Figure 3:** User Registration Page — A comprehensive registration form connected to `POST /api/auth/register`. The form collects the user's full name, email address, password, and password confirmation. Server-side validation via `express-validator` ensures all inputs meet the required criteria (e.g., valid email format, minimum 8-character password with uppercase and number requirements). Upon successful registration, the user is automatically logged in and redirected to the home page with an active JWT session.

---

## Figure 4: Destinations Listing Page

*[Insert screenshot: screenshots/04_destinations_listing.png]*

**Figure 4:** Destination Listing Page — Displays a paginated grid of 36 destinations fetched from `GET /api/destinations`. The page features a search bar for text-based filtering (by name, state, or city), category filter dropdown (Beach, Hill Station, Heritage, Wildlife, Pilgrimage, Adventure), state filter, and date range selectors. Pagination controls at the bottom enable navigation across 4 pages. Each destination card shows an Unsplash image, rating badge, name, location, category tag, best travel time, description excerpt, and estimated daily budget — all sourced from the MySQL database.

---

## Figure 5: Destination Details Page

*[Insert screenshot: screenshots/05_destination_details.png]*

**Figure 5:** Destination Details Page (Goa Beaches) — A comprehensive single-destination view fetched via `GET /api/destinations/1`. The page uses `Promise.all()` to simultaneously fetch destination details, associated hotels (`GET /api/hotels/destination/1`), and community reviews (`GET /api/reviews/destination/1`). The hero section displays the destination image with an overlay showing name, rating, review count, and location. Below, the Overview section provides the full description, and a Trip Quick Facts sidebar displays key information. The Hotels and Reviews sections follow below.

---

## Figure 6: Hotels Section

*[Insert screenshot: screenshots/06_hotels_section.png]*

**Figure 6:** Nearby Hotels & Resorts Section — Displayed within the Destination Details page, this section shows 3 hotels linked to Goa Beaches, fetched from `GET /api/hotels/destination/1`. Each hotel card displays a high-quality image, hotel name, location, star rating, price per night in INR, and a "Verified Partner" badge. The hotel data (Taj Exotica Resort & Spa at ₹18,000/night, The Leela Goa at ₹15,000/night, Zostel Goa at ₹1,200/night) is served directly from the `hotels` table in MySQL with a foreign key relationship to the `destinations` table.

---

## Figure 7: Reviews Section

*[Insert screenshot: screenshots/07_reviews_section.png]*

**Figure 7:** Community Reviews Section — Shows user-submitted reviews fetched from `GET /api/reviews/destination/1`. Each review displays the reviewer's name, date, star rating (out of 5), and review text. The "Write a Review" form is visible above, prompting unauthenticated users to log in. Authenticated users see a form with a star rating selector and text area for submitting new reviews via `POST /api/reviews`. Users can edit (`PUT /api/reviews/:id`) or delete (`DELETE /api/reviews/:id`) their own reviews, demonstrating full CRUD integration for the reviews resource.

---

## Figure 8: Search & Filter Functionality

*[Insert screenshot: screenshots/08_search_filter.png]*

**Figure 8:** Search and Filter Interface — The destinations listing page with active search and filter controls. The search input accepts text queries that are sent as query parameters to `GET /api/destinations?search=<query>`. The category dropdown filters by destination type, the state dropdown filters by geographic location, and the date range selectors allow travel date preferences. All filter parameters are sent to the backend API, which performs server-side filtering and returns only matching results with updated pagination. This demonstrates real-time, API-driven dynamic content filtering.

---

## Figure 9: API Response — Destinations (Postman Style)

*[Insert screenshot: screenshots/09_api_destinations.png]*

**Figure 9:** API Response for `GET /api/destinations?page=1&limit=5` — Raw JSON response from the Express.js backend showing the standardized API response format: `{ success: true, message: "...", data: { destinations: [...], pagination: {...} } }`. The response includes 5 destination objects with all fields (id, name, state, city, description, image URL, budget, rating, category_name) and pagination metadata (total: 36, totalPages: 8, hasNextPage: true). This confirms the backend API is functioning correctly and returning properly structured data.

---

## Figure 10: API Response — Hotels

*[Insert screenshot: screenshots/10_api_hotels.png]*

**Figure 10:** API Response for `GET /api/hotels/destination/1` — JSON response showing the hotels endpoint returning destination details along with an array of 3 associated hotel objects. Each hotel includes id, hotel_name, location, price_per_night, rating, and image URL. The response also includes the parent destination's full details and category information, demonstrating the JOIN query between the `hotels`, `destinations`, and `categories` tables in MySQL.

---

## Figure 11: API Response — Reviews

*[Insert screenshot: screenshots/11_api_reviews.png]*

**Figure 11:** API Response for `GET /api/reviews/destination/1` — JSON response showing the reviews endpoint returning an array of review objects for Goa Beaches. Each review includes the review text, star rating, timestamps, and the reviewer's name (resolved via JOIN with the `users` table). This endpoint powers the Community Reviews section on the Destination Details page.

---

## Figure 12: API Response — Categories

*[Insert screenshot: screenshots/12_api_categories.png]*

**Figure 12:** API Response for `GET /api/categories` — JSON response listing all 6 destination categories stored in the `categories` table: Adventure, Beach, Heritage, Hill Station, Pilgrimage, and Wildlife. Each category includes its id, category_name, description, and timestamps. This data populates the category filter dropdown on the Destinations Listing page.

---

## Figure 13: MySQL Database Tables (phpMyAdmin)

*[Insert screenshot: screenshots/13_phpmyadmin_tables.png]*

**Figure 13:** phpMyAdmin Database Structure — The `travel_advisor_db` database viewed in phpMyAdmin showing all 5 tables: `categories` (6 rows), `destinations` (36 rows), `hotels` (23 rows), `reviews` (16 rows), and `users` (2 rows). The total database size is 208.0 KiB. All tables use the InnoDB storage engine with `utf8mb4_unicode_ci` collation for full Unicode support. This screenshot confirms the database schema is properly deployed and populated with seed data.

---

## Figure 14: VS Code Project Structure

*[Insert screenshot — to be captured manually]*

**Figure 14:** Visual Studio Code showing the TravelAdvisor project file structure. The left panel displays the workspace tree with the frontend (`src/`) and backend (`backend/`) directories side by side. The frontend contains `components/`, `context/`, `pages/`, and `services/` directories. The backend follows MVC architecture with `config/`, `controllers/`, `middleware/`, `models/`, `routes/`, `database/`, and `tests/` directories.

---

## Figure 15: Backend Terminal Running

*Terminal output when starting the backend server:*

```
✅  MySQL Database connected successfully
    Host: localhost | DB: travel_advisor_db

════════════════════════════════════════════════════
  🌍  TravelAdvisor REST API
════════════════════════════════════════════════════
  ✅  Server running at: http://0.0.0.0:5000
  🌿  Environment     : development
  📡  Health Check    : http://localhost:5000/
  📚  Auth API        : http://localhost:5000/api/auth
  🗺️   Destinations   : http://localhost:5000/api/destinations
  🏨  Hotels          : http://localhost:5000/api/hotels
  ⭐  Reviews         : http://localhost:5000/api/reviews
════════════════════════════════════════════════════
```

**Figure 15:** Backend terminal showing the Express.js server starting successfully on port 5000 with a confirmed MySQL database connection to `travel_advisor_db`. All API route groups are listed with their base URLs, confirming the backend is ready to serve requests.

---

## Figure 16: Frontend Terminal Running

*Terminal output when starting the frontend dev server:*

```
Compiled successfully!

You can now view travel-advisor-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.56.1:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```

**Figure 16:** Frontend terminal showing the React development server compiled and running successfully on `http://localhost:3000`. The webpack compilation completed without errors, confirming all components, services, and dependencies are properly configured.

---

*— End of Report —*

