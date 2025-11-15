// server/routes/postRoutes.js - Routes for Posts

const express = require('express');
const router = express.Router();
const { createPost, getPosts, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// All post routes require the user to be logged in (using the protect middleware)

/**
 * @api POST /api/posts
 * @description Creates a new post. (Protected)
 */
router.post('/', protect, createPost);

/**
 * @api GET /api/posts
 * @description Retrieves all posts (the public feed). (Protected)
 */
router.get('/', protect, getPosts);

/**
 * @api DELETE /api/posts/:id
 * @description Deletes a post by ID. Requires user to be the author. (Protected)
 */
router.delete('/:id', protect, deletePost);

module.exports = router;
