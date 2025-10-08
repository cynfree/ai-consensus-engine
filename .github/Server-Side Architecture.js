// server.js - Basic Express setup
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const geminiRoutes = require('./routes/gemini');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/gemini', geminiRoutes);

// Serve static files
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
