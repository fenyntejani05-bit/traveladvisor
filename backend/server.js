const dotenv = require('dotenv');
dotenv.config();

const app                  = require('./app');
const { testConnection }   = require('./config/db');

const PORT = parseInt(process.env.PORT || '5000');
const HOST = process.env.HOST || '0.0.0.0';

/**
 * Start the TravelAdvisor API server.
 * - Tests database connectivity before accepting requests.
 * - Gracefully handles startup errors.
 */
const startServer = async () => {
  try {
    // Verify DB connectivity on startup (non-fatal)
    await testConnection();

    const server = app.listen(PORT, HOST, () => {
      console.log('');
      console.log('════════════════════════════════════════════════════');
      console.log('  🌍  TravelAdvisor REST API');
      console.log('════════════════════════════════════════════════════');
      console.log(`  ✅  Server running at: http://${HOST}:${PORT}`);
      console.log(`  🌿  Environment     : ${process.env.NODE_ENV || 'development'}`);
      console.log(`  📡  Health Check    : http://localhost:${PORT}/`);
      console.log(`  📚  Auth API        : http://localhost:${PORT}/api/auth`);
      console.log(`  🗺️   Destinations   : http://localhost:${PORT}/api/destinations`);
      console.log(`  🏨  Hotels          : http://localhost:${PORT}/api/hotels`);
      console.log(`  ⭐  Reviews         : http://localhost:${PORT}/api/reviews`);
      console.log('════════════════════════════════════════════════════');
      console.log('');
    });

    // ─── Graceful Shutdown ──────────────────────────────────────────────────────
    const shutdown = (signal) => {
      console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log('✅  HTTP server closed.');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('❌  Forced shutdown due to timeout.');
        process.exit(1);
      }, 10_000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));

  } catch (err) {
    console.error('❌  Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
