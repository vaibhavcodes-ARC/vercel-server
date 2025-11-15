// server/controllers/profileController.js

const User = require('../models/user');

/**
 * @description Get current authenticated user's profile
 */
const getMyProfile = async (req, res) => {
    try {
        // req.user is attached by protect middleware and has user document (without password)
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(req.user.getProfile());
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while retrieving profile' });
    }
};

/**
 * @description Update current authenticated user's profile
 */
const updateMyProfile = async (req, res) => {
    try {
        const allowed = ['name', 'bio', 'avatar', 'location', 'website', 'interests'];
        const updates = {};

        allowed.forEach((field) => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        // If interests is provided as a comma-separated string, convert to array
        if (typeof updates.interests === 'string') {
            updates.interests = updates.interests.split(',').map((s) => s.trim()).filter(Boolean);
        }

        const user = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true,
        }).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user.getProfile());
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
};

/**
 * @description Get a public profile by username (no sensitive fields)
 */
const getPublicProfile = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ username }).select('-password -email');

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user.getProfile());
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching public profile' });
    }
};

module.exports = {
    getMyProfile,
    updateMyProfile,
    getPublicProfile,
};
