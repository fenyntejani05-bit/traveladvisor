# 🌍 TravelAdvisor — Backend REST API

A production-quality RESTful API for **TravelAdvisor**, a travel recommendation platform that helps users discover tourist destinations and hotels across India. Built with Node.js, Express.js, MySQL, and JWT authentication following MVC architecture.

---

## ✨ Features

- **JWT Authentication** — Secure registration, login, password hashing (bcrypt), token verification
- **Role-Based Access Control** — Admin and User roles with fine-grained route protection
- **Complete CRUD APIs** — Full create, read, update, delete for all resources
- **Search & Filter** — Search destinations by keyword, filter by state or category
- **Pagination** — Server-side pagination for destinations, hotels, and reviews
- **Image Upload** — File upload support for destinations and hotels via Multer
- **Input Validation** — Request validation using express-validator with meaningful error messages
- **Centralized Error Handling** — Unified JSON error responses with proper HTTP status codes
- **SQL Injection Prevention** — All database queries use parameterized statements
- **Security Hardened** — Helmet headers, CORS configuration, environment-based secrets
- **Automated Testing** — Jest + Supertest test suite with mocked database
- **Rating Sync** — Destination ratings auto-update based on review averages

---

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js (v4) |
| Database | MySQL (via `mysql2/promise` connection pool) |
| Authentication | JSON Web Tokens (`jsonwebtoken`) |
| Password Hashing | `bcryptjs` (10 salt rounds) |
| Validation | `express-validator` |
| Security | `helmet`, `cors` |
| Logging | `morgan` |
| File Uploads | `multer` |
| Configuration | `dotenv` |
| Testing | `jest`, `supertest` |

---

## 📁 Folder Structure

```
backend/
├── config/
│   └── db.js                    # MySQL connection pool configuration
├── controllers/
│   ├── authController.js        # Auth logic + validation rules
│   ├── categoryController.js    # Category CRUD + validation
│   ├── destinationController.js # Destination CRUD + search/filter + validation
│   ├── hotelController.js       # Hotel CRUD + validation
│   ├── reviewController.js      # Review CRUD + validation
│   └── userController.js        # User management (Admin)
├── database/
│   ├── schema.sql               # Database DDL (tables, indexes, FK constraints)
│   └── seed.sql                 # Sample seed data (categories, destinations, hotels, reviews)
├── docs/
│   └── API_DOCUMENTATION.md     # Complete API reference documentation
├── middleware/
│   ├── auth.js                  # JWT verification & role authorization
│   ├── errorHandler.js          # Centralized error-handling middleware
│   ├── upload.js                # Multer file upload configuration
│   └── validate.js              # Express-validator result handler
├── models/
│   ├── userModel.js             # User SQL queries
│   ├── categoryModel.js         # Category SQL queries
│   ├── destinationModel.js      # Destination SQL queries (with search/filter)
│   ├── hotelModel.js            # Hotel SQL queries
│   └── reviewModel.js           # Review SQL queries (with avg rating calc)
├── routes/
│   ├── authRoutes.js            # /api/auth routes
│   ├── categoryRoutes.js        # /api/categories routes
│   ├── destinationRoutes.js     # /api/destinations routes
│   ├── hotelRoutes.js           # /api/hotels routes
│   ├── reviewRoutes.js          # /api/reviews routes
│   └── userRoutes.js            # /api/users routes (Admin)
├── services/
│   ├── authService.js           # Auth business logic
│   ├── categoryService.js       # Category business logic
│   ├── destinationService.js    # Destination business logic
│   ├── hotelService.js          # Hotel business logic
│   └── reviewService.js         # Review business logic + rating sync
├── tests/
│   ├── auth.test.js             # Auth API tests
│   ├── categories.test.js       # Category API tests
│   ├── destinations.test.js     # Destination API tests
│   ├── hotels.test.js           # Hotel API tests
│   └── reviews.test.js          # Review API tests
├── uploads/
│   ├── destinations/            # Uploaded destination images
│   └── hotels/                  # Uploaded hotel images
├── utils/
│   ├── apiResponse.js           # Standardized success/error response helpers
│   └── generateToken.js         # JWT token signer utility
├── validators/
│   ├── authValidator.js         # Auth validation schemas
│   ├── categoryValidator.js     # Category validation schemas
│   └── destinationValidator.js  # Destination validation schemas
├── .env                         # Environment variables (not committed)
├── .env.example                 # Environment variable template
├── app.js                       # Express app initialization & middleware
├── package.json                 # Dependencies and npm scripts
├── README.md                    # This file
└── server.js                    # Server startup with graceful shutdown
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory. Use `.env.example` as a template:

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=travel_advisor_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment (`development`, `production`, `test`) | `development` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | — |
| `DB_NAME` | Database name | `travel_advisor_db` |
| `JWT_SECRET` | Secret key for signing JWTs | — |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `CORS_ORIGIN` | Allowed CORS origin | `*` |
| `MAX_FILE_SIZE` | Max upload file size (bytes) | `5242880` (5MB) |
| `UPLOAD_PATH` | Upload directory path | `./uploads` |

---

## 🗄️ Database Setup

### 1. Start MySQL Server

Ensure MySQL is running (via MySQL Workbench, XAMPP, WAMP, or CLI).

### 2. Create Database & Tables

```bash
mysql -u root -p < database/schema.sql
```

This creates the `travel_advisor_db` database with all tables, indexes, foreign keys, and inserts initial sample data.

### 3. (Optional) Re-seed with Fresh Data

```bash
mysql -u root -p travel_advisor_db < database/seed.sql
```

### Default Seed Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@traveladvisor.com` | `Admin@123` |
| User | `priya@example.com` | `User@1234` |
| User | `rahul@example.com` | `User@1234` |

### Database Schema

| Table | Description | Key Relationships |
|---|---|---|
| `users` | User accounts with roles | — |
| `categories` | Destination categories | — |
| `destinations` | Tourist destinations | FK → `categories` |
| `hotels` | Hotels at destinations | FK → `destinations` |
| `reviews` | User reviews for destinations | FK → `users`, `destinations` |

---

## 💻 Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your MySQL credentials and JWT secret
```

---

## 🚀 Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The API will be available at `http://localhost:5000`.

### Health Check
```
GET http://localhost:5000/
```

---

## 📖 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive JWT |
| `GET` | `/api/auth/profile` | Private | Get authenticated user profile |

### Categories (`/api/categories`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/categories` | Public | Get all categories |
| `GET` | `/api/categories/:id` | Public | Get category by ID |
| `POST` | `/api/categories` | Admin | Create a category |
| `PUT` | `/api/categories/:id` | Admin | Update a category |
| `DELETE` | `/api/categories/:id` | Admin | Delete a category |

### Destinations (`/api/destinations`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/destinations` | Public | Get all (with search, filter, pagination) |
| `GET` | `/api/destinations/states` | Public | Get distinct states for filters |
| `GET` | `/api/destinations/:id` | Public | Get destination by ID |
| `POST` | `/api/destinations` | Admin | Create a destination |
| `PUT` | `/api/destinations/:id` | Admin | Update a destination |
| `DELETE` | `/api/destinations/:id` | Admin | Delete a destination |

**Query Parameters**: `search`, `state`, `category_id`, `page`, `limit`

### Hotels (`/api/hotels`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/hotels` | Public | Get all hotels (paginated) |
| `GET` | `/api/hotels/:id` | Public | Get hotel by ID |
| `GET` | `/api/hotels/destination/:destinationId` | Public | Get hotels by destination |
| `POST` | `/api/hotels` | Admin | Create a hotel |
| `PUT` | `/api/hotels/:id` | Admin | Update a hotel |
| `DELETE` | `/api/hotels/:id` | Admin | Delete a hotel |

### Reviews (`/api/reviews`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/reviews` | Admin | Get all reviews (paginated) |
| `GET` | `/api/reviews/destination/:destinationId` | Public | Get reviews for a destination |
| `POST` | `/api/reviews` | Private | Submit a review |
| `PUT` | `/api/reviews/:id` | Private | Update a review (owner/admin) |
| `DELETE` | `/api/reviews/:id` | Private | Delete a review (owner/admin) |

> For complete API documentation with request/response examples, see [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).

---

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage
```

Tests use mocked database connections — no MySQL required to run tests.

### Test Coverage

| Test File | Resource | Tests |
|---|---|---|
| `auth.test.js` | Authentication | Register, login, profile, validation errors |
| `categories.test.js` | Categories | CRUD, admin authorization, validation |
| `destinations.test.js` | Destinations | CRUD, search, filter, pagination, authorization |
| `hotels.test.js` | Hotels | CRUD, by-destination, authorization |
| `reviews.test.js` | Reviews | CRUD, owner/admin authorization, rating sync |

---

## 📋 NPM Scripts

| Command | Description |
|---|---|
| `npm start` | Start server in production mode |
| `npm run dev` | Start server with nodemon (auto-reload) |
| `npm test` | Run Jest test suite |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint |

---

## 🔐 Security Features

- **Helmet** — Secure HTTP response headers
- **CORS** — Cross-Origin Resource Sharing with configurable origin
- **bcrypt** — Password hashing with 10 salt rounds
- **JWT** — Stateless authentication with configurable expiry
- **Input Validation** — All requests validated before processing
- **Parameterized Queries** — Prevention of SQL injection attacks
- **Role-Based Access** — Admin/User role separation on sensitive routes
- **Environment Variables** — Secrets stored outside codebase

---

## 📬 API Response Format

**Success**
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": { }
}
```

**Error**
```json
{
  "success": false,
  "message": "Error description.",
  "errors": [
    { "field": "email", "message": "Please provide a valid email address." }
  ]
}
```

---

## 📄 License

ISC
