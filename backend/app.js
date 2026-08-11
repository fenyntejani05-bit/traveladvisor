const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const dotenv  = require('dotenv');
const path    = require('path');

// Load environment variables as early as possible
dotenv.config();

// ─── Route Imports ─────────────────────────────────────────────────────────────
const authRoutes        = require('./routes/authRoutes');
const categoryRoutes    = require('./routes/categoryRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const hotelRoutes       = require('./routes/hotelRoutes');
const reviewRoutes      = require('./routes/reviewRoutes');
const userRoutes        = require('./routes/userRoutes');

// ─── Error Handler ─────────────────────────────────────────────────────────────
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Supports a single origin or comma-separated list in CORS_ORIGIN env var.
// e.g. CORS_ORIGIN=https://traveladvisor.onrender.com,http://localhost:3000
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile apps, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy: origin ${origin} is not allowed.`));
    },
    methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials:    true,
  })
);

// ─── HTTP Request Logger ───────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── Body Parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Static File Serving (uploaded images) ────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Health Check ─────────────────────────────────────────────────────────────
// In production, React app is served at / — health check at /api/health
const healthResponse = (req, res) => {
  res.status(200).json({
    success: true,
    message: '🌍 TravelAdvisor REST API is live and running!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      auth:         '/api/auth',
      categories:   '/api/categories',
      destinations: '/api/destinations',
      hotels:       '/api/hotels',
      reviews:      '/api/reviews',
      users:        '/api/users',
    },
  });
};
app.get('/api/health', healthResponse);
if (process.env.NODE_ENV !== 'production') {
  app.get('/', healthResponse);
}

// ─── Temporary DB Debug (REMOVE after deployment works) ───────────────────────
app.get('/api/debug-db', async (req, res) => {
  const db = require('./config/db');
  const info = {
    NODE_ENV: process.env.NODE_ENV,
    DB_HOST: process.env.DB_HOST ? '✅ set' : '❌ missing',
    DB_PORT: process.env.DB_PORT || '❌ missing',
    DB_USER: process.env.DB_USER ? '✅ set' : '❌ missing',
    DB_PASSWORD: process.env.DB_PASSWORD ? '✅ set' : '❌ missing',
    DB_NAME: process.env.DB_NAME || '❌ missing',
    DATABASE_URL: process.env.DATABASE_URL ? '✅ set' : '❌ missing',
  };
  try {
    const [rows] = await db.query('SELECT 1 as ok');
    res.json({ success: true, env: info, db: 'connected', result: rows });
  } catch (err) {
    res.json({ success: false, env: info, db: 'failed', error: err.message, code: err.code });
  }
});

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/categories',   categoryRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/hotels',       hotelRoutes);
app.use('/api/reviews',      reviewRoutes);
app.use('/api/users',        userRoutes);

// Support versioned base path as well
app.use('/api/v1/auth',         authRoutes);
app.use('/api/v1/categories',   categoryRoutes);
app.use('/api/v1/destinations', destinationRoutes);
app.use('/api/v1/hotels',       hotelRoutes);
app.use('/api/v1/reviews',      reviewRoutes);
app.use('/api/v1/users',        userRoutes);

// ─── Serve React Frontend in Production ───────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  // Serve the React build folder
  const clientBuildPath = path.join(__dirname, '..', 'build');
  app.use(express.static(clientBuildPath));

  // API 404 — only for /api routes
  app.use('/api', (req, res) => {
    res.status(404).json({
      success: false,
      message: `Cannot ${req.method} ${req.originalUrl} — API endpoint not found.`,
    });
  });

  // All other routes → React (client-side routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  // ─── 404 Handler (Development) ────────────────────────────────────────────────
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Cannot ${req.method} ${req.originalUrl} — Endpoint not found.`,
    });
  });
}

// ─── Centralized Error Middleware (must be last) ───────────────────────────────
app.use(errorHandler);

module.exports = app;
