-- =============================================================================
-- TravelAdvisor Database Schema
-- =============================================================================
-- Run this file once to create and seed the database:
--   mysql -u root -p < database/schema.sql
-- =============================================================================

CREATE DATABASE IF NOT EXISTS travel_advisor_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE travel_advisor_db;

-- -----------------------------------------------------------------------------
-- 1. USERS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id         INT           NOT NULL AUTO_INCREMENT,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(150)  NOT NULL,
  password   VARCHAR(255)  NOT NULL,
  role       ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. CATEGORIES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id            INT          NOT NULL AUTO_INCREMENT,
  category_name VARCHAR(100) NOT NULL,
  description   TEXT,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_name (category_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. DESTINATIONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS destinations (
  id          INT            NOT NULL AUTO_INCREMENT,
  category_id INT            NOT NULL,
  name        VARCHAR(150)   NOT NULL,
  state       VARCHAR(100)   NOT NULL,
  city        VARCHAR(100)   NOT NULL,
  description TEXT           NOT NULL,
  image       VARCHAR(500),
  budget      DECIMAL(10,2)  NOT NULL DEFAULT 0.00
                             COMMENT 'Estimated daily budget in INR',
  best_time_to_visit VARCHAR(100) NULL,
  rating      DECIMAL(3,2)   NOT NULL DEFAULT 0.00
                             CHECK (rating >= 0 AND rating <= 5),
  created_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_destinations_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  KEY idx_destinations_state (state),
  KEY idx_destinations_category (category_id),
  FULLTEXT KEY ft_destinations_search (name, city, state, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. HOTELS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hotels (
  id              INT           NOT NULL AUTO_INCREMENT,
  destination_id  INT           NOT NULL,
  hotel_name      VARCHAR(150)  NOT NULL,
  location        VARCHAR(255)  NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL DEFAULT 0.00
                                COMMENT 'Price per night in INR',
  rating          DECIMAL(3,2)  NOT NULL DEFAULT 0.00
                                CHECK (rating >= 0 AND rating <= 5),
  image           VARCHAR(500),
  created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_hotels_destination
    FOREIGN KEY (destination_id) REFERENCES destinations(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  KEY idx_hotels_destination (destination_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. REVIEWS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
  id             INT       NOT NULL AUTO_INCREMENT,
  user_id        INT       NOT NULL,
  destination_id INT       NOT NULL,
  rating         TINYINT   NOT NULL CHECK (rating >= 1 AND rating <= 5),
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- SAMPLE DATA
-- =============================================================================

-- Categories
INSERT IGNORE INTO categories (category_name, description) VALUES
  ('Beach',         'Coastal destinations with beautiful beaches and sea views'),
  ('Hill Station',  'Scenic mountain destinations with cool climate'),
  ('Heritage',      'Historic forts, palaces, and UNESCO World Heritage Sites'),
  ('Wildlife',      'National parks, sanctuaries, and wildlife reserves'),
  ('Pilgrimage',    'Spiritual and religious destinations across India');

-- Destinations
INSERT IGNORE INTO destinations (category_id, name, state, city, description, image, budget, rating) VALUES
  (1, 'Goa Beaches',      'Goa',           'Panaji',
   'Famous for its golden beaches, vibrant nightlife, and Portuguese heritage, Goa is India''s party capital and a tropical paradise.',
   NULL, 3500.00, 4.5),

  (2, 'Manali',            'Himachal Pradesh', 'Manali',
   'A high-altitude Himalayan resort town near the Rohtang Pass, offering adventure sports, snow-capped peaks, and lush valleys.',
   NULL, 4000.00, 4.7),

  (3, 'Jaipur - Pink City','Rajasthan',    'Jaipur',
   'The royal Pink City, home to magnificent forts and palaces like Amber Fort, Hawa Mahal, and City Palace.',
   NULL, 2500.00, 4.6),

  (4, 'Jim Corbett National Park', 'Uttarakhand', 'Ramnagar',
   'India''s oldest national park, famous for Bengal tigers, elephants, and diverse bird species in the Himalayan foothills.',
   NULL, 5000.00, 4.4),

  (5, 'Varanasi',          'Uttar Pradesh', 'Varanasi',
   'One of the world''s oldest living cities, situated on the banks of the Ganges, sacred for Hindus and renowned for its ghats and temples.',
   NULL, 2000.00, 4.8),

  (1, 'Andaman Islands',   'Andaman & Nicobar', 'Port Blair',
   'A pristine archipelago in the Bay of Bengal with crystal-clear waters, white sand beaches, and vibrant coral reefs.',
   NULL, 6000.00, 4.9),

  (2, 'Darjeeling',        'West Bengal',  'Darjeeling',
   'The Queen of Hills, famous for its tea estates, the Darjeeling Himalayan Railway, and breathtaking sunrise views of Kangchenjunga.',
   NULL, 3000.00, 4.6),

  (3, 'Agra - Taj Mahal',  'Uttar Pradesh', 'Agra',
   'Home to the iconic Taj Mahal — a UNESCO World Heritage Site and one of the Seven Wonders of the World, a monument of eternal love.',
   NULL, 3000.00, 4.9),

  (1, 'Kerala Backwaters',  'Kerala',       'Alleppey',
   'Serene network of lakes, canals, and lagoons, famous for houseboat cruises, lush paddy fields, and coconut groves.',
   NULL, 4500.00, 4.7),

  (4, 'Ranthambore',        'Rajasthan',    'Sawai Madhopur',
   'One of India''s best tiger reserves, offering thrilling wildlife safaris amidst ancient ruins and a majestic fort.',
   NULL, 5500.00, 4.5);

-- Admin user (password: Admin@123)
INSERT IGNORE INTO users (name, email, password, role) VALUES
  ('Admin User', 'admin@traveladvisor.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lry2', 'admin');

-- Regular user (password: User@1234)
INSERT IGNORE INTO users (name, email, password, role) VALUES
  ('Priya Sharma', 'priya@example.com',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

-- Hotels
INSERT IGNORE INTO hotels (destination_id, hotel_name, location, price_per_night, rating, image) VALUES
  -- Goa (destination_id = 1)
  (1, 'Taj Exotica Resort & Spa', 'Benaulim Beach, South Goa', 18000.00, 4.8, NULL),
  (1, 'The Leela Goa',            'Cavelossim, South Goa',    15000.00, 4.7, NULL),
  (1, 'Zostel Goa',               'Anjuna, North Goa',         1200.00, 4.3, NULL),
  -- Manali (destination_id = 2)
  (2, 'Span Resort & Spa',        'Kullu-Manali Highway',      9000.00, 4.6, NULL),
  (2, 'The Himalayan',            'Hadimba Road, Manali',      7500.00, 4.5, NULL),
  -- Jaipur (destination_id = 3)
  (3, 'Rambagh Palace',           'Bhawani Singh Road, Jaipur',22000.00, 4.9, NULL),
  (3, 'ITC Rajputana',            'Palace Road, Jaipur',       11000.00, 4.6, NULL),
  -- Varanasi (destination_id = 5)
  (5, 'Taj Nadesar Palace',       'Nadesar, Varanasi',         18000.00, 4.8, NULL),
  (5, 'Brijrama Palace',          'Darbhanga Ghat, Varanasi',   8500.00, 4.6, NULL),
  -- Agra (destination_id = 8)
  (8, 'The Oberoi Amarvilas',     'Taj East Gate, Agra',       45000.00, 4.9, NULL),
  (8, 'ITC Mughal',               'Fatehabad Road, Agra',      13000.00, 4.7, NULL),
  -- Kerala (destination_id = 9)
  (9, 'Kumarakom Lake Resort',    'Kumarakom, Kerala',         16000.00, 4.8, NULL),
  (9, 'Coconut Lagoon',           'Kumarakom, Kerala',         12000.00, 4.7, NULL);

-- Reviews (user_id = 2 = priya@example.com)
INSERT IGNORE INTO reviews (user_id, destination_id, rating, review) VALUES
  (2, 1, 5, 'Goa is absolutely magical! The beaches at Calangute and Anjuna are stunning. We had an amazing time exploring the local markets and trying fresh seafood. Highly recommend visiting during November-February for the best weather.'),
  (2, 2, 5, 'Manali blew my mind! The Solang Valley snow activities were thrilling, and the Rohtang Pass drive was one of the most scenic routes I have ever taken. The Hadimba Temple is a must-visit.'),
  (2, 3, 4, 'Jaipur is a royal experience. Amber Fort is breathtaking at sunset, and the Hawa Mahal is iconic. The local bazaars sell beautiful handicrafts. A bit crowded in peak season.'),
  (2, 8, 5, 'The Taj Mahal is beyond words. Standing in front of it at sunrise brought tears to my eyes. Agra has so much history — visit Agra Fort and Fatehpur Sikri too!'),
  (2, 9, 5, 'Kerala backwaters on a houseboat is the most peaceful experience. Waking up to mist over the backwaters, watching village life from the boat — truly unforgettable.'),
  (2, 5, 4, 'Varanasi is a deeply spiritual city. The Ganga Aarti at Dashashwamedh Ghat is mesmerizing. The city can be overwhelming but is absolutely worth experiencing.');

-- Update destination ratings based on reviews
UPDATE destinations d
SET rating = (
  SELECT ROUND(AVG(r.rating), 2)
  FROM reviews r
  WHERE r.destination_id = d.id
)
WHERE EXISTS (SELECT 1 FROM reviews r WHERE r.destination_id = d.id);
