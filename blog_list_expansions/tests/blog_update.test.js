const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index');
const Blog = require('../models/blog');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const initialBlogs = [
    {
      title: 'First Blog',
      author: 'Author A',
      url: 'https://example.com/blog1',
      likes: 5,
    },
    {
      title: 'Second Blog',
      author: 'Author B',
      url: 'https://example.com/blog2',
      likes: 10,
    },
  ];

  await Blog.insertMany(initialBlogs);
});

describe('Updating a blog', () => {
  test('succeeds with valid id and updated likes', async () => {
    const blogsAtStart = await Blog.find({});
    const blogToUpdate = blogsAtStart[0];
    const updatedLikes = blogToUpdate.likes + 1;

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: updatedLikes })
      .expect(200);

    expect(response.body.likes).toBe(updatedLikes);

    const updatedBlog = await Blog.findById(blogToUpdate.id);
    expect(updatedBlog.likes).toBe(updatedLikes);
  });

  test('fails with status 404 if blog does not exist', async () => {
    const validNonexistingId = new mongoose.Types.ObjectId();
    const updatedLikes = 100; 

    await api
      .put(`/api/blogs/${validNonexistingId}`)
      .send({ likes: updatedLikes })
      .expect(404);
  });
});
