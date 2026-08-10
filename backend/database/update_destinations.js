/**
 * TravelAdvisor Database Migration & Seeding Update
 * Aligns columns, updates categories, seeds 26 rich unique destinations,
 * seeds appropriate hotels and reviews with valid relationships.
 */

const db = require('../config/db');

async function runUpdate() {
  console.log('🚀 Starting TravelAdvisor Destination Expansion & Image Update...\n');

  try {
    // 1. Alter destinations table to add best_time_to_visit if not exists
    console.log('📋 Step 1: Checking for best_time_to_visit column...');
    const [cols] = await db.query("SHOW COLUMNS FROM destinations LIKE 'best_time_to_visit'");
    if (cols.length === 0) {
      await db.query("ALTER TABLE destinations ADD COLUMN `best_time_to_visit` VARCHAR(100) NULL AFTER `budget`");
      console.log('   ✅ Added best_time_to_visit column to destinations table');
    } else {
      console.log('   ✅ best_time_to_visit column already exists');
    }

    // 2. Clear old data (cascade rules will delete reviews and hotels)
    console.log('\n📋 Step 2: Cleaning up existing tables...');
    await db.query("SET FOREIGN_KEY_CHECKS = 0");
    await db.query("TRUNCATE TABLE reviews");
    await db.query("TRUNCATE TABLE hotels");
    await db.query("TRUNCATE TABLE destinations");
    await db.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log('   ✅ Cleared old destinations, hotels, and reviews');

    // 3. Define the destinations list
    console.log('\n📋 Step 3: Seeding 26 new unique destinations...');
    const destinations = [
      {
        category_id: 1, // Beach
        name: 'Goa Beaches',
        state: 'Goa',
        city: 'Panaji',
        description: 'Famous for its golden beaches, vibrant nightlife, water sports, and historic Portuguese-era churches, Goa is India\'s ultimate tropical beach getaway.',
        image: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=800&q=80',
        budget: 3500.00,
        best_time_to_visit: 'November to February',
        rating: 4.5
      },
      {
        category_id: 2, // Hill Station
        name: 'Manali',
        state: 'Himachal Pradesh',
        city: 'Manali',
        description: 'A gorgeous Himalayan valley town offering adventure sports like paragliding, beautiful apple orchards, hot springs, and snow-clad mountain peaks near Rohtang Pass.',
        image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
        budget: 4000.00,
        best_time_to_visit: 'October to June',
        rating: 4.7
      },
      {
        category_id: 3, // Heritage
        name: 'Jaipur - Pink City',
        state: 'Rajasthan',
        city: 'Jaipur',
        description: 'The capital of Rajasthan, famous for its grand historical architecture including the Hawa Mahal, Amber Fort, and City Palace, reflecting India\'s royal heritage.',
        image: 'https://images.unsplash.com/photo-1477587458883-471a5ed94245?auto=format&fit=crop&w=800&q=80',
        budget: 2500.00,
        best_time_to_visit: 'October to March',
        rating: 4.6
      },
      {
        category_id: 4, // Wildlife
        name: 'Jim Corbett National Park',
        state: 'Uttarakhand',
        city: 'Ramnagar',
        description: 'India\'s oldest national park in the foothills of the Himalayas, renowned for its rich diversity of flora and fauna, especially the endangered Bengal Tigers.',
        image: 'https://images.unsplash.com/photo-1615959189197-484c0fc98817?auto=format&fit=crop&w=800&q=80',
        budget: 5000.00,
        best_time_to_visit: 'November to May',
        rating: 4.4
      },
      {
        category_id: 5, // Pilgrimage
        name: 'Varanasi',
        state: 'Uttar Pradesh',
        city: 'Varanasi',
        description: 'One of the oldest continuously inhabited cities in the world, Varanasi is the spiritual heart of India, famous for its sacred Ganga river ghats and temples.',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=800&q=80',
        budget: 2000.00,
        best_time_to_visit: 'October to March',
        rating: 4.8
      },
      {
        category_id: 1, // Beach
        name: 'Andaman Islands',
        state: 'Andaman & Nicobar',
        city: 'Port Blair',
        description: 'A pristine group of tropical islands in the Bay of Bengal, featuring crystal-clear waters, lush forests, and the world-famous white sands of Radhanagar Beach.',
        image: 'https://images.unsplash.com/photo-1589979482837-e74f2e145060?auto=format&fit=crop&w=800&q=80',
        budget: 6000.00,
        best_time_to_visit: 'October to May',
        rating: 4.9
      },
      {
        category_id: 2, // Hill Station
        name: 'Darjeeling',
        state: 'West Bengal',
        city: 'Darjeeling',
        description: 'Known as the "Queen of Hills," Darjeeling is famed for its vast tea estates, panoramic views of Mt. Kanchenjunga, and the historic Darjeeling Himalayan Toy Train.',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
        budget: 3000.00,
        best_time_to_visit: 'April to June, October to December',
        rating: 4.6
      },
      {
        category_id: 3, // Heritage
        name: 'Agra - Taj Mahal',
        state: 'Uttar Pradesh',
        city: 'Agra',
        description: 'Home to the legendary Taj Mahal, Agra is an ancient Mughal capital showcasing timeless architecture, including the grand Agra Fort and Fatehpur Sikri.',
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
        budget: 3000.00,
        best_time_to_visit: 'October to March',
        rating: 4.9
      },
      {
        category_id: 1, // Beach
        name: 'Kerala Backwaters',
        state: 'Kerala',
        city: 'Alleppey',
        description: 'An idyllic labyrinth of lakes, canals, and lagoons fringed by coconut trees. A stay on a traditional luxury houseboat offers unmatched serenity.',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
        budget: 4500.00,
        best_time_to_visit: 'September to March',
        rating: 4.7
      },
      {
        category_id: 4, // Wildlife
        name: 'Ranthambore National Park',
        state: 'Rajasthan',
        city: 'Sawai Madhopur',
        description: 'One of Northern India\'s largest national parks, combining a historical 10th-century fort with a thriving sanctuary for Royal Bengal Tigers.',
        image: 'https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&w=800&q=80',
        budget: 5500.00,
        best_time_to_visit: 'October to June',
        rating: 4.5
      },
      {
        category_id: 2, // Hill Station
        name: 'Munnar',
        state: 'Kerala',
        city: 'Munnar',
        description: 'A breathtaking hill resort nestled in Kerala\'s Western Ghats, famous for its rolling hills covered in lush green tea plantations and mist-filled valleys.',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
        budget: 3200.00,
        best_time_to_visit: 'September to May',
        rating: 4.8
      },
      {
        category_id: 2, // Hill Station
        name: 'Ooty',
        state: 'Tamil Nadu',
        city: 'Ooty',
        description: 'Popularly known as the "Queen of Hill Stations," Ooty features beautiful botanical gardens, serene lakes, tea gardens, and colonial-era architecture.',
        image: 'https://images.unsplash.com/photo-1626509657820-22d7d8122d10?auto=format&fit=crop&w=800&q=80',
        budget: 3000.00,
        best_time_to_visit: 'October to June',
        rating: 4.5
      },
      {
        category_id: 5, // Pilgrimage
        name: 'Amritsar - Golden Temple',
        state: 'Punjab',
        city: 'Amritsar',
        description: 'Home to the magnificent Harmandir Sahib (Golden Temple), the spiritual hub of Sikhism, offering unparalleled peace, architecture, and a huge community kitchen.',
        image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80',
        budget: 2200.00,
        best_time_to_visit: 'October to March',
        rating: 4.9
      },
      {
        category_id: 3, // Heritage
        name: 'Hampi Ruins',
        state: 'Karnataka',
        city: 'Hampi',
        description: 'A UNESCO World Heritage Site featuring the sprawling ruins of the historic Vijayanagara Empire, set in a unique boulder-strewn landscape.',
        image: 'https://images.unsplash.com/photo-1600100397608-f010e42ecfcf?auto=format&fit=crop&w=800&q=80',
        budget: 2400.00,
        best_time_to_visit: 'October to February',
        rating: 4.7
      },
      {
        category_id: 3, // Heritage
        name: 'Udaipur - Lake City',
        state: 'Rajasthan',
        city: 'Udaipur',
        description: 'Known as the "Venice of the East," Udaipur is famed for its romantic Lake Pichola, stunning marble palaces, and scenic hills.',
        image: 'https://images.unsplash.com/photo-1595875709518-c8d17961b6c0?auto=format&fit=crop&w=800&q=80',
        budget: 3500.00,
        best_time_to_visit: 'September to March',
        rating: 4.8
      },
      {
        category_id: 3, // Heritage
        name: 'Jaisalmer Desert',
        state: 'Rajasthan',
        city: 'Jaisalmer',
        description: 'The Golden City of Rajasthan, known for its majestic sandstone fort rising from the Thar Desert and the dramatic Sam Sand Dunes.',
        image: 'https://images.unsplash.com/photo-1609137144813-2efdf67ca083?auto=format&fit=crop&w=800&q=80',
        budget: 2800.00,
        best_time_to_visit: 'October to March',
        rating: 4.6
      },
      {
        category_id: 2, // Hill Station
        name: 'Gulmarg',
        state: 'Jammu & Kashmir',
        city: 'Gulmarg',
        description: 'A premier ski resort in winter and a meadow of flowers in summer, Gulmarg has the world\'s highest operating cable car (Gondola) and stunning views.',
        image: 'https://images.unsplash.com/photo-1566837497312-7be47464c76f?auto=format&fit=crop&w=800&q=80',
        budget: 5500.00,
        best_time_to_visit: 'December to March (Snow), March to June',
        rating: 4.9
      },
      {
        category_id: 2, // Hill Station
        name: 'Leh Ladakh',
        state: 'Ladakh',
        city: 'Leh',
        description: 'A high-altitude desert region with dramatic mountain passes, deep valleys, stunning Buddhist monasteries, and the deep blue Pangong Lake.',
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
        budget: 6500.00,
        best_time_to_visit: 'May to September',
        rating: 4.9
      },
      {
        category_id: 4, // Wildlife
        name: 'Kaziranga National Park',
        state: 'Assam',
        city: 'Kohora',
        description: 'A UNESCO World Heritage Site housing two-thirds of the world\'s population of great Indian One-Horned Rhinoceroses in swampy grasslands.',
        image: 'https://images.unsplash.com/photo-1602491453979-02654b3ee3d0?auto=format&fit=crop&w=800&q=80',
        budget: 4800.00,
        best_time_to_visit: 'November to April',
        rating: 4.7
      },
      {
        category_id: 5, // Pilgrimage
        name: 'Madurai - Meenakshi Temple',
        state: 'Tamil Nadu',
        city: 'Madurai',
        description: 'An ancient temple city centering around the colossal Meenakshi Amman Temple, featuring towering gopurams adorned with thousands of colorful sculptures.',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
        budget: 2100.00,
        best_time_to_visit: 'October to March',
        rating: 4.8
      },
      {
        category_id: 5, // Pilgrimage
        name: 'Rishikesh',
        state: 'Uttarakhand',
        city: 'Rishikesh',
        description: 'The Yoga Capital of the World, situated on the Ganges. It is a dual destination for spiritual seekers and adventure enthusiasts looking for white-water rafting.',
        image: 'https://images.unsplash.com/photo-1598977123418-45f04b01d40a?auto=format&fit=crop&w=800&q=80',
        budget: 2500.00,
        best_time_to_visit: 'September to November, March to May',
        rating: 4.7
      },
      {
        category_id: 1, // Beach
        name: 'Varkala Beach',
        state: 'Kerala',
        city: 'Varkala',
        description: 'A beautiful beach town in Kerala, unique for its red cliffs bordering the Arabian Sea, natural springs, and a relaxed, bohemian vibe.',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
        budget: 2800.00,
        best_time_to_visit: 'October to March',
        rating: 4.6
      },
      {
        category_id: 1, // Beach
        name: 'Kovalam Beach',
        state: 'Kerala',
        city: 'Kovalam',
        description: 'One of India\'s oldest and most popular beach resorts, famous for its iconic striped lighthouse, calm waters, and Ayurvedic massage centers.',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
        budget: 3200.00,
        best_time_to_visit: 'September to March',
        rating: 4.5
      },
      {
        category_id: 3, // Heritage
        name: 'Mysore Palace',
        state: 'Karnataka',
        city: 'Mysore',
        description: 'A spectacular historical palace, the seat of the Kingdom of Mysore, famous for its Indo-Saracenic architecture and its weekly illumination of 97,000 bulbs.',
        image: 'https://images.unsplash.com/photo-1600100397990-24b354efb585?auto=format&fit=crop&w=800&q=80',
        budget: 2300.00,
        best_time_to_visit: 'October to March',
        rating: 4.7
      },
      {
        category_id: 4, // Wildlife
        name: 'Gir Forest National Park',
        state: 'Gujarat',
        city: 'Junagadh',
        description: 'The sole remaining sanctuary of the majestic Asiatic Lions, Gir features dry deciduous scrub forests and a thriving ecosystem of leopards, deer, and crocodiles.',
        image: 'https://images.unsplash.com/photo-1601987177651-8edfe6c20009?auto=format&fit=crop&w=800&q=80',
        budget: 4200.00,
        best_time_to_visit: 'December to March',
        rating: 4.6
      },
      {
        category_id: 5, // Pilgrimage
        name: 'Kedarnath Temple',
        state: 'Uttarakhand',
        city: 'Kedarnath',
        description: 'A holy Hindu temple dedicated to Lord Shiva, located in the Garhwal Himalayan range near Mandakini river. Accessible only by trek or helicopter.',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
        budget: 4000.00,
        best_time_to_visit: 'May to June, September to October',
        rating: 4.9
      }
    ];

    const insertedDests = [];
    for (const d of destinations) {
      const sql = `
        INSERT INTO destinations (category_id, name, state, city, description, image, budget, best_time_to_visit, rating)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [res] = await db.query(sql, [d.category_id, d.name, d.state, d.city, d.description, d.image, d.budget, d.best_time_to_visit, d.rating]);
      insertedDests.push({ id: res.insertId, name: d.name });
    }
    console.log(`   ✅ Seeded ${insertedDests.length} destinations successfully`);

    // 4. Seeding hotels with actual matching IDs
    console.log('\n📋 Step 4: Seeding hotels linked to new destinations...');
    
    // Help helper function to find destination ID
    const getDestId = (name) => {
      const found = insertedDests.find(d => d.name === name);
      return found ? found.id : null;
    };

    const hotels = [
      // Goa
      {
        destination_id: getDestId('Goa Beaches'),
        hotel_name: 'Taj Exotica Resort & Spa',
        location: 'Benaulim Beach, South Goa',
        price_per_night: 18000.00,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
      },
      {
        destination_id: getDestId('Goa Beaches'),
        hotel_name: 'The Leela Goa',
        location: 'Cavelossim, South Goa',
        price_per_night: 15000.00,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
      },
      {
        destination_id: getDestId('Goa Beaches'),
        hotel_name: 'Anjuna Beach Hostel (Zostel)',
        location: 'Anjuna, North Goa',
        price_per_night: 1200.00,
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'
      },
      // Manali
      {
        destination_id: getDestId('Manali'),
        hotel_name: 'Span Resort & Spa',
        location: 'Kullu-Manali Highway, Manali',
        price_per_night: 9000.00,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
      },
      {
        destination_id: getDestId('Manali'),
        hotel_name: 'The Himalayan',
        location: 'Hadimba Road, Manali',
        price_per_night: 7500.00,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
      },
      // Jaipur
      {
        destination_id: getDestId('Jaipur - Pink City'),
        hotel_name: 'Rambagh Palace',
        location: 'Bhawani Singh Road, Jaipur',
        price_per_night: 22000.00,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
      },
      {
        destination_id: getDestId('Jaipur - Pink City'),
        hotel_name: 'ITC Rajputana',
        location: 'Palace Road, Jaipur',
        price_per_night: 11000.00,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
      },
      // Udaipur
      {
        destination_id: getDestId('Udaipur - Lake City'),
        hotel_name: 'The Taj Lake Palace',
        location: 'Pichola Lake, Udaipur',
        price_per_night: 26000.00,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80'
      },
      {
        destination_id: getDestId('Udaipur - Lake City'),
        hotel_name: 'Brij Rama Palace',
        location: 'Darbhanga Ghat, Udaipur',
        price_per_night: 8500.00,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'
      },
      // Agra
      {
        destination_id: getDestId('Agra - Taj Mahal'),
        hotel_name: 'The Oberoi Amarvilas',
        location: 'Taj East Gate, Agra',
        price_per_night: 45000.00,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'
      },
      {
        destination_id: getDestId('Agra - Taj Mahal'),
        hotel_name: 'ITC Mughal Agra',
        location: 'Fatehabad Road, Agra',
        price_per_night: 13000.00,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80'
      },
      // Munnar
      {
        destination_id: getDestId('Munnar'),
        hotel_name: 'Fragrant Nature Munnar',
        location: 'Bison Valley Road, Munnar',
        price_per_night: 9500.00,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80'
      },
      // Leh Ladakh
      {
        destination_id: getDestId('Leh Ladakh'),
        hotel_name: 'The Grand Dragon Ladakh',
        location: 'Old Road, Leh',
        price_per_night: 12000.00,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
      },
      // Rishikesh
      {
        destination_id: getDestId('Rishikesh'),
        hotel_name: 'Aloha On The Ganges',
        location: 'Tapovan, Rishikesh',
        price_per_night: 8000.00,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1611048267451-e6ed903d4a38?auto=format&fit=crop&w=800&q=80'
      }
    ];

    let hotelCount = 0;
    for (const h of hotels) {
      if (h.destination_id) {
        const sql = `
          INSERT INTO hotels (destination_id, hotel_name, location, price_per_night, rating, image)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        await db.query(sql, [h.destination_id, h.hotel_name, h.location, h.price_per_night, h.rating, h.image]);
        hotelCount++;
      }
    }
    console.log(`   ✅ Seeded ${hotelCount} hotels successfully`);

    // 5. Seeding reviews linked to Priya Sharma (user_id = 2) or first regular user in DB
    console.log('\n📋 Step 5: Seeding initial reviews...');
    const [users] = await db.query("SELECT id FROM users WHERE role = 'user' LIMIT 1");
    const userId = users.length > 0 ? users[0].id : 1; // Fallback to id 1 if user doesn't exist

    const reviews = [
      {
        destination_name: 'Goa Beaches',
        rating: 5,
        review: 'Goa is absolutely magical! The beaches at Palolem and Benaulim are beautiful, and the Portuguese architecture in Panaji is rich in history. A perfect blend of relaxation and culture!'
      },
      {
        destination_name: 'Manali',
        rating: 5,
        review: 'Manali exceeded all my expectations! The Solang Valley paragliding was thrilling, and the view of the snow-capped Himalayan peaks was breathtaking. A must-visit hill station.'
      },
      {
        destination_name: 'Jaipur - Pink City',
        rating: 4,
        review: 'Jaipur has a royal charm. Visiting the Amber Fort and Hawa Mahal felt like stepping back in time. The local food is delicious, but it can get very crowded in peak winter.'
      },
      {
        destination_name: 'Agra - Taj Mahal',
        rating: 5,
        review: 'Seeing the Taj Mahal at sunrise was a spiritual experience. The marble glowing in the morning light is something I will never forget. Truly one of the wonders of the world.'
      },
      {
        destination_name: 'Kerala Backwaters',
        rating: 5,
        review: 'The backwaters houseboat cruise in Alleppey is so peaceful. Watching the villages and coconut trees glide by while eating fresh local seafood is unforgettable.'
      },
      {
        destination_name: 'Munnar',
        rating: 5,
        review: 'Munnar is a green paradise! The sprawling tea gardens look like green carpets draped over the mountains. The weather is cool and refreshing.'
      }
    ];

    let reviewCount = 0;
    for (const r of reviews) {
      const destId = getDestId(r.destination_name);
      if (destId) {
        const sql = `
          INSERT INTO reviews (user_id, destination_id, rating, review)
          VALUES (?, ?, ?, ?)
        `;
        await db.query(sql, [userId, destId, r.rating, r.review]);
        reviewCount++;
      }
    }
    console.log(`   ✅ Seeded ${reviewCount} reviews successfully`);

    // 6. Recalculate average ratings
    console.log('\n📋 Step 6: Recalculating ratings from reviews...');
    await db.query(`
      UPDATE destinations d
      SET rating = (
        SELECT ROUND(AVG(r.rating), 2)
        FROM reviews r
        WHERE r.destination_id = d.id
      )
      WHERE EXISTS (SELECT 1 FROM reviews r WHERE r.destination_id = d.id);
    `);
    console.log('   ✅ Average ratings updated');

    console.log('\n🎉 Database destination expansion and update completed successfully!');

  } catch (err) {
    console.error('\n❌ Update failed:', err.message);
    console.error(err.stack);
  } finally {
    process.exit(0);
  }
}

runUpdate();
