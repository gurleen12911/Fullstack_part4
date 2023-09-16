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

describe('Deleting a blog', () => {
  test('succeeds with valid id', async () => {
    const blogsAtStart = await Blog.find({});
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);

    const blogsAtEnd = await Blog.find({});
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

    const titles = blogsAtEnd.map(b => b.title);
    expect(titles).not.toContain(blogToDelete.title);
  });

  test('fails with status 404 if blog does not exist', async () => {
    const validNonexistingId = new mongoose.Types.ObjectId();

    await api
      .delete(`/api/blogs/${validNonexistingId}`)
      .expect(404);
  });
});
