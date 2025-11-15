// server/server.js - Application entry point

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const { connectDB } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
// Enable CORS for frontend communication
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://vercel-client-weld.vercel.app",
        "https://your-custom-domain.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Body parser middleware for JSON data
app.use(express.json()); 

// --- Database Connection ---
connectDB();

// --- API Routes ---
// Public routes for registration and login
app.use('/api/auth', authRoutes);
// Protected routes for posts
app.use('/api/posts', postRoutes);

// Simple root route check
app.get('/', (req, res) => {
    res.send('VibeLink Backend API is running!');
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
