require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function checkAndFixAdmin() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'retail_ecommerce'
    });

    const [admins] = await conn.query('SELECT * FROM admins WHERE email = "admin@retailstore.com"');
    if (admins.length > 0) {
      const admin = admins[0];
      const isValid = await bcrypt.compare('Admin@123', admin.password);
      if (!isValid) {
        console.log('Password hash may be invalid. Resetting to Admin@123...');
        const newHash = await bcrypt.hash('Admin@123', 10);
        await conn.query('UPDATE admins SET password = ? WHERE email = ?', [newHash, 'admin@retailstore.com']);
        console.log('Reset complete.');
      } else {
        console.log('Admin password is correct and functioning.');
      }
    } else {
      console.log('Admin not found!');
    }
    await conn.end();
  } catch (err) {
    console.error(err);
  }
}
checkAndFixAdmin();
