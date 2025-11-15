// server/routes/authRoutes.js - Routes for Authentication

const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

/**
 * @api POST /api/auth/register
 * @description Creates a new user.
 */
router.post('/register', registerUser);

/**
 * @api POST /api/auth/login
 * @description Authenticates a user and returns a JWT.
 */
router.post('/login', loginUser);

module.exports = router;
