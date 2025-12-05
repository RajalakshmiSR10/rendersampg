import express from 'express';
import dotenv from 'dotenv';

import cors from 'cors';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: "*",                 
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization"
}));

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Welcome users');
});

app.get('/dbtest', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pusers');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server  Error', error: err.message });
  }
});


app.post('/user-insert', async (req, res) => {
  console.log('Request body:', req.body); 
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const result = await pool.query(
      'INSERT INTO pusers (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Insert error:', err); 
    res.status(500).json({ message: "Can't insert user", error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});
