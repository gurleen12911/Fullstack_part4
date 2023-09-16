const express = require('express');
const Blog = require('../models/blog');

const blogsRouter = express.Router();

// GET all blogs
blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

// POST a new blog
blogsRouter.post('/', async (request, response, next) => {
  const body = request.body;

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'Title and url are required' });
  }

  if (!body.likes) {
    body.likes = 0;
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  });

  try {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
