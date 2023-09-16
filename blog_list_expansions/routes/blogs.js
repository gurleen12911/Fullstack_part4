const express = require('express');
const Blog = require('../models/blog');
const User = require('../models/user');
const blogsRouter = express.Router();
const jwt = require('jsonwebtoken');
const middleware = require('../utils/middleware'); 
const authMiddleware = require('../middleware/authMiddleware');

// GET all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  });

  response.json(blogs);
});

// POST a new blog
blogsRouter.post('/', authMiddleware, async (request, response) => {
  const body = request.body;

  // Check if the user is authenticated by verifying the JWT token
  try {
    // Decode the user ID from the JWT token
    const decodedToken = jwt.verify(request.token, process.env.SECRET);

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'Token missing or invalid' });
    }

    const user = await User.findById(decodedToken.id);

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id, // Associate the user as the creator
    });

    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(401).json({ error: 'Token missing or invalid' });
  }
});


blogsRouter.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { likes } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { likes },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

// DELETE a blog by ID
blogsRouter.delete('/:id', async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const userId = req.user.id; // Assuming you have the user ID in the request object

    // Check if the user is the creator of the blog
    if (blog.user.toString() !== userId.toString()) {
      return res.status(401).json({ error: 'Unauthorized to delete this blog' });
    }

    // Delete the blog
    await Blog.findByIdAndRemove(blogId);

    res.status(204).end(); // Successful deletion, no content to return
  } catch (error) {
    next(error);
  }
});


module.exports = blogsRouter;
