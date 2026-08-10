const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const outDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const pages = [
  { name: '01_home_page',            url: 'http://localhost:3000/',                                                              waitMs: 5000 },
  { name: '02_login_page',           url: 'http://localhost:3000/login',                                                        waitMs: 3000 },
  { name: '03_register_page',        url: 'http://localhost:3000/register',                                                     waitMs: 3000 },
  { name: '04_destinations_listing', url: 'http://localhost:3000/destinations',                                                  waitMs: 5000 },
  { name: '05_destination_details',  url: 'http://localhost:3000/destinations/1',                                               waitMs: 5000 },
  { name: '06_hotels_section',       url: 'http://localhost:3000/destinations/1',                                               waitMs: 5000, scrollY: 900 },
  { name: '07_reviews_section',      url: 'http://localhost:3000/destinations/1',                                               waitMs: 5000, scrollY: 1800 },
  { name: '08_search_filter',        url: 'http://localhost:3000/destinations',                                                  waitMs: 5000 },
  { name: '09_api_destinations',     url: 'http://localhost:5000/api/destinations?page=1&limit=5',                              waitMs: 2000 },
  { name: '10_api_hotels',           url: 'http://localhost:5000/api/hotels/destination/1',                                     waitMs: 2000 },
  { name: '11_api_reviews',          url: 'http://localhost:5000/api/reviews/destination/1',                                    waitMs: 2000 },
  { name: '12_api_categories',       url: 'http://localhost:5000/api/categories',                                               waitMs: 2000 },
  { name: '13_phpmyadmin_tables',    url: 'http://localhost/phpmyadmin/index.php?route=/database/structure&db=travel_advisor_db', waitMs: 4000 },
];

(async () => {
  console.log('🚀 Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  for (const pg of pages) {
    try {
      console.log(`📸 Capturing: ${pg.name}`);
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });

      // Use 'domcontentloaded' for React SPA, plain 'load' for API/phpMyAdmin
      const waitUntil = pg.url.includes('localhost:3000') ? 'domcontentloaded' : 'load';
      await page.goto(pg.url, { waitUntil, timeout: 30000 });

      // Extra wait for JS to render
      await new Promise(r => setTimeout(r, pg.waitMs || 3000));

      if (pg.scrollY) {
        await page.evaluate((y) => window.scrollTo(0, y), pg.scrollY);
        await new Promise(r => setTimeout(r, 1500));
      }

      const file = path.join(outDir, pg.name + '.png');
      await page.screenshot({ path: file, fullPage: !pg.scrollY });
      console.log(`  ✅ Saved: ${pg.name}.png`);
      await page.close();
    } catch (err) {
      console.error(`  ❌ Failed: ${pg.name} — ${err.message}`);
    }
  }

  await browser.close();
  console.log(`\n🎉 Done! All screenshots in: ${outDir}`);
})();
