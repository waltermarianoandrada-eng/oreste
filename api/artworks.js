const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = async function handler(req, res) {
  // CORS Headers for Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const { rows } = await pool.query('SELECT * FROM artworks ORDER BY added_at DESC');
      res.status(200).json(rows);
    } 
    else if (req.method === 'POST') {
      const art = req.body;
      const added_at = art.added_at || Date.now();
      
      await pool.query(`
        INSERT INTO artworks (id, title, year, category, medium, size, author, tribute, date, origin, description, image, added_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, [
        art.id, art.title, art.year, art.category, art.medium, art.size, 
        art.author, art.tribute, art.date, art.origin, art.description, art.image, added_at
      ]);
      
      res.status(201).json({ message: 'Artwork added successfully' });
    }
    else if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing id parameter' });

      await pool.query('DELETE FROM artworks WHERE id = $1', [id]);
      res.status(200).json({ message: 'Artwork deleted successfully' });
    }
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
