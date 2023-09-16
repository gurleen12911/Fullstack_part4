const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index'); 
const api = supertest(app);
const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'First Blog',
    author: 'John Doe',
    url: 'http://example.com/first-blog',
    likes: 10,
  },
];

beforeAll(async () => {
  await Blog.deleteMany({});

  const blogObjects = initialBlogs.map(blog => new Blog(blog));
  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);

  console.log('Initial data inserted:', await Blog.countDocuments());
});

describe('Blog API', () => {
  test('blogs are returned as json', async () => {
    const response = await api.get('/api/blogs');
    console.log('Response Body:', response.body);
    expect(response.body).toHaveLength(initialBlogs.length);
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(Array.isArray(response.body)).toBe(true); 
    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined();
      expect(blog.title).toBeDefined();
      expect(blog.author).toBeDefined();
      expect(blog.url).toBeDefined();
      if ('likes' in blog) {
        expect(blog.likes).toBeDefined();
      }
    });
  });

  test('blogs have id property', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });

  test('a new blog post is created', async () => {
    const newBlog = {
      title: 'New Blog Post',
      author: 'Test Author',
      url: 'http://example.com/new-blog',
      likes: 5,
    };
  
    const initialBlogs = await api.get('/api/blogs');
    const initialBlogCount = initialBlogs.body.length;
  
    await expect(api.post('/api/blogs').send(newBlog)).resolves.toHaveProperty('status', 201);
    
    const response = await api.get('/api/blogs');
    const updatedBlogCount = response.body.length;
  
    expect(updatedBlogCount).toBe(initialBlogCount + 1);
  });
  

  test('a new blog post is created with default likes', async () => {
    const newBlog = {
      title: 'New Blog Post',
      author: 'Test Author',
      url: 'http://example.com/new-blog',
    };
  
    const initialBlogs = await api.get('/api/blogs');
    const initialBlogCount = initialBlogs.body.length;
  
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  
    const updatedBlogs = await api.get('/api/blogs');
    const updatedBlogCount = updatedBlogs.body.length;
  
    expect(updatedBlogCount).toBe(initialBlogCount + 1);
    expect(response.body.likes).toBeDefined();
    expect(response.body.likes).toBe(0);
  });  
});

