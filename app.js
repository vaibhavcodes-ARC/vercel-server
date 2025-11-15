const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/db');

// Load environment variables from .env file
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
// Allow requests from the client dev server (Vite) or a configured CLIENT_URL
const clientUrl = process.env.CLIENT_URL || 'https://vercel-server-0zyy.onrender.com';
app.use(cors({ origin: clientUrl }));
app.use(express.json());

// --- Database Connection ---
connectDB();

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/profile', profileRoutes);

// Simple root route check
app.get('/', (req, res) => {
    res.send('VibeLink Backend API is running!');
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
