require('dotenv').config();
const mysql = require('mysql2/promise');
async function check() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'retail_ecommerce'
    });
    const [tables] = await connection.query('SHOW TABLES');
    console.log('\nDATABASE CONNECTION: SUCCESS');
    console.log('\nTABLES VERIFIED:');
    tables.forEach(t => console.log('  - ' + Object.values(t)[0]));
    if (tables.length === 7) {
        console.log('  (All 7 required tables are present)');
    }
    const [[{ adminCount }]] = await connection.query('SELECT COUNT(*) as adminCount FROM admins');
    const [[{ catCount }]] = await connection.query('SELECT COUNT(*) as catCount FROM categories');
    console.log('\nSEED DATA VERIFIED:');
    console.log(`  - Default Admin Users: ${adminCount}`);
    console.log(`  - Default Categories: ${catCount}\n`);   
    await connection.end();
  } catch (err) {
    console.error('DATABASE ERROR:', err.message);
  }
}
check();
