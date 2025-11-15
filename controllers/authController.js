// server/controllers/authController.js - Logic for User Auth

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @function generateToken
 * @description Generates a JWT token for the given user ID.
 * @param {string} id - The MongoDB ObjectId of the user
 * @returns {string} The signed JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};

/**
 * @function registerUser
 * @description Handles user registration (POST /api/auth/register).
 * @param {object} req - Request object containing username, email, and password
 * @param {object} res - Response object
 */
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ message: 'User with that email or username already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user
        user = await User.create({
            username,
            email,
            password: hashedPassword, // Store the hashed password
        });

        // Respond with user profile data and JWT
        res.status(201).json({
            ...user.getProfile(), // Uses the instance method to omit password
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

/**
 * @function loginUser
 * @description Handles user login (POST /api/auth/login).
 * @param {object} req - Request object containing email and password
 * @param {object} res - Response object
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email, and explicitly select the password field
        const user = await User.findOne({ email }).select('+password');

        // Check if user exists and password matches
        if (user && (await bcrypt.compare(password, user.password))) {
            // Respond with user profile data and JWT
            res.json({
                ...user.getProfile(), // Uses the instance method to omit password
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

module.exports = {
    registerUser,
    loginUser,
};
