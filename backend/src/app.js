const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');
require('dotenv').config();
const port = process.env.PORT || 5001;

const app = express();

// Enable JSON-formatted responses
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// CORS support
app.use(cors());

// Add routes
app.use('/api', routes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
