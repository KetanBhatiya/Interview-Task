require('dotenv').config();
const express = require('express');
const { initializeDatabase } = require('../index');
const app = express();

// Initialize database connection
initializeDatabase();

// Express middleware and routes setup
app.use(express.json());

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 