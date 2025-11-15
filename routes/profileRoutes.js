// server/routes/profileRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getMyProfile, updateMyProfile, getPublicProfile } = require('../controllers/profileController');

// GET /api/profile/      - current user's profile (protected)
router.get('/', protect, getMyProfile);

// PUT /api/profile/      - update current user's profile (protected)
router.put('/', protect, updateMyProfile);

// GET /api/profile/:username - public profile by username
router.get('/:username', getPublicProfile);

module.exports = router;
