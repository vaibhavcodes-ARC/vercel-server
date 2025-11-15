// server/models/Post.js - Mongoose Schema for Posts

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    content: {
        type: String,
        required: [true, 'Post content cannot be empty'],
        maxlength: 280 // Standard microblog length limit
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent model overwrite issues when the file is reloaded in the same process
module.exports = mongoose.models.Post || mongoose.model('Post', postSchema);
