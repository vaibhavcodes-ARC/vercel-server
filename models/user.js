// server/models/User.js - Mongoose Schema for Users

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false // Never return password in queries by default
    },
    // Profile fields
    name: {
        type: String,
        trim: true,
        default: ''
    },
    bio: {
        type: String,
        maxlength: 500,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    website: {
        type: String,
        default: ''
    },
    interests: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * @function getProfile
 * @description Instance method to return a user object without the password field.
 */
userSchema.methods.getProfile = function() {
    // Convert Mongoose document to a plain JavaScript object
    const user = this.toObject(); 
    delete user.password;
    delete user.__v;
    return user;
};

// Prevent model overwrite issues when the file is reloaded in the same process
module.exports = mongoose.models.User || mongoose.model('User', userSchema);