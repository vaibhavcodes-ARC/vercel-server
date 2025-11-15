// server/controllers/postController.js - Logic for Post CRUD

const Post = require('../models/post');
const User = require('../models/user');

/**
 * @function createPost
 * @description Creates a new post (POST /api/posts). Requires JWT (protect middleware).
 * @param {object} req - Request object containing content and authenticated user ID (req.user)
 * @param {object} res - Response object
 */
const createPost = async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Content field is required' });
    }

    try {
        const post = await Post.create({
            content,
            author: req.user._id, // Set author from the authenticated user
        });

        // Populate author field for the response, selecting only username
        const populatedPost = await post.populate('author', 'username');

        res.status(201).json(populatedPost);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while creating post' });
    }
};

/**
 * @function getPosts
 * @description Retrieves all posts (GET /api/posts). Requires JWT (protect middleware).
 * @param {object} req - Request object
 * @param {object} res - Response object
 */
const getPosts = async (req, res) => {
    try {
        // Fetch all posts, sort by creation date (newest first), and populate author details
        const posts = await Post.find({})
            .sort({ createdAt: -1 }) // Sort by newest first
            .populate('author', 'username') // Only include username from the User model
            .exec();

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching posts' });
    }
};

/**
 * @function deletePost
 * @description Deletes a post (DELETE /api/posts/:id). Requires JWT and author ownership.
 * @param {object} req - Request object containing post ID and authenticated user ID
 * @param {object} res - Response object
 */
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the logged-in user is the post author (must convert to string for comparison)
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await post.deleteOne(); // Use deleteOne on the document instance

        res.json({ message: 'Post removed successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while deleting post' });
    }
};

module.exports = {
    createPost,
    getPosts,
    deletePost,
};