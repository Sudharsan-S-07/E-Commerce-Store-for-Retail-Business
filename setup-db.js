require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2/promise');
const path = require('path');
async function setup() {
  try {
    console.log('Connecting to MySQL as user:', process.env.DB_USER || 'root');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('Importing schema.sql...');
    await connection.query(schemaSql);
    console.log('Database initialized successfully! All tables are ready.');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}
setup();
