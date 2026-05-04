require('dotenv').config();
const mysql = require('mysql2/promise');

const products = [
  // CATEGORY 1: ELECTRONICS
  { cid: 1, name: "Aria Pro Wireless Headphones", price: 24999, old: 29999, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", desc: "Studio-quality over-ear noise cancelling headphones." },
  { cid: 1, name: "Omni 4K Ultra-Slim Laptop", price: 145000, old: 160000, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80", desc: "Premium aluminum body with a stunning 4K retina display." },
  { cid: 1, name: "Luna Smartwatch Series X", price: 34999, old: 39999, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80", desc: "Digital chronometer with advanced health tracking and obsidian finish." },
  { cid: 1, name: "Aura Mechanical Keyboard", price: 12500, old: null, img: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80", desc: "Tactile low-profile switches on an anodized aluminum deck." },
  { cid: 1, name: "Vanguard Mirrorless Camera", price: 215000, old: 225000, img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80", desc: "Cinematic full-frame sensor for professional photography." },
  { cid: 1, name: "Nova Portable Speaker", price: 8999, old: 11999, img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80", desc: "Minimalist waterproof bluetooth speaker with 360 audio." },
  { cid: 1, name: "Ergo Elite Wireless Mouse", price: 7499, old: null, img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80", desc: "Precision ergonomic tracking for professionals." },
  { cid: 1, name: "Resonance Turntable", price: 45000, old: null, img: "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=800&q=80", desc: "High-fidelity analog audio player with premium wood finish." },
  { cid: 1, name: "Zenith Noise Cancelling Earbuds", price: 18999, old: 21999, img: "https://images.unsplash.com/photo-1572569438065-e3b97ba11016?w=800&q=80", desc: "True wireless earbuds with adaptive transparency mode." },
  { cid: 1, name: "Iris Smart Home Hub", price: 14999, old: null, img: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=800&q=80", desc: "Beautiful glass-front control panel for your entire home." },

  // CATEGORY 2: CLOTHING
  { cid: 2, name: "Monolith Cashmere Coat", price: 28500, old: 35000, img: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&q=80", desc: "Luxurious tailoring offering unmatched warmth." },
  { cid: 2, name: "Essential Oxford Shirt", price: 4500, old: null, img: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=800&q=80", desc: "Crisp, tailored fit perfect for business casual." },
  { cid: 2, name: "Midnight Silk Dress", price: 18999, old: null, img: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80", desc: "An elegant evening dress made from pure mulberry silk." },
  { cid: 2, name: "Urban Minimalist Sneakers", price: 12999, old: 15999, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", desc: "Full-grain leather sneakers for every occasion." },
  { cid: 2, name: "Artisan Leather Jacket", price: 42000, old: null, img: "https://images.unsplash.com/photo-1520975954732-57dd22299614?w=800&q=80", desc: "Handcrafted from top-tier Italian leather." },
  { cid: 2, name: "Classic Chino Trousers", price: 5500, old: 6500, img: "https://images.unsplash.com/photo-1624378439575-d10cabcca10d?w=800&q=80", desc: "Timeless versatile trousers in desert sand." },
  { cid: 2, name: "Cashmere Turtleneck", price: 15500, old: null, img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80", desc: "Sleek and warm, perfectly layered under a blazer." },
  { cid: 2, name: "Bespoke Wool Suit", price: 65000, old: 75000, img: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80", desc: "Tailored fit two-piece suit in dark charcoal." },
  { cid: 2, name: "Premium Denim Jeans", price: 8999, old: null, img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80", desc: "Japanese selvedge denim for lifelong durability." },
  { cid: 2, name: "Oculus Designer Sunglasses", price: 21000, old: 24000, img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80", desc: "Polarized lenses with tortoiseshell frames." },

  // CATEGORY 3: HOME & KITCHEN
  { cid: 3, name: "Artisan Ceramic Pour-over", price: 4500, old: null, img: "https://images.unsplash.com/photo-1544015759-caaa64a2e4da?w=800&q=80", desc: "Minimalist ceramic coffee maker." },
  { cid: 3, name: "Aria Smart Espresso Machine", price: 85000, old: 95000, img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80", desc: "Café quality espresso at the touch of a button." },
  { cid: 3, name: "Nordic Lounge Chair", price: 45000, old: null, img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80", desc: "Ergonomic living room centerpiece." },
  { cid: 3, name: "Obsidian Chef's Knife", price: 12000, old: 15000, img: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80", desc: "Damascus steel masterpiece for precise cutting." },
  { cid: 3, name: "Terra Cotta Planter Set", price: 3500, old: null, img: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80", desc: "Elevate your indoor botanicals." },
  { cid: 3, name: "Lumina Pendant Light", price: 18500, old: 22000, img: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80", desc: "Brushed brass geometric hanging light." },
  { cid: 3, name: "Aura Diffuser", price: 5500, old: null, img: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=800&q=80", desc: "Ultrasonic stone essential oil diffuser." },
  { cid: 3, name: "Estate Cast Iron Skillet", price: 8500, old: 10500, img: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80", desc: "Pre-seasoned lifetime guarantee cookware." },
  { cid: 3, name: "Velvet Throw Pillow", price: 2999, old: null, img: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=800&q=80", desc: "Luxurious texture for any modern sofa." },
  { cid: 3, name: "Botanica Scented Candle", price: 4200, old: null, img: "https://images.unsplash.com/photo-1603006905202-7fb8fde29202?w=800&q=80", desc: "Hand-poured soy wax with notes of sandalwood." },

  // CATEGORY 4: BOOKS
  { cid: 4, name: "The Minimalist Home", price: 1500, old: null, img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80", desc: "Premium hardcover architecture book." },
  { cid: 4, name: "Design Patterns", price: 2400, old: 3000, img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80", desc: "The definitive guide to software architecture." },
  { cid: 4, name: "Atlas of the World", price: 8500, old: null, img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80", desc: "Massive leather-bound volume of global cartography." },
  { cid: 4, name: "Culinary Masterpieces", price: 3200, old: 4500, img: "https://images.unsplash.com/photo-1589311910793-ec14e38e6840?w=800&q=80", desc: "Michelin-star recipes in a visually stunning format." },
  { cid: 4, name: "Modern Art Journal", price: 1900, old: null, img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80", desc: "A blank journal with heavy-weight archival paper." },
  { cid: 4, name: "The Wealth of Nations", price: 1800, old: null, img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80", desc: "Classic economic text, special collector's edition." },
  { cid: 4, name: "Astro-Photography Guide", price: 2900, old: 3500, img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80", desc: "Capturing the cosmos, step by step." },
  { cid: 4, name: "Philosophy of Design", price: 2100, old: null, img: "https://images.unsplash.com/photo-1511108690759-009324a5033d?w=800&q=80", desc: "Deep dive into what makes objects beautiful." },
  { cid: 4, name: "The Collector's Cookbook", price: 4800, old: 5500, img: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=800&q=80", desc: "Rare recipes from history perfectly photographed." },
  { cid: 4, name: "Fashion Chronicles", price: 3600, old: null, img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80", desc: "A century of high-end fashion history." },

  // CATEGORY 5: SPORTS
  { cid: 5, name: "Aero Carbon Road Bike", price: 250000, old: 280000, img: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=80", desc: "Ultralight carbon fiber frame for peak performance." },
  { cid: 5, name: "Pro Yoga Mat", price: 3500, old: null, img: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80", desc: "Extra thick, eco-friendly cork alignment mat." },
  { cid: 5, name: "Elite Dumbbell Set", price: 18500, old: 22000, img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80", desc: "Adjustable weights with sleek steel grip mechanism." },
  { cid: 5, name: "Velocity Running Shoes", price: 14999, old: 16999, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", desc: "Next-gen foam cushioning for marathon runners. (Runner edition)" },
  { cid: 5, name: "Titanium Tennis Racket", price: 22000, old: null, img: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80", desc: "Professional grade balance and tension." },
  { cid: 5, name: "Alpine Snowboard", price: 45000, old: 52000, img: "https://images.unsplash.com/photo-1563606041-e9ecb5bcfead?w=800&q=80", desc: "Carve the mountain with carbon core precision." },
  { cid: 5, name: "Hydra Stainless Bottle", price: 2500, old: null, img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80", desc: "Minimalist insulated flask keeps ice for 24h." },
  { cid: 5, name: "Apex Golf Clubs Set", price: 120000, old: 135000, img: "https://images.unsplash.com/photo-1535139262971-c51845709a48?w=800&q=80", desc: "Forged irons providing unmatched tour accuracy." },
  { cid: 5, name: "Reflex Boxing Gloves", price: 8500, old: null, img: "https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=800&q=80", desc: "Genuine leather lace-up gloves for heavy bag work." },
  { cid: 5, name: "Altitude Smart Rope", price: 4200, old: 5000, img: "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=800&q=80", desc: "Bluetooth connected jump rope tracks via an app." }
];

async function seed() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'retail_ecommerce'
    });

    // Clear old products first so it's perfectly clean
    await conn.query('DELETE FROM products');

    console.log('Inserting premium products...');
    let count = 0;
    
    for (const p of products) {
      // randomly make first 2 of each category featured
      const isFeatured = (count % 10 < 2);
      // Give random realistic ratings above 4.0
      const rating = (Math.random() * (5.0 - 4.2) + 4.2).toFixed(1);
      const reviews = Math.floor(Math.random() * 500) + 20;

      await conn.query(
        'INSERT INTO products (category_id, name, price, original_price, image_url, description, is_featured, rating, review_count, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [p.cid, p.name, p.price, p.old, p.img, p.desc, isFeatured, rating, reviews, 100]
      );
      count++;
    }
    
    console.log(`Success! Inserted ${count} high-end products into your store.`);
    await conn.end();
  } catch(e) {
    console.error('Error seeding data:', e);
  }
}
seed();
