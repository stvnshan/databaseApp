const express = require('express');
const pool = require('./db'); // Import the database configuration file

const app = express();
const port = 3000; // You can change the port number if desired

// Route to fetch all data from a table
app.get('/users', async (req, res) => {
    console.log("E")
    try {
      const { rows } = await pool.query('SELECT * FROM users');
      res.json(rows);
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });