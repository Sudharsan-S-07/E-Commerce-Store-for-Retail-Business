require('dotenv').config();
const mysql = require('mysql2/promise');

const clothingFeatures = [
  "Stretchy & soft ribbed fabric hugs the body & shows off your physique",
  "Small logo on the hem = minimal branding for a clean & simple finish",
  "The added stretch means it keeps its shape even after you’ve worn it loads",
  "Versatile enough for the gym or as an everyday baselayer",
  "Moisture-wicking material keeps you dry during intense workouts",
  "Four-way stretch for ultimate comfort and mobility"
];

const techFeatures = [
  "Ultra-low latency for seamless connectivity and zero lag",
  "Aircraft-grade aluminum chassis for extreme durability",
  "Precision engineered for maximum performance",
  "Up to 24-hour battery life on a single charge",
  "Minimalist aesthetic fitting any modern workspace",
  "Advanced thermal cooling technology"
];

const generalFeatures = [
  "Crafted with meticulous attention to detail",
  "Designed for longevity, elegance, and uncompromised performance",
  "Built from sustainably sourced materials",
  "Pairs flawlessly with our accessories line",
  "Engineered to withstand daily wear and tear",
  "Limited edition run"
];

function getRandomItems(arr, count) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateSKU() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let sku = '';
  for(let i = 0; i < 5; i++) sku += chars.charAt(Math.floor(Math.random() * chars.length));
  sku += '-';
  for(let i = 0; i < 4; i++) sku += chars.charAt(Math.floor(Math.random() * chars.length));
  return sku;
}

async function inject() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'retail_ecommerce'
    });

    const [products] = await conn.query('SELECT id, category_id FROM products');
    
    for (const p of products) {
      // Pick features based on category (1=Tech, 2=Clothing, rest=General)
      let featureDb = generalFeatures;
      let sizeFit = "One size fits all.";
      let materials = "Premium crafted mixed materials. Built to last.";

      if (p.category_id === 2) { // Clothing
        featureDb = clothingFeatures;
        sizeFit = "Slim fit.\nModel is 5'10\" and wears size M.\nTrue to size.";
        materials = "90% Cotton, 5% Viscose, 5% Elastane\n170gsm\nWash cold with like colors.";
      } else if (p.category_id === 1) { // Electronics
        featureDb = techFeatures;
        sizeFit = "Ultra-compact profile.\nDimensions: 14in x 9in x 0.5in.";
        materials = "100% Anodized Aluminum chassis.\nGorilla Glass display.";
      } else if (p.category_id === 5) { // Sports/Gym
        featureDb = [...clothingFeatures, ...generalFeatures];
        sizeFit = "Athletic build tailored fit.\nModel is 6'1\" wearing size L.";
        materials = "85% Recycled Polyester, 15% Elastane\nBreathable mesh panels.\nMachine wash cold.";
      }

      const selectedFeatures = getRandomItems(featureDb, 4);
      const sku = generateSKU();

      await conn.query(
        'UPDATE products SET features = ?, size_fit = ?, materials = ?, sku = ? WHERE id = ?',
        [JSON.stringify(selectedFeatures), sizeFit, materials, sku, p.id]
      );
    }

    console.log(`Successfully injected Gymshark-style details into ${products.length} products!`);
    await conn.end();
  } catch (e) {
    console.error(e);
  }
}
inject();
