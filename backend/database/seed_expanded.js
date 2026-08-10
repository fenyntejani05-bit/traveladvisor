/**
 * TravelAdvisor — Expanded Seed Script
 * - 36 verified destinations with accurate, place-specific images
 * - Hotels and reviews linked correctly
 * Run: node backend/database/seed_expanded.js
 */

const db = require('../config/db');

async function runSeed() {
  console.log('🚀 TravelAdvisor Expanded Seed Starting...\n');

  try {
    // ── Step 1: Ensure best_time_to_visit column exists ──
    const [cols] = await db.query("SHOW COLUMNS FROM destinations LIKE 'best_time_to_visit'");
    if (cols.length === 0) {
      await db.query("ALTER TABLE destinations ADD COLUMN `best_time_to_visit` VARCHAR(100) NULL AFTER `budget`");
      console.log('✅ Added best_time_to_visit column');
    }

    // ── Step 2: Clear existing data ──
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.query('TRUNCATE TABLE reviews');
    await db.query('TRUNCATE TABLE hotels');
    await db.query('TRUNCATE TABLE destinations');
    await db.query('TRUNCATE TABLE categories');
    await db.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Cleared old data\n');

    // ── Step 3: Seed categories ──
    const [catRes] = await db.query(`
      INSERT INTO categories (category_name, description) VALUES
        ('Beach',        'Coastal destinations with beautiful beaches and sea views'),
        ('Hill Station', 'Scenic mountain destinations with cool climate'),
        ('Heritage',     'Historic forts, palaces, and UNESCO World Heritage Sites'),
        ('Wildlife',     'National parks, sanctuaries, and wildlife reserves'),
        ('Pilgrimage',   'Spiritual and religious destinations across India'),
        ('Adventure',    'Thrilling trekking, skiing and outdoor adventure destinations')
    `);
    console.log('✅ Categories seeded');

    // Fetch category IDs by name
    const [cats] = await db.query('SELECT id, category_name FROM categories');
    const catMap = {};
    cats.forEach(c => { catMap[c.category_name] = c.id; });

    // ── Step 4: Seed destinations ──
    // Images are verified Unsplash photos matching each specific location
    const destinations = [
      // ── BEACHES ──
      {
        cat: 'Beach', name: 'Goa Beaches', state: 'Goa', city: 'Panaji',
        desc: 'Famous for its golden beaches, vibrant nightlife, water sports, and historic Portuguese-era churches, Goa is India\'s ultimate tropical beach getaway.',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
        budget: 3500, best_time: 'November to February', rating: 4.5
      },
      {
        cat: 'Beach', name: 'Andaman Islands', state: 'Andaman & Nicobar', city: 'Port Blair',
        desc: 'A pristine group of tropical islands in the Bay of Bengal, featuring crystal-clear turquoise waters, white sand beaches, and thriving coral reefs.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
        budget: 6000, best_time: 'October to May', rating: 4.9
      },
      {
        cat: 'Beach', name: 'Kerala Backwaters', state: 'Kerala', city: 'Alleppey',
        desc: 'An idyllic labyrinth of lakes, canals, and lagoons fringed by coconut trees. A stay on a traditional luxury houseboat offers unmatched serenity.',
        image: 'https://images.unsplash.com/photo-1609766418204-5e88489b7e5f?auto=format&fit=crop&w=800&q=80',
        budget: 4500, best_time: 'September to March', rating: 4.7
      },
      {
        cat: 'Beach', name: 'Varkala Beach', state: 'Kerala', city: 'Varkala',
        desc: 'A beautiful beach town in Kerala, unique for its red laterite cliffs bordering the Arabian Sea, natural mineral springs, and a relaxed bohemian vibe.',
        image: 'https://images.unsplash.com/photo-1590080875852-4a073b0cbf39?auto=format&fit=crop&w=800&q=80',
        budget: 2800, best_time: 'October to March', rating: 4.6
      },
      {
        cat: 'Beach', name: 'Puri Beach', state: 'Odisha', city: 'Puri',
        desc: 'A sacred seaside town housing the famous Jagannath Temple alongside wide golden shores of the Bay of Bengal, drawing both pilgrims and beach lovers.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        budget: 2200, best_time: 'October to February', rating: 4.4
      },
      {
        cat: 'Beach', name: 'Pondicherry', state: 'Puducherry', city: 'Pondicherry',
        desc: 'A charming French colonial seaside town with colorful villas, tranquil ashrams, pristine beaches, and a unique fusion of French and Tamil culture.',
        image: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=800&q=80',
        budget: 2600, best_time: 'October to March', rating: 4.6
      },

      // ── HILL STATIONS ──
      {
        cat: 'Hill Station', name: 'Manali', state: 'Himachal Pradesh', city: 'Manali',
        desc: 'A gorgeous Himalayan valley town offering adventure sports like paragliding, beautiful apple orchards, hot springs, and snow-clad mountain peaks near Rohtang Pass.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
        budget: 4000, best_time: 'October to June', rating: 4.7
      },
      {
        cat: 'Hill Station', name: 'Darjeeling', state: 'West Bengal', city: 'Darjeeling',
        desc: 'Known as the "Queen of Hills," Darjeeling is famed for its vast tea estates, panoramic views of Mt. Kanchenjunga, and the historic Darjeeling Himalayan Toy Train.',
        image: 'https://images.unsplash.com/photo-1604925697864-f7f4cf32de04?auto=format&fit=crop&w=800&q=80',
        budget: 3000, best_time: 'April to June, October to December', rating: 4.6
      },
      {
        cat: 'Hill Station', name: 'Munnar', state: 'Kerala', city: 'Munnar',
        desc: 'A breathtaking hill resort nestled in Kerala\'s Western Ghats, famous for its rolling hills covered in lush green tea plantations and mist-filled valleys.',
        image: 'https://images.unsplash.com/photo-1572879023364-ab4f53a9a2e5?auto=format&fit=crop&w=800&q=80',
        budget: 3200, best_time: 'September to May', rating: 4.8
      },
      {
        cat: 'Hill Station', name: 'Ooty', state: 'Tamil Nadu', city: 'Ooty',
        desc: 'Popularly known as the "Queen of Hill Stations," Ooty features beautiful botanical gardens, serene Ooty Lake, tea gardens, and a charming Nilgiri Mountain Railway.',
        image: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=800&q=80',
        budget: 3000, best_time: 'October to June', rating: 4.5
      },
      {
        cat: 'Hill Station', name: 'Gulmarg', state: 'Jammu & Kashmir', city: 'Gulmarg',
        desc: 'A premier ski resort in winter and a meadow of wildflowers in summer, Gulmarg boasts the world\'s highest operating gondola cable car with stunning Himalayan vistas.',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
        budget: 5500, best_time: 'December to March (Snow), April to June (Summer)', rating: 4.9
      },
      {
        cat: 'Hill Station', name: 'Leh Ladakh', state: 'Ladakh', city: 'Leh',
        desc: 'A high-altitude desert region with dramatic mountain passes, deep valleys, stunning Buddhist monasteries, the blue Pangong Lake, and the mighty Zanskar River.',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
        budget: 6500, best_time: 'May to September', rating: 4.9
      },
      {
        cat: 'Hill Station', name: 'Shimla', state: 'Himachal Pradesh', city: 'Shimla',
        desc: 'The former summer capital of British India, Shimla charms visitors with its colonial architecture, toy train ride, pine-forested hills, and snow in winter.',
        image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80',
        budget: 3500, best_time: 'March to June, December to January', rating: 4.5
      },
      {
        cat: 'Hill Station', name: 'Coorg', state: 'Karnataka', city: 'Madikeri',
        desc: 'Known as the "Scotland of India," Coorg is a lush hill district with vast coffee and spice plantations, spectacular waterfalls, and misty valleys.',
        image: 'https://images.unsplash.com/photo-1629196613026-0370602c8c47?auto=format&fit=crop&w=800&q=80',
        budget: 3800, best_time: 'October to March', rating: 4.7
      },
      {
        cat: 'Hill Station', name: 'Spiti Valley', state: 'Himachal Pradesh', city: 'Kaza',
        desc: 'A cold desert mountain valley in the Himalayas, Spiti offers raw, dramatic landscapes, ancient monasteries, and remote Himalayan villages.',
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
        budget: 4500, best_time: 'June to September', rating: 4.8
      },
      {
        cat: 'Hill Station', name: 'Nainital', state: 'Uttarakhand', city: 'Nainital',
        desc: 'A scenic lake town in the Kumaon Himalayas, centered around the beautiful Naini Lake, with boating, forest trails, and the famous Snow View Point.',
        image: 'https://images.unsplash.com/photo-1559552117-e52a5cd8a31f?auto=format&fit=crop&w=800&q=80',
        budget: 3000, best_time: 'March to June, October to November', rating: 4.5
      },
      {
        cat: 'Hill Station', name: 'Mahabaleshwar', state: 'Maharashtra', city: 'Mahabaleshwar',
        desc: 'Maharashtra\'s most popular hill station, famous for its lush strawberry farms, panoramic viewpoints like Arthur\'s Seat, and the beautiful Venna Lake.',
        image: 'https://images.unsplash.com/photo-1598028342862-9df9d1a3a93c?auto=format&fit=crop&w=800&q=80',
        budget: 2800, best_time: 'October to June', rating: 4.4
      },

      // ── HERITAGE ──
      {
        cat: 'Heritage', name: 'Jaipur - Pink City', state: 'Rajasthan', city: 'Jaipur',
        desc: 'The capital of Rajasthan, famous for its grand historical architecture including the Hawa Mahal, Amber Fort, and City Palace, reflecting India\'s royal heritage.',
        image: 'https://images.unsplash.com/photo-1477587458883-471a5ed94245?auto=format&fit=crop&w=800&q=80',
        budget: 2500, best_time: 'October to March', rating: 4.6
      },
      {
        cat: 'Heritage', name: 'Agra - Taj Mahal', state: 'Uttar Pradesh', city: 'Agra',
        desc: 'Home to the legendary Taj Mahal, Agra is an ancient Mughal capital showcasing timeless architecture, including the grand Agra Fort and Fatehpur Sikri.',
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
        budget: 3000, best_time: 'October to March', rating: 4.9
      },
      {
        cat: 'Heritage', name: 'Hampi Ruins', state: 'Karnataka', city: 'Hampi',
        desc: 'A UNESCO World Heritage Site featuring the sprawling ruins of the historic Vijayanagara Empire, set in a unique and dramatic boulder-strewn landscape.',
        image: 'https://images.unsplash.com/photo-1600100397608-f010e42ecfcf?auto=format&fit=crop&w=800&q=80',
        budget: 2400, best_time: 'October to February', rating: 4.7
      },
      {
        cat: 'Heritage', name: 'Udaipur - Lake City', state: 'Rajasthan', city: 'Udaipur',
        desc: 'Known as the "Venice of the East," Udaipur is famed for its romantic Lake Pichola, stunning marble palaces, and its beautiful setting among the Aravalli hills.',
        image: 'https://images.unsplash.com/photo-1595875709518-c8d17961b6c0?auto=format&fit=crop&w=800&q=80',
        budget: 3500, best_time: 'September to March', rating: 4.8
      },
      {
        cat: 'Heritage', name: 'Jaisalmer Desert', state: 'Rajasthan', city: 'Jaisalmer',
        desc: 'The Golden City of Rajasthan, known for its majestic sandstone fort rising from the Thar Desert, magnificent havelis, and spectacular Sam Sand Dunes.',
        image: 'https://images.unsplash.com/photo-1524230659092-07f99a75c013?auto=format&fit=crop&w=800&q=80',
        budget: 2800, best_time: 'October to March', rating: 4.6
      },
      {
        cat: 'Heritage', name: 'Mysore Palace', state: 'Karnataka', city: 'Mysore',
        desc: 'A spectacular historical palace, the seat of the Kingdom of Mysore, famous for its Indo-Saracenic architecture and the dazzling illumination of 97,000 light bulbs.',
        image: 'https://images.unsplash.com/photo-1590145765-f40c08b1a862?auto=format&fit=crop&w=800&q=80',
        budget: 2300, best_time: 'October to March', rating: 4.7
      },
      {
        cat: 'Heritage', name: 'Jodhpur - Blue City', state: 'Rajasthan', city: 'Jodhpur',
        desc: 'The "Blue City" of Rajasthan, dominated by the magnificent Mehrangarh Fort and a labyrinth of blue-painted houses, with views of the vast Thar Desert.',
        image: 'https://images.unsplash.com/photo-1599030823659-52ee04b82a35?auto=format&fit=crop&w=800&q=80',
        budget: 2600, best_time: 'October to March', rating: 4.7
      },
      {
        cat: 'Heritage', name: 'Khajuraho Temples', state: 'Madhya Pradesh', city: 'Khajuraho',
        desc: 'A UNESCO World Heritage Site famous for its intricately carved medieval temples with erotic sculptures, representing the zenith of Chandela art and architecture.',
        image: 'https://images.unsplash.com/photo-1585813755478-8c8c4ec3a6d5?auto=format&fit=crop&w=800&q=80',
        budget: 2500, best_time: 'October to February', rating: 4.5
      },

      // ── WILDLIFE ──
      {
        cat: 'Wildlife', name: 'Jim Corbett National Park', state: 'Uttarakhand', city: 'Ramnagar',
        desc: 'India\'s oldest national park in the foothills of the Himalayas, renowned for its rich diversity of flora and fauna, especially the endangered Bengal Tigers.',
        image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80',
        budget: 5000, best_time: 'November to May', rating: 4.4
      },
      {
        cat: 'Wildlife', name: 'Ranthambore National Park', state: 'Rajasthan', city: 'Sawai Madhopur',
        desc: 'One of Northern India\'s largest national parks, combining a historical 10th-century fort with a thriving sanctuary for Royal Bengal Tigers in their natural habitat.',
        image: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=800&q=80',
        budget: 5500, best_time: 'October to June', rating: 4.5
      },
      {
        cat: 'Wildlife', name: 'Kaziranga National Park', state: 'Assam', city: 'Kohora',
        desc: 'A UNESCO World Heritage Site housing two-thirds of the world\'s great Indian One-Horned Rhinoceroses in lush swampy grasslands alongside tigers and elephants.',
        image: 'https://images.unsplash.com/photo-1504540637558-e0a5bf3d4d93?auto=format&fit=crop&w=800&q=80',
        budget: 4800, best_time: 'November to April', rating: 4.7
      },
      {
        cat: 'Wildlife', name: 'Gir Forest National Park', state: 'Gujarat', city: 'Junagadh',
        desc: 'The sole remaining sanctuary of the majestic Asiatic Lions, featuring dry deciduous scrub forests and a thriving ecosystem of leopards, deer, and crocodiles.',
        image: 'https://images.unsplash.com/photo-1598811629013-4f6b4c18f5f7?auto=format&fit=crop&w=800&q=80',
        budget: 4200, best_time: 'December to March', rating: 4.6
      },

      // ── PILGRIMAGE ──
      {
        cat: 'Pilgrimage', name: 'Varanasi', state: 'Uttar Pradesh', city: 'Varanasi',
        desc: 'One of the oldest continuously inhabited cities in the world, Varanasi is the spiritual heart of India, famous for its sacred Ganga river ghats and evening Aarti.',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=800&q=80',
        budget: 2000, best_time: 'October to March', rating: 4.8
      },
      {
        cat: 'Pilgrimage', name: 'Amritsar - Golden Temple', state: 'Punjab', city: 'Amritsar',
        desc: 'Home to the magnificent Harmandir Sahib (Golden Temple), the holiest shrine of Sikhism, offering unparalleled peace, golden architecture, and community langar.',
        image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80',
        budget: 2200, best_time: 'October to March', rating: 4.9
      },
      {
        cat: 'Pilgrimage', name: 'Madurai - Meenakshi Temple', state: 'Tamil Nadu', city: 'Madurai',
        desc: 'An ancient temple city centering around the colossal Meenakshi Amman Temple, featuring towering gopurams adorned with thousands of vibrant colorful sculptures.',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
        budget: 2100, best_time: 'October to March', rating: 4.8
      },
      {
        cat: 'Pilgrimage', name: 'Rishikesh', state: 'Uttarakhand', city: 'Rishikesh',
        desc: 'The Yoga Capital of the World on the Ganges River, combining spiritual ashrams and meditation retreats with thrilling white-water rafting and bungee jumping.',
        image: 'https://images.unsplash.com/photo-1622308644420-b20142373e7a?auto=format&fit=crop&w=800&q=80',
        budget: 2500, best_time: 'September to November, March to May', rating: 4.7
      },
      {
        cat: 'Pilgrimage', name: 'Kedarnath Temple', state: 'Uttarakhand', city: 'Kedarnath',
        desc: 'A holy Hindu temple dedicated to Lord Shiva, located in the Garhwal Himalayan range near the Mandakini river. Accessible only by trek or helicopter.',
        image: 'https://images.unsplash.com/photo-1669207445672-97f3793dab2a?auto=format&fit=crop&w=800&q=80',
        budget: 4000, best_time: 'May to June, September to October', rating: 4.9
      },
      {
        cat: 'Pilgrimage', name: 'Tirupati - Venkateswara Temple', state: 'Andhra Pradesh', city: 'Tirupati',
        desc: 'One of the most visited religious sites in the world, the Venkateswara Temple atop the seven Tirumala Hills is the richest and most visited Hindu temple.',
        image: 'https://images.unsplash.com/photo-1601997220868-98b96a1be748?auto=format&fit=crop&w=800&q=80',
        budget: 3000, best_time: 'September to February', rating: 4.8
      },

      // ── ADVENTURE ──
      {
        cat: 'Adventure', name: 'Rishikesh Rafting', state: 'Uttarakhand', city: 'Rishikesh',
        desc: 'India\'s adventure capital, offering thrilling white-water rafting on the Ganges rapids, bungee jumping from India\'s highest platform, and giant swing adventures.',
        image: 'https://images.unsplash.com/photo-1530870110042-98b2cb110834?auto=format&fit=crop&w=800&q=80',
        budget: 3000, best_time: 'September to November, March to May', rating: 4.8
      },
    ];

    const insertedDests = [];
    for (const d of destinations) {
      const [res] = await db.query(
        `INSERT INTO destinations (category_id, name, state, city, description, image, budget, best_time_to_visit, rating)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [catMap[d.cat], d.name, d.state, d.city, d.desc, d.image, d.budget, d.best_time, d.rating]
      );
      insertedDests.push({ id: res.insertId, name: d.name });
    }
    console.log(`✅ Seeded ${insertedDests.length} destinations\n`);

    const getDestId = (name) => {
      const found = insertedDests.find(d => d.name === name);
      return found ? found.id : null;
    };

    // ── Step 5: Seed hotels ──
    const hotels = [
      // Goa
      { dest: 'Goa Beaches', name: 'Taj Exotica Resort & Spa', loc: 'Benaulim Beach, South Goa', price: 18000, rating: 4.8, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' },
      { dest: 'Goa Beaches', name: 'The Leela Goa', loc: 'Cavelossim, South Goa', price: 15000, rating: 4.7, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80' },
      { dest: 'Goa Beaches', name: 'Zostel Goa', loc: 'Anjuna, North Goa', price: 1200, rating: 4.3, image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80' },
      // Manali
      { dest: 'Manali', name: 'Span Resort & Spa', loc: 'Kullu-Manali Highway', price: 9000, rating: 4.6, image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80' },
      { dest: 'Manali', name: 'The Himalayan', loc: 'Hadimba Road, Manali', price: 7500, rating: 4.5, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80' },
      // Jaipur
      { dest: 'Jaipur - Pink City', name: 'Rambagh Palace', loc: 'Bhawani Singh Road, Jaipur', price: 22000, rating: 4.9, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80' },
      { dest: 'Jaipur - Pink City', name: 'ITC Rajputana', loc: 'Palace Road, Jaipur', price: 11000, rating: 4.6, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80' },
      // Agra
      { dest: 'Agra - Taj Mahal', name: 'The Oberoi Amarvilas', loc: 'Taj East Gate, Agra', price: 45000, rating: 4.9, image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80' },
      { dest: 'Agra - Taj Mahal', name: 'ITC Mughal Agra', loc: 'Fatehabad Road, Agra', price: 13000, rating: 4.7, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80' },
      // Udaipur
      { dest: 'Udaipur - Lake City', name: 'The Taj Lake Palace', loc: 'Pichola Lake, Udaipur', price: 26000, rating: 4.9, image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80' },
      { dest: 'Udaipur - Lake City', name: 'Brij Rama Palace', loc: 'Chandpol, Udaipur', price: 8500, rating: 4.6, image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80' },
      // Leh Ladakh
      { dest: 'Leh Ladakh', name: 'The Grand Dragon Ladakh', loc: 'Old Road, Leh', price: 12000, rating: 4.8, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80' },
      // Munnar
      { dest: 'Munnar', name: 'Fragrant Nature Munnar', loc: 'Bison Valley Road, Munnar', price: 9500, rating: 4.7, image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80' },
      // Varanasi
      { dest: 'Varanasi', name: 'Taj Nadesar Palace', loc: 'Nadesar, Varanasi', price: 18000, rating: 4.8, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80' },
      { dest: 'Varanasi', name: 'Brijrama Palace', loc: 'Darbhanga Ghat, Varanasi', price: 8500, rating: 4.6, image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80' },
      // Rishikesh
      { dest: 'Rishikesh', name: 'Aloha On The Ganges', loc: 'Tapovan, Rishikesh', price: 8000, rating: 4.6, image: 'https://images.unsplash.com/photo-1611048267451-e6ed903d4a38?auto=format&fit=crop&w=800&q=80' },
      // Shimla
      { dest: 'Shimla', name: 'Wildflower Hall', loc: 'Mashobra, Shimla', price: 20000, rating: 4.9, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80' },
      { dest: 'Shimla', name: 'The Cecil Hotel', loc: 'Chaura Maidan, Shimla', price: 12000, rating: 4.7, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' },
      // Jodhpur
      { dest: 'Jodhpur - Blue City', name: 'Umaid Bhawan Palace', loc: 'Circuit House Road, Jodhpur', price: 35000, rating: 4.9, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80' },
      { dest: 'Jodhpur - Blue City', name: 'Raas Jodhpur', loc: 'Tunwarji Ka Jhalra, Jodhpur', price: 15000, rating: 4.8, image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80' },
      // Amritsar
      { dest: 'Amritsar - Golden Temple', name: 'Taj Swarna Amritsar', loc: 'Queens Road, Amritsar', price: 10000, rating: 4.7, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80' },
      // Kerala Backwaters
      { dest: 'Kerala Backwaters', name: 'Kumarakom Lake Resort', loc: 'Kumarakom, Kerala', price: 16000, rating: 4.8, image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80' },
      { dest: 'Kerala Backwaters', name: 'Coconut Lagoon', loc: 'Kumarakom, Kerala', price: 12000, rating: 4.7, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80' },
    ];

    let hotelCount = 0;
    for (const h of hotels) {
      const destId = getDestId(h.dest);
      if (destId) {
        await db.query(
          `INSERT INTO hotels (destination_id, hotel_name, location, price_per_night, rating, image) VALUES (?, ?, ?, ?, ?, ?)`,
          [destId, h.name, h.loc, h.price, h.rating, h.image]
        );
        hotelCount++;
      }
    }
    console.log(`✅ Seeded ${hotelCount} hotels\n`);

    // ── Step 6: Seed reviews ──
    const [users] = await db.query("SELECT id FROM users WHERE role = 'user' LIMIT 1");
    const userId = users.length > 0 ? users[0].id : 1;

    const reviews = [
      { dest: 'Goa Beaches', rating: 5, review: 'Goa is absolutely magical! The beaches at Palolem and Benaulim are stunning. The Portuguese architecture in Panaji adds a unique charm. Perfect blend of relaxation and culture!' },
      { dest: 'Manali', rating: 5, review: 'Manali exceeded all expectations! Paragliding in Solang Valley was thrilling and the snow-capped Himalayan peaks are breathtaking. The Rohtang Pass drive is a must-do.' },
      { dest: 'Jaipur - Pink City', rating: 4, review: 'Jaipur has a royal charm like no other. Amber Fort at sunset is breathtaking and Hawa Mahal is iconic. Local bazaars sell beautiful handicrafts. Can get crowded in peak season.' },
      { dest: 'Agra - Taj Mahal', rating: 5, review: 'Seeing the Taj Mahal at sunrise was a deeply spiritual experience. The white marble glowing in the morning light is something you can never forget. Truly a wonder of the world.' },
      { dest: 'Kerala Backwaters', rating: 5, review: 'The backwaters houseboat cruise in Alleppey is the most peaceful experience. Watching villages and coconut palms glide by while eating fresh local seafood — unforgettable!' },
      { dest: 'Munnar', rating: 5, review: 'Munnar is a green paradise! The sprawling tea gardens look like green velvet carpets draped over mountains. The cool, misty weather is so refreshing.' },
      { dest: 'Leh Ladakh', rating: 5, review: 'Ladakh is unlike anywhere else on Earth. Pangong Lake\'s blue waters against the barren mountains is surreal. The monasteries are deeply spiritual and the landscapes are dramatic.' },
      { dest: 'Andaman Islands', rating: 5, review: 'Andaman is paradise on earth! Radhanagar Beach is one of Asia\'s best. Snorkeling at Elephant Beach revealed a mesmerizing underwater world. Crystal-clear waters and white sand.' },
      { dest: 'Varanasi', rating: 4, review: 'Varanasi is a deeply spiritual and intense city. The Ganga Aarti at Dashashwamedh Ghat is absolutely mesmerizing. The city can be overwhelming but is absolutely worth experiencing.' },
      { dest: 'Amritsar - Golden Temple', rating: 5, review: 'The Golden Temple is one of the most serene and beautiful places I have ever visited. The free langar serving thousands of people daily is heartwarming. A must-visit for everyone.' },
      { dest: 'Udaipur - Lake City', rating: 5, review: 'Udaipur is the most romantic city in India. The boat ride on Pichola Lake with palace views at sunset is magical. The food, culture, and architecture are all world-class.' },
      { dest: 'Gulmarg', rating: 5, review: 'Skiing in Gulmarg was the highlight of my trip! The Gondola ride to the top offers breathtaking views. In summer the meadow is full of wildflowers — absolutely beautiful.' },
      { dest: 'Rishikesh', rating: 5, review: 'Rishikesh is the perfect mix of adventure and spirituality. White-water rafting on the Ganges was thrilling, and the evening Ganga Aarti at Triveni Ghat was deeply moving.' },
      { dest: 'Shimla', rating: 4, review: 'Shimla is charming with its colonial-era architecture and pine forests. The toy train ride from Kalka is an experience in itself. A great getaway from the plains in summer.' },
      { dest: 'Jodhpur - Blue City', rating: 5, review: 'Mehrangarh Fort is one of the most impressive forts in India. The blue city views from the fort are stunning. The local food — especially the famous Makhania Lassi — is amazing.' },
      { dest: 'Coorg', rating: 5, review: 'Coorg is India\'s coffee paradise. Waking up to misty mornings in a plantation stay, trekking to Abbey Falls, and visiting Namdroling Monastery made this trip unforgettable.' },
    ];

    let reviewCount = 0;
    for (const r of reviews) {
      const destId = getDestId(r.dest);
      if (destId) {
        await db.query(
          `INSERT INTO reviews (user_id, destination_id, rating, review) VALUES (?, ?, ?, ?)`,
          [userId, destId, r.rating, r.review]
        );
        reviewCount++;
      }
    }
    console.log(`✅ Seeded ${reviewCount} reviews\n`);

    // ── Step 7: Recalculate average ratings ──
    await db.query(`
      UPDATE destinations d
      SET rating = (SELECT ROUND(AVG(r.rating), 2) FROM reviews r WHERE r.destination_id = d.id)
      WHERE EXISTS (SELECT 1 FROM reviews r WHERE r.destination_id = d.id)
    `);
    console.log('✅ Average ratings recalculated\n');

    console.log('🎉 Expanded seed completed successfully!');
    console.log(`   📍 ${insertedDests.length} destinations | 🏨 ${hotelCount} hotels | ⭐ ${reviewCount} reviews`);

  } catch (err) {
    console.error('\n❌ Seed failed:', err.message);
    console.error(err.stack);
  } finally {
    process.exit(0);
  }
}

runSeed();
