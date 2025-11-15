// server/middleware/authMiddleware.js - JWT Verification

const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * @function protect
 * @description Middleware to protect routes. Verifies the JWT token from the header
 * and attaches the authenticated user's ID to the request object.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const protect = async (req, res, next) => {
    let token;

    // Check if the authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (format: 'Bearer <token>')
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user ID (excluding password) to the request object
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); // Proceed to the next middleware or controller
        } catch (error) {
            console.error(error);
            // 401: Unauthorized - token failed or is invalid
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        // 401: Unauthorized - no token provided
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
