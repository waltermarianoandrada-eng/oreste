const pg = require('pg');
require('dotenv').config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDB() {
  try {
    console.log('Connecting to database...');
    // Create the artworks table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS artworks (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        year INTEGER,
        category VARCHAR(100),
        medium VARCHAR(255),
        size VARCHAR(255),
        author VARCHAR(255),
        tribute VARCHAR(255),
        date VARCHAR(255),
        origin VARCHAR(255),
        description TEXT,
        image TEXT,
        added_at BIGINT
      );
    `);
    console.log('Table "artworks" created or already exists.');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    await pool.end();
  }
}

initDB();
