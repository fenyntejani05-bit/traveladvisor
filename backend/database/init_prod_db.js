const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function initDb() {
  console.log('🚀 Initializing Production Database...');
  
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    let schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Remove CREATE DATABASE and USE statements to ensure it runs on the assigned Aiven DB
    schemaSql = schemaSql.replace(/CREATE DATABASE[\s\S]*?USE\s+\w+;/i, '');

    // Strip out SQL single line comments
    schemaSql = schemaSql.replace(/--.*$/gm, '');

    // Split SQL queries by semicolon, filtering out empty strings
    const statements = schemaSql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    console.log(`📋 Found ${statements.length} SQL statements to execute.`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await db.query(statement);
      } catch (err) {
        // Ignore duplicate key errors on inserts (due to INSERT IGNORE)
        if (!err.message.includes('Duplicate entry') && !err.message.includes('already exists')) {
          console.error(`❌ Error executing statement #${i + 1}:`, err.message);
          console.error(`Statement: ${statement.substring(0, 100)}...`);
          throw err;
        }
      }
    }

    console.log('\n✅ Database initialized successfully with tables and seed data!');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Database initialization failed:', err.message);
    process.exit(1);
  }
}

initDb();
