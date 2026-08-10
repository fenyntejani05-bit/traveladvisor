/**
 * TravelAdvisor Database Migration
 * Aligns the existing travel_advisor_db with the backend schema.
 * Run once: node database/migrate.js
 */

const db = require('../config/db');

async function runMigration() {
  console.log('🚀 Starting TravelAdvisor DB Migration...\n');

  try {
    // -----------------------------------------------------------------------
    // 1. FIX CATEGORIES TABLE  (rename 'name' → 'category_name')
    // -----------------------------------------------------------------------
    console.log('📋 Step 1: Fixing categories table...');
    const [catCols] = await db.query("SHOW COLUMNS FROM categories LIKE 'category_name'");
    if (catCols.length === 0) {
      await db.query("ALTER TABLE categories CHANGE COLUMN `name` `category_name` VARCHAR(100) NOT NULL");
      console.log('   ✅ Renamed categories.name → categories.category_name');
    } else {
      console.log('   ✅ categories.category_name already exists');
    }

    // Add unique constraint if missing
    try {
      await db.query("ALTER TABLE categories ADD UNIQUE KEY uq_categories_name (category_name)");
      console.log('   ✅ Added unique index on category_name');
    } catch (e) {
      if (!e.message.includes('Duplicate key name')) {
        console.log('   ✅ Unique index already exists');
      }
    }

    // -----------------------------------------------------------------------
    // 2. FIX DESTINATIONS TABLE (add state, city, budget, image; rename price→budget, location split)
    // -----------------------------------------------------------------------
    console.log('\n📋 Step 2: Fixing destinations table...');
    const [destCols] = await db.query("SHOW COLUMNS FROM destinations");
    const destColNames = destCols.map(c => c.Field);

    if (!destColNames.includes('state')) {
      await db.query("ALTER TABLE destinations ADD COLUMN `state` VARCHAR(100) NOT NULL DEFAULT '' AFTER `category_id`");
      console.log('   ✅ Added destinations.state');
    } else {
      console.log('   ✅ destinations.state already exists');
    }

    if (!destColNames.includes('city')) {
      await db.query("ALTER TABLE destinations ADD COLUMN `city` VARCHAR(100) NOT NULL DEFAULT '' AFTER `state`");
      console.log('   ✅ Added destinations.city');
    } else {
      console.log('   ✅ destinations.city already exists');
    }

    if (!destColNames.includes('budget')) {
      if (destColNames.includes('price')) {
        await db.query("ALTER TABLE destinations CHANGE COLUMN `price` `budget` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Estimated daily budget in INR'");
        console.log('   ✅ Renamed destinations.price → destinations.budget');
      } else {
        await db.query("ALTER TABLE destinations ADD COLUMN `budget` DECIMAL(10,2) NOT NULL DEFAULT 0.00");
        console.log('   ✅ Added destinations.budget');
      }
    } else {
      console.log('   ✅ destinations.budget already exists');
    }

    if (!destColNames.includes('image')) {
      if (destColNames.includes('image_url')) {
        await db.query("ALTER TABLE destinations CHANGE COLUMN `image_url` `image` VARCHAR(500) NULL");
        console.log('   ✅ Renamed destinations.image_url → destinations.image');
      } else {
        await db.query("ALTER TABLE destinations ADD COLUMN `image` VARCHAR(500) NULL");
        console.log('   ✅ Added destinations.image');
      }
    } else {
      console.log('   ✅ destinations.image already exists');
    }

    // Re-check columns after modifications
    const [destCols2] = await db.query("SHOW COLUMNS FROM destinations");
    const destColNames2 = destCols2.map(c => c.Field);

    // Remove old location column if it exists and no longer needed
    if (destColNames2.includes('location') && destColNames2.includes('city')) {
      // Copy location to city where city is empty
      await db.query("UPDATE destinations SET city = location WHERE city = '' AND location != ''");
      console.log('   ✅ Copied location data to city');
    }

    // Add indexes
    try {
      await db.query("ALTER TABLE destinations ADD KEY idx_destinations_state (state)");
    } catch (e) { /* index may already exist */ }

    console.log('   ✅ Destinations table fixed');

    // -----------------------------------------------------------------------
    // 3. CREATE HOTELS TABLE
    // -----------------------------------------------------------------------
    console.log('\n📋 Step 3: Creating hotels table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS hotels (
        id              INT           NOT NULL AUTO_INCREMENT,
        destination_id  INT           NOT NULL,
        hotel_name      VARCHAR(150)  NOT NULL,
        location        VARCHAR(255)  NOT NULL,
        price_per_night DECIMAL(10,2) NOT NULL DEFAULT 0.00
                                      COMMENT 'Price per night in INR',
        rating          DECIMAL(3,2)  NOT NULL DEFAULT 0.00,
        image           VARCHAR(500),
        created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        CONSTRAINT fk_hotels_destination
          FOREIGN KEY (destination_id) REFERENCES destinations(id)
          ON DELETE CASCADE ON UPDATE CASCADE,
        KEY idx_hotels_destination (destination_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('   ✅ hotels table created (or already exists)');

    // -----------------------------------------------------------------------
    // 4. CREATE REVIEWS TABLE
    // -----------------------------------------------------------------------
    console.log('\n📋 Step 4: Creating reviews table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id             INT       NOT NULL AUTO_INCREMENT,
        user_id        INT       NOT NULL,
        destination_id INT       NOT NULL,
        rating         TINYINT   NOT NULL,
        review         TEXT      NOT NULL,
        created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        CONSTRAINT fk_reviews_user
          FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_reviews_destination
          FOREIGN KEY (destination_id) REFERENCES destinations(id)
          ON DELETE CASCADE ON UPDATE CASCADE,
        KEY idx_reviews_destination (destination_id),
        KEY idx_reviews_user (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('   ✅ reviews table created (or already exists)');

    // -----------------------------------------------------------------------
    // 5. SEED CATEGORIES (if empty)
    // -----------------------------------------------------------------------
    console.log('\n📋 Step 5: Seeding categories...');
    const [catCount] = await db.query('SELECT COUNT(*) AS cnt FROM categories');
    if (catCount[0].cnt === 0) {
      await db.query(`
        INSERT INTO categories (category_name, description) VALUES
          ('Beach',         'Coastal destinations with beautiful beaches and sea views'),
          ('Hill Station',  'Scenic mountain destinations with cool climate'),
          ('Heritage',      'Historic forts, palaces, and UNESCO World Heritage Sites'),
          ('Wildlife',      'National parks, sanctuaries, and wildlife reserves'),
          ('Pilgrimage',    'Spiritual and religious destinations across India')
      `);
      console.log('   ✅ 5 categories seeded');
    } else {
      console.log(`   ✅ Categories already have ${catCount[0].cnt} records`);
    }

    // -----------------------------------------------------------------------
    // 6. SEED DESTINATIONS (if empty)
    // -----------------------------------------------------------------------
    console.log('\n📋 Step 6: Seeding destinations...');
    const [destCount] = await db.query('SELECT COUNT(*) AS cnt FROM destinations');
    if (destCount[0].cnt === 0) {
      const [cats] = await db.query('SELECT id, category_name FROM categories');
      const catMap = {};
      cats.forEach(c => { catMap[c.category_name] = c.id; });

      await db.query(`
        INSERT INTO destinations (category_id, name, state, city, description, image, budget, rating) VALUES
          (?, 'Goa Beaches', 'Goa', 'Panaji', 'Famous for its golden beaches, vibrant nightlife, and Portuguese heritage, Goa is India''s party capital and a tropical paradise.', NULL, 3500.00, 4.5),
          (?, 'Manali', 'Himachal Pradesh', 'Manali', 'A high-altitude Himalayan resort town near the Rohtang Pass, offering adventure sports, snow-capped peaks, and lush valleys.', NULL, 4000.00, 4.7),
          (?, 'Jaipur - Pink City', 'Rajasthan', 'Jaipur', 'The royal Pink City, home to magnificent forts and palaces like Amber Fort, Hawa Mahal, and City Palace.', NULL, 2500.00, 4.6),
          (?, 'Jim Corbett National Park', 'Uttarakhand', 'Ramnagar', 'India''s oldest national park, famous for Bengal tigers, elephants, and diverse bird species.', NULL, 5000.00, 4.4),
          (?, 'Varanasi', 'Uttar Pradesh', 'Varanasi', 'One of the world''s oldest living cities on the banks of the Ganges, sacred for Hindus.', NULL, 2000.00, 4.8),
          (?, 'Andaman Islands', 'Andaman & Nicobar', 'Port Blair', 'A pristine archipelago in the Bay of Bengal with crystal-clear waters and coral reefs.', NULL, 6000.00, 4.9),
          (?, 'Darjeeling', 'West Bengal', 'Darjeeling', 'The Queen of Hills, famous for tea estates and breathtaking views of Kangchenjunga.', NULL, 3000.00, 4.6),
          (?, 'Agra - Taj Mahal', 'Uttar Pradesh', 'Agra', 'Home to the iconic Taj Mahal — a UNESCO World Heritage Site and one of the Seven Wonders.', NULL, 3000.00, 4.9),
          (?, 'Kerala Backwaters', 'Kerala', 'Alleppey', 'Serene network of lakes and canals, famous for houseboat cruises and lush paddy fields.', NULL, 4500.00, 4.7),
          (?, 'Ranthambore', 'Rajasthan', 'Sawai Madhopur', 'One of India''s best tiger reserves, offering thrilling wildlife safaris amidst ancient ruins.', NULL, 5500.00, 4.5)
      `, [
        catMap['Beach'], catMap['Hill Station'], catMap['Heritage'], catMap['Wildlife'], catMap['Pilgrimage'],
        catMap['Beach'], catMap['Hill Station'], catMap['Heritage'], catMap['Beach'], catMap['Wildlife']
      ]);
      console.log('   ✅ 10 destinations seeded');
    } else {
      // Update state/city for existing rows that were migrated from location column
      await db.query(`
        UPDATE destinations SET
          state = CASE id
            WHEN 1 THEN 'Goa'
            WHEN 2 THEN 'Himachal Pradesh'
            WHEN 3 THEN 'Rajasthan'
            WHEN 4 THEN 'Uttarakhand'
            WHEN 5 THEN 'Uttar Pradesh'
            ELSE state
          END,
          city = CASE id
            WHEN 1 THEN 'Panaji'
            WHEN 2 THEN 'Manali'
            WHEN 3 THEN 'Jaipur'
            WHEN 4 THEN 'Ramnagar'
            WHEN 5 THEN 'Varanasi'
            ELSE city
          END
        WHERE state = '' OR state IS NULL
      `);
      console.log(`   ✅ Destinations already have ${destCount[0].cnt} records (updated state/city)`);
    }

    // -----------------------------------------------------------------------
    // 7. SEED HOTELS (if empty)
    // -----------------------------------------------------------------------
    console.log('\n📋 Step 7: Seeding hotels...');
    const [hotelCount] = await db.query('SELECT COUNT(*) AS cnt FROM hotels');
    if (hotelCount[0].cnt === 0) {
      const [dests] = await db.query('SELECT id, name FROM destinations ORDER BY id LIMIT 10');
      if (dests.length >= 5) {
        await db.query(`
          INSERT INTO hotels (destination_id, hotel_name, location, price_per_night, rating, image) VALUES
            (?, 'Taj Exotica Resort & Spa', 'Benaulim Beach, South Goa', 18000.00, 4.8, NULL),
            (?, 'The Leela Goa', 'Cavelossim, South Goa', 15000.00, 4.7, NULL),
            (?, 'Zostel Goa', 'Anjuna, North Goa', 1200.00, 4.3, NULL),
            (?, 'Span Resort & Spa', 'Kullu-Manali Highway', 9000.00, 4.6, NULL),
            (?, 'The Himalayan', 'Hadimba Road, Manali', 7500.00, 4.5, NULL),
            (?, 'Rambagh Palace', 'Bhawani Singh Road, Jaipur', 22000.00, 4.9, NULL),
            (?, 'ITC Rajputana', 'Palace Road, Jaipur', 11000.00, 4.6, NULL),
            (?, 'Taj Nadesar Palace', 'Nadesar, Varanasi', 18000.00, 4.8, NULL),
            (?, 'The Oberoi Amarvilas', 'Taj East Gate, Agra', 45000.00, 4.9, NULL),
            (?, 'Kumarakom Lake Resort', 'Kumarakom, Kerala', 16000.00, 4.8, NULL)
        `, [
          dests[0].id, dests[0].id, dests[0].id,
          dests[1].id, dests[1].id,
          dests[2].id, dests[2].id,
          dests[4].id,
          dests[7] ? dests[7].id : dests[2].id,
          dests[8] ? dests[8].id : dests[0].id
        ]);
        console.log('   ✅ 10 hotels seeded');
      }
    } else {
      console.log(`   ✅ Hotels already have ${hotelCount[0].cnt} records`);
    }

    // -----------------------------------------------------------------------
    // 8. ENSURE ADMIN USER EXISTS
    // -----------------------------------------------------------------------
    console.log('\n📋 Step 8: Verifying admin user...');
    const [adminRows] = await db.query("SELECT id FROM users WHERE email = 'admin@traveladvisor.com'");
    if (adminRows.length === 0) {
      // bcrypt hash of 'Admin@123'
      await db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        ['Admin User', 'admin@traveladvisor.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lry2', 'admin']
      );
      console.log('   ✅ Admin user created (admin@traveladvisor.com / Admin@123)');
    } else {
      console.log('   ✅ Admin user already exists');
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📌 Summary:');
    const [finalDests] = await db.query('SELECT COUNT(*) AS cnt FROM destinations');
    const [finalHotels] = await db.query('SELECT COUNT(*) AS cnt FROM hotels');
    const [finalReviews] = await db.query('SELECT COUNT(*) AS cnt FROM reviews');
    const [finalCats] = await db.query('SELECT COUNT(*) AS cnt FROM categories');
    const [finalUsers] = await db.query('SELECT COUNT(*) AS cnt FROM users');
    console.log(`   Categories:  ${finalCats[0].cnt}`);
    console.log(`   Destinations: ${finalDests[0].cnt}`);
    console.log(`   Hotels:      ${finalHotels[0].cnt}`);
    console.log(`   Reviews:     ${finalReviews[0].cnt}`);
    console.log(`   Users:       ${finalUsers[0].cnt}`);

  } catch (err) {
    console.error('\n❌ Migration failed:', err.message);
    console.error(err.stack);
  } finally {
    process.exit(0);
  }
}

runMigration();
