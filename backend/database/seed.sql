-- =============================================================================
-- TravelAdvisor — Sample Seed Data
-- =============================================================================
-- Run AFTER schema.sql to re-seed the database with fresh sample data:
--   mysql -u root -p travel_advisor_db < database/seed.sql
--
-- WARNING: This script TRUNCATES all tables before inserting.
-- =============================================================================

USE travel_advisor_db;

-- Disable FK checks so we can truncate in any order
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE reviews;
TRUNCATE TABLE hotels;
TRUNCATE TABLE destinations;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- 1. USERS
-- =============================================================================
-- Admin password: Admin@123  (bcrypt hash)
-- User passwords: User@1234  (bcrypt hash)
INSERT INTO users (name, email, password, role) VALUES
  ('Admin User',    'admin@traveladvisor.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lry2', 'admin'),
  ('Priya Sharma',  'priya@example.com',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
  ('Rahul Verma',   'rahul@example.com',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

-- =============================================================================
-- 2. CATEGORIES
-- =============================================================================
INSERT INTO categories (category_name, description) VALUES
  ('Beach',        'Coastal destinations with beautiful beaches and sea views'),
  ('Hill Station', 'Scenic mountain destinations with cool climate'),
  ('Heritage',     'Historic forts, palaces, and UNESCO World Heritage Sites'),
  ('Wildlife',     'National parks, sanctuaries, and wildlife reserves'),
  ('Pilgrimage',   'Spiritual and religious destinations across India');

-- =============================================================================
-- 3. DESTINATIONS
-- =============================================================================
INSERT INTO destinations (category_id, name, state, city, description, image, budget, rating) VALUES
  (1, 'Goa Beaches',             'Goa',               'Panaji',
   'Famous for its golden beaches, vibrant nightlife, and Portuguese heritage, Goa is India''s party capital and a tropical paradise.',
   NULL, 3500.00, 4.50),

  (2, 'Manali',                  'Himachal Pradesh',   'Manali',
   'A high-altitude Himalayan resort town near the Rohtang Pass, offering adventure sports, snow-capped peaks, and lush valleys.',
   NULL, 4000.00, 4.70),

  (3, 'Jaipur - Pink City',      'Rajasthan',          'Jaipur',
   'The royal Pink City, home to magnificent forts and palaces like Amber Fort, Hawa Mahal, and City Palace.',
   NULL, 2500.00, 4.60),

  (4, 'Jim Corbett National Park','Uttarakhand',       'Ramnagar',
   'India''s oldest national park, famous for Bengal tigers, elephants, and diverse bird species in the Himalayan foothills.',
   NULL, 5000.00, 4.40),

  (5, 'Varanasi',                'Uttar Pradesh',      'Varanasi',
   'One of the world''s oldest living cities, situated on the banks of the Ganges, sacred for Hindus and renowned for its ghats and temples.',
   NULL, 2000.00, 4.80),

  (1, 'Andaman Islands',         'Andaman & Nicobar',  'Port Blair',
   'A pristine archipelago in the Bay of Bengal with crystal-clear waters, white sand beaches, and vibrant coral reefs.',
   NULL, 6000.00, 4.90),

  (2, 'Darjeeling',              'West Bengal',        'Darjeeling',
   'The Queen of Hills, famous for its tea estates, the Darjeeling Himalayan Railway, and breathtaking sunrise views of Kangchenjunga.',
   NULL, 3000.00, 4.60),

  (3, 'Agra - Taj Mahal',        'Uttar Pradesh',      'Agra',
   'Home to the iconic Taj Mahal — a UNESCO World Heritage Site and one of the Seven Wonders of the World, a monument of eternal love.',
   NULL, 3000.00, 4.90),

  (1, 'Kerala Backwaters',       'Kerala',             'Alleppey',
   'Serene network of lakes, canals, and lagoons, famous for houseboat cruises, lush paddy fields, and coconut groves.',
   NULL, 4500.00, 4.70),

  (4, 'Ranthambore',             'Rajasthan',          'Sawai Madhopur',
   'One of India''s best tiger reserves, offering thrilling wildlife safaris amidst ancient ruins and a majestic fort.',
   NULL, 5500.00, 4.50);

-- =============================================================================
-- 4. HOTELS
-- =============================================================================
INSERT INTO hotels (destination_id, hotel_name, location, price_per_night, rating, image) VALUES
  -- Goa (destination_id = 1)
  (1, 'Taj Exotica Resort & Spa',  'Benaulim Beach, South Goa', 18000.00, 4.80, NULL),
  (1, 'The Leela Goa',             'Cavelossim, South Goa',     15000.00, 4.70, NULL),
  (1, 'Zostel Goa',                'Anjuna, North Goa',          1200.00, 4.30, NULL),
  -- Manali (destination_id = 2)
  (2, 'Span Resort & Spa',         'Kullu-Manali Highway',       9000.00, 4.60, NULL),
  (2, 'The Himalayan',             'Hadimba Road, Manali',        7500.00, 4.50, NULL),
  -- Jaipur (destination_id = 3)
  (3, 'Rambagh Palace',            'Bhawani Singh Road, Jaipur', 22000.00, 4.90, NULL),
  (3, 'ITC Rajputana',             'Palace Road, Jaipur',        11000.00, 4.60, NULL),
  -- Varanasi (destination_id = 5)
  (5, 'Taj Nadesar Palace',        'Nadesar, Varanasi',          18000.00, 4.80, NULL),
  (5, 'Brijrama Palace',           'Darbhanga Ghat, Varanasi',    8500.00, 4.60, NULL),
  -- Agra (destination_id = 8)
  (8, 'The Oberoi Amarvilas',      'Taj East Gate, Agra',        45000.00, 4.90, NULL),
  (8, 'ITC Mughal',                'Fatehabad Road, Agra',       13000.00, 4.70, NULL),
  -- Kerala (destination_id = 9)
  (9, 'Kumarakom Lake Resort',     'Kumarakom, Kerala',          16000.00, 4.80, NULL),
  (9, 'Coconut Lagoon',            'Kumarakom, Kerala',          12000.00, 4.70, NULL);

-- =============================================================================
-- 5. REVIEWS
-- =============================================================================
INSERT INTO reviews (user_id, destination_id, rating, review) VALUES
  (2, 1, 5, 'Goa is absolutely magical! The beaches at Calangute and Anjuna are stunning. We had an amazing time exploring the local markets and trying fresh seafood. Highly recommend visiting during November-February for the best weather.'),
  (2, 2, 5, 'Manali blew my mind! The Solang Valley snow activities were thrilling, and the Rohtang Pass drive was one of the most scenic routes I have ever taken. The Hadimba Temple is a must-visit.'),
  (2, 3, 4, 'Jaipur is a royal experience. Amber Fort is breathtaking at sunset, and the Hawa Mahal is iconic. The local bazaars sell beautiful handicrafts. A bit crowded in peak season.'),
  (2, 8, 5, 'The Taj Mahal is beyond words. Standing in front of it at sunrise brought tears to my eyes. Agra has so much history — visit Agra Fort and Fatehpur Sikri too!'),
  (2, 9, 5, 'Kerala backwaters on a houseboat is the most peaceful experience. Waking up to mist over the backwaters, watching village life from the boat — truly unforgettable.'),
  (2, 5, 4, 'Varanasi is a deeply spiritual city. The Ganga Aarti at Dashashwamedh Ghat is mesmerizing. The city can be overwhelming but is absolutely worth experiencing.'),
  (3, 1, 4, 'Goa has great vibes! The beaches are beautiful and the food is amazing. Would love to visit again during the off-season for a more relaxed experience.'),
  (3, 6, 5, 'Andaman Islands are paradise on earth! The water is crystal clear and the marine life is incredible. Havelock Island is a must-visit for snorkeling and diving.');

-- Update destination ratings based on actual review averages
UPDATE destinations d
SET rating = (
  SELECT ROUND(AVG(r.rating), 2)
  FROM reviews r
  WHERE r.destination_id = d.id
)
WHERE EXISTS (SELECT 1 FROM reviews r WHERE r.destination_id = d.id);
