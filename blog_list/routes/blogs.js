const express = require('express');
const Blog = require('../models/blog');

const blogsRouter = express.Router();

blogsRouter.get('/', (request, response, next) => {
  Blog.find({})
    .then(blogs => {
      response.json(blogs);
    })
    .catch(error => next(error));
});

blogsRouter.post('/', (request, response, next) => {
  const body = request.body;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  });

  blog
    .save()
    .then(savedBlog => {
      response.status(201).json(savedBlog);
    })
    .catch(error => next(error));
});

module.exports = blogsRouter;
